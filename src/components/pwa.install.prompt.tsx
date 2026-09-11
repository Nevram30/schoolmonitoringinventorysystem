'use client'

import { useEffect, useState } from 'react'
import { ArrowUpOnSquareIcon, EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/outline'

/** Chrome / Edge / Samsung Internet event that lets the page open the install dialog itself. */
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

type Platform = 'android' | 'ios'

const DISMISS_KEY = 'pwa-install-dismissed-at'
/** After "Not now", stay quiet this long. */
const DISMISS_FOR_MS = 14 * 24 * 60 * 60 * 1000
/** Let the page settle — and Chrome decide whether the app is installable — before asking. */
const SHOW_AFTER_MS = 2500
const INSTALLABLE_EVENT = 'spms-installable'

// Chrome can fire `beforeinstallprompt` before React has mounted this component, so it is caught
// as soon as this module loads. preventDefault keeps Chrome's own mini-bar away: the banner below
// offers the same install.
let deferredPrompt: BeforeInstallPromptEvent | null = null
if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault()
        deferredPrompt = event as BeforeInstallPromptEvent
        window.dispatchEvent(new Event(INSTALLABLE_EVENT))
    })
}

const detectPlatform = (): Platform | null => {
    const userAgent = navigator.userAgent
    // iPadOS reports itself as a Mac; touch support gives it away.
    const isIOS = /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1)
    if (isIOS) return 'ios'
    if (/Android/i.test(userAgent)) return 'android'
    return null
}

/** Already running from the home screen (installed), on Android or iOS. */
const isInstalled = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true

const recentlyDismissed = () => {
    try {
        const dismissedAt = Number(localStorage.getItem(DISMISS_KEY))
        return dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_FOR_MS
    } catch {
        return false
    }
}

function StepNumber({ n }: { n: number }) {
    return (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-semibold text-blue-700">
            {n}
        </span>
    )
}

/**
 * Invites phone users to install SPMS to the home screen. Android gets an Install button that
 * opens the browser's own install dialog (or the menu steps, when the browser has not offered
 * one); iOS, which lets no page trigger installation, gets the Share → Add to Home Screen steps.
 * Hidden on computers, once installed, and for two weeks after "Not now".
 */
export default function InstallAppPrompt() {
    const [platform, setPlatform] = useState<Platform | null>(null)
    const [canPrompt, setCanPrompt] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const detected = detectPlatform()
        if (!detected || isInstalled() || recentlyDismissed()) return

        setPlatform(detected)
        setCanPrompt(deferredPrompt !== null)

        const handleInstallable = () => setCanPrompt(true)
        const handleInstalled = () => {
            deferredPrompt = null
            setVisible(false)
        }
        window.addEventListener(INSTALLABLE_EVENT, handleInstallable)
        window.addEventListener('appinstalled', handleInstalled)
        const timer = setTimeout(() => setVisible(true), SHOW_AFTER_MS)

        return () => {
            clearTimeout(timer)
            window.removeEventListener(INSTALLABLE_EVENT, handleInstallable)
            window.removeEventListener('appinstalled', handleInstalled)
        }
    }, [])

    if (!visible || !platform) return null

    const dismiss = () => {
        try {
            localStorage.setItem(DISMISS_KEY, String(Date.now()))
        } catch {
            // Storage blocked: it simply asks again on the next visit.
        }
        setVisible(false)
    }

    const install = async () => {
        const prompt = deferredPrompt
        if (!prompt) return
        // A prompt event can only be used once.
        deferredPrompt = null
        setCanPrompt(false)
        await prompt.prompt()
        const { outcome } = await prompt.userChoice
        if (outcome === 'accepted') setVisible(false)
        else dismiss()
    }

    return (
        <div
            role="region"
            aria-label="Install the app"
            className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-96 sm:px-0 sm:pb-0"
        >
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
                <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/icon-192.png" alt="" className="h-12 w-12 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900">Install SPMS on your phone</p>
                        <p className="mt-0.5 text-xs text-gray-600">
                            Open it from your home screen, full-screen like an app — handy for scanning inventory labels.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={dismiss}
                        aria-label="Dismiss"
                        className="-m-1 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                {platform === 'android' && canPrompt ? (
                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            onClick={dismiss}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Not now
                        </button>
                        <button
                            type="button"
                            onClick={install}
                            className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Install
                        </button>
                    </div>
                ) : (
                    <>
                        <ol className="mt-3 space-y-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
                            {platform === 'ios' ? (
                                <>
                                    <li className="flex items-center gap-2">
                                        <StepNumber n={1} />
                                        <span>
                                            Tap{' '}
                                            <ArrowUpOnSquareIcon className="inline h-4 w-4 align-text-bottom text-blue-600" aria-hidden="true" />{' '}
                                            <strong>Share</strong> in the browser toolbar
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <StepNumber n={2} />
                                        <span>
                                            Choose <strong>Add to Home Screen</strong>
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <StepNumber n={3} />
                                        <span>
                                            Tap <strong>Add</strong>
                                        </span>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="flex items-center gap-2">
                                        <StepNumber n={1} />
                                        <span>
                                            Tap{' '}
                                            <EllipsisVerticalIcon className="inline h-4 w-4 align-text-bottom text-gray-700" aria-hidden="true" />{' '}
                                            the browser menu
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <StepNumber n={2} />
                                        <span>
                                            Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <StepNumber n={3} />
                                        <span>
                                            Confirm with <strong>Install</strong>
                                        </span>
                                    </li>
                                </>
                            )}
                        </ol>
                        <button
                            type="button"
                            onClick={dismiss}
                            className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Not now
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
