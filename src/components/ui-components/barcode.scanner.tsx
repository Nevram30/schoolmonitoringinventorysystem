'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType } from '@zxing/library'
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

export interface ScanFeedback {
    kind: 'added' | 'again' | 'missing' | 'error'
    title: string
    detail?: string
    /** When it happened; a new value marks a new scan even when the text repeats. */
    at: number
}

/**
 * Handheld (USB / Bluetooth) scanners behave like keyboards that type the code and press Enter
 * within a few milliseconds. Keys arriving that fast and ended by Enter (or Tab, which some
 * scanners send) count as a scan wherever focus is on the page, so no field has to be selected
 * first. Ordinary typing is far slower and is left alone, as is anything typed into a text field.
 */
const MAX_KEY_GAP_MS = 60
const MIN_CODE_LENGTH = 3

export function useHandheldScanner(onScan: (code: string) => void) {
    const onScanRef = useRef(onScan)
    useEffect(() => {
        onScanRef.current = onScan
    })

    useEffect(() => {
        let buffer = ''
        let lastKeyAt = 0

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey || event.metaKey || event.altKey) return
            const target = event.target as HTMLElement | null
            if (target?.closest('input, textarea, select, [contenteditable="true"]')) return

            const now = performance.now()
            if (now - lastKeyAt > MAX_KEY_GAP_MS) buffer = ''
            lastKeyAt = now

            if (event.key === 'Enter' || event.key === 'Tab') {
                if (buffer.length >= MIN_CODE_LENGTH) {
                    // Keep the scanner's Enter from also "clicking" whatever button has focus.
                    event.preventDefault()
                    event.stopPropagation()
                    onScanRef.current(buffer)
                }
                buffer = ''
                return
            }
            if (event.key.length === 1) buffer += event.key
        }

        // Capture phase, so the Enter is stopped before it reaches a focused button.
        window.addEventListener('keydown', handleKeyDown, true)
        return () => window.removeEventListener('keydown', handleKeyDown, true)
    }, [])
}

let audioContext: AudioContext | null = null

/** Creates / resumes the audio context. Call it from a tap so iPhones let the scan beep play. */
export const unlockScanAudio = () => {
    try {
        audioContext ??= new AudioContext()
        void audioContext.resume()
    } catch {
        // No Web Audio: scans stay silent, the on-screen message still shows.
    }
}

/** A short high beep (and buzz) for a good scan; a low, longer tone for a problem. */
export const playScanCue = (ok: boolean) => {
    if ('vibrate' in navigator) navigator.vibrate(ok ? 60 : [80, 60, 80])

    try {
        audioContext ??= new AudioContext()
        const duration = ok ? 0.12 : 0.3
        const oscillator = audioContext.createOscillator()
        const gain = audioContext.createGain()
        oscillator.type = 'sine'
        oscillator.frequency.value = ok ? 1200 : 320
        gain.gain.setValueAtTime(0.15, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration)
        oscillator.connect(gain).connect(audioContext.destination)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + duration)
    } catch {
        // No Web Audio: scans stay silent, the on-screen message still shows.
    }
}

export function ScanFeedbackBanner({ feedback }: { feedback: ScanFeedback }) {
    const ok = feedback.kind === 'added' || feedback.kind === 'again'
    const Icon = ok ? CheckCircleIcon : ExclamationCircleIcon

    return (
        <div className={`flex items-start gap-3 rounded-md px-3 py-2 ${ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
                <p className="text-sm font-semibold wrap-break-word">{feedback.title}</p>
                {feedback.detail && <p className="text-xs wrap-break-word">{feedback.detail}</p>}
            </div>
        </div>
    )
}

/**
 * The camera sees a label on many frames in a row. A code counts once while it stays in view,
 * and again only after it has been out of view this long — so holding the phone over a label
 * never inflates the count, but scanning the next copy of it does count.
 */
const REPEAT_COOLDOWN_MS = 1500

const cameraErrorMessage = (error: unknown) => {
    const name = error instanceof Error || error instanceof DOMException ? error.name : ''
    if (name === 'NotAllowedError' || name === 'SecurityError') {
        return 'Camera access was blocked. Allow the camera for this site in your browser settings, then try again.'
    }
    if (name === 'NotFoundError' || name === 'OverconstrainedError' || name === 'DevicesNotFoundError') {
        return 'No camera was found on this device. Use a handheld scanner instead.'
    }
    if (name === 'NotReadableError' || name === 'TrackStartError') {
        return 'The camera is in use by another app. Close it and try again.'
    }
    return 'The camera could not be started.'
}

interface CameraScannerProps {
    open: boolean
    onClose: () => void
    onScan: (code: string) => void
    /** Result of the latest scan, shown under the camera so the user knows it registered. */
    feedback: ScanFeedback | null
}

/** Full-screen camera scanner on phones, a dialog on larger screens. Reads Code 128 labels. */
export function CameraScanner({ open, onClose, onScan, feedback }: CameraScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const onScanRef = useRef(onScan)
    const onCloseRef = useRef(onClose)
    const [status, setStatus] = useState<'starting' | 'scanning' | 'error'>('starting')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        onScanRef.current = onScan
        onCloseRef.current = onClose
    })

    useEffect(() => {
        if (!open) return
        const video = videoRef.current
        if (!video) return

        let controls: IScannerControls | undefined
        let cancelled = false
        let lastText = ''
        let lastSeenAt = 0
        setStatus('starting')
        setError(null)

        if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
            setStatus('error')
            setError(
                'The camera only works over a secure (https) connection. Open the app from its https address, or use a handheld scanner.'
            )
            return
        }

        const hints = new Map<DecodeHintType, unknown>([
            [DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128]],
            [DecodeHintType.TRY_HARDER, true],
        ])
        const reader = new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 100 })

        reader
            .decodeFromConstraints(
                {
                    audio: false,
                    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
                },
                video,
                (result) => {
                    if (!result) return
                    const text = result.getText().trim()
                    const now = Date.now()
                    if (!text) return

                    if (text === lastText && now - lastSeenAt < REPEAT_COOLDOWN_MS) {
                        lastSeenAt = now
                        return
                    }
                    lastText = text
                    lastSeenAt = now
                    onScanRef.current(text)
                }
            )
            .then((started) => {
                if (cancelled) {
                    started.stop()
                    return
                }
                controls = started
                setStatus('scanning')
            })
            .catch((startError: unknown) => {
                if (cancelled) return
                console.error('Camera scanner error:', startError)
                setStatus('error')
                setError(cameraErrorMessage(startError))
            })

        return () => {
            cancelled = true
            controls?.stop()
        }
    }, [open])

    // While open: no page scrolling behind it, and Escape closes it.
    useEffect(() => {
        if (!open) return
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onCloseRef.current()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [open])

    if (!open) return null

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Scan barcode"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black sm:bg-black/70 sm:p-4"
        >
            <div className="relative flex h-full w-full flex-col overflow-hidden bg-black sm:h-auto sm:max-w-lg sm:rounded-xl">
                <div className="flex items-center justify-between px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-white">
                    <h2 className="text-base font-semibold">Scan barcode</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        autoFocus
                        aria-label="Close scanner"
                        className="rounded-full p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Clipped so the viewfinder's dimming shadow stays inside the camera view. */}
                <div className="relative flex-1 overflow-hidden sm:aspect-4/3 sm:flex-none">
                    <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" playsInline muted autoPlay />
                    {status !== 'error' && (
                        // Viewfinder shaped for a 1D label; the dimmed surround is its shadow.
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="h-32 w-4/5 max-w-sm rounded-lg border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
                        </div>
                    )}
                    {status === 'starting' && (
                        <p className="absolute inset-x-0 bottom-4 text-center text-sm text-white/80">Starting camera…</p>
                    )}
                    {status === 'error' && (
                        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                            <p className="text-sm text-white">{error}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-3 bg-white px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <div role="status" aria-live="polite">
                        {feedback ? (
                            <ScanFeedbackBanner feedback={feedback} />
                        ) : (
                            <p className="text-sm text-gray-600">Line up the barcode label inside the box.</p>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">
                        Keep scanning — each label is added as it is read. To count another unit, move to its next label.
                    </p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}
