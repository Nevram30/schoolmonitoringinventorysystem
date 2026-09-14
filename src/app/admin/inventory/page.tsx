'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
    CameraIcon,
    ClockIcon,
    DocumentArrowDownIcon,
    MagnifyingGlassIcon,
    PrinterIcon,
    TableCellsIcon,
    TrashIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { ScanBarcode } from 'lucide-react'

import Layout from '../Layout'
import {
    escapeHtml,
    openPrintableReport,
    peso,
    photoCellHtml,
    printColorStyles,
} from '@/lib/print-report'
import { downloadExcel, fileDate } from '@/lib/excel-export'
import ItemAvatar from '@/components/ui-components/item.avatar'
import Alert from '@/components/ui-components/alert'
import { useAlert } from '@/components/ui-components/useAlert'
import {
    CameraScanner,
    ScanFeedbackBanner,
    playScanCue,
    unlockScanAudio,
    useHandheldScanner,
    type ScanFeedback,
} from '@/components/ui-components/barcode.scanner'
import { trpcClient } from '@/trpc/client'

interface InventoryItem {
    id: number
    i_deviceID: string
    i_model: string
    i_category: string
    i_brand: string
    i_description: string
    i_type: string
    item_rawstock: number
    i_status: number
    i_mr: string
    i_price: number
    i_photo: string
    no_of_items?: number | null
    remarks?: string | null
}

/** One scanned label: how many times it was scanned (the units counted) and when. */
interface ScanRecord {
    deviceId: string
    count: number
    firstScannedAt: number
    lastScannedAt: number
}

/** A scan as the server returns it: the record plus the item's current details. */
interface ServerScan extends ScanRecord {
    item: InventoryItem
}

interface ScannedRow {
    record: ScanRecord
    item: InventoryItem
}

/**
 * The scan session is kept on the server for each account, so the same user sees the same count
 * on every device; "Clear list" starts a new one. Earlier versions kept it in the browser under
 * this key — a count still there is moved to the account once, on load, and then removed.
 */
const LEGACY_STORAGE_KEY = 'inventory-scan-session'
/** The most scanned items the server keeps for one account. */
const MAX_RESTORE = 500
/** How often an open page picks up scans made on the user's other devices. */
const SYNC_INTERVAL_MS = 15_000

const TABS = [
    { key: 'all', label: 'All Scanned', status: null },
    { key: 'new', label: 'New', status: null },
    { key: 'old', label: 'Old', status: null },
    { key: 'available', label: 'Available', status: 1 },
    { key: 'borrowed', label: 'Borrowed', status: 2 },
    { key: 'maintenance', label: 'Maintenance', status: 3 },
    { key: 'damaged', label: 'Damaged', status: 4 },
] as const

type TabKey = (typeof TABS)[number]['key']

const isScanRecord = (value: unknown): value is ScanRecord => {
    if (typeof value !== 'object' || value === null) return false
    const record = value as Record<string, unknown>
    return (
        typeof record.deviceId === 'string' &&
        typeof record.count === 'number' &&
        typeof record.firstScannedAt === 'number' &&
        typeof record.lastScannedAt === 'number'
    )
}

const readLegacyRecords = (): ScanRecord[] => {
    try {
        const parsed: unknown = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) ?? '[]')
        return Array.isArray(parsed) ? parsed.filter(isScanRecord).slice(0, MAX_RESTORE) : []
    } catch {
        return []
    }
}

const clearLegacyRecords = () => {
    try {
        localStorage.removeItem(LEGACY_STORAGE_KEY)
    } catch {
        // Storage blocked: the import keeps the larger count, so a repeat is harmless.
    }
}

const toRecord = ({ deviceId, count, firstScannedAt, lastScannedAt }: ScanRecord): ScanRecord => ({
    deviceId,
    count,
    firstScannedAt,
    lastScannedAt,
})

const getStatusLabel = (status: number) => {
    switch (status) {
        case 1: return 'Available'
        case 2: return 'Borrowed'
        case 3: return 'Maintenance'
        case 4: return 'Damaged'
        default: return 'Unknown'
    }
}

const statusClasses = (status: number) => {
    switch (status) {
        case 1: return 'bg-green-100 text-green-800'
        case 2: return 'bg-yellow-100 text-yellow-800'
        case 3: return 'bg-blue-100 text-blue-800'
        case 4: return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

const scanTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

function StatusBadge({ status }: { status: number }) {
    return (
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusClasses(status)}`}>
            {getStatusLabel(status)}
        </span>
    )
}

/** Units counted by scanning against the stock on record; green when they agree. */
function CountVsStock({ count, stock }: { count: number; stock: number }) {
    return (
        <span className="text-sm text-gray-600 tabular-nums">
            <strong className={`font-semibold ${count === stock ? 'text-green-700' : 'text-amber-700'}`}>{count}</strong>
            {' / '}
            {stock}
        </span>
    )
}

export default function InventoryPage() {
    const [records, setRecords] = useState<ScanRecord[]>([])
    const [items, setItems] = useState<Record<string, InventoryItem>>({})
    const [restored, setRestored] = useState(false)
    const [restoreNote, setRestoreNote] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<ScanFeedback | null>(null)
    const [highlightId, setHighlightId] = useState<string | null>(null)
    const [cameraOpen, setCameraOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<TabKey>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const { alert, showSuccess, showError, hideAlert } = useAlert()

    // The scan handler runs from keyboard and camera callbacks, possibly several times before
    // React re-renders, so it reads and writes these refs rather than possibly stale state.
    const recordsRef = useRef<ScanRecord[]>([])
    const itemsRef = useRef<Record<string, InventoryItem>>({})
    const pendingLookups = useRef(new Set<string>())
    // Server writes still in flight, and a counter bumped by every local change: a background
    // sync that overlaps either is dropped, so it never undoes a change the server has not seen.
    const inFlight = useRef(0)
    const localChanges = useRef(0)
    // Set while the list could not be loaded, so the next successful sync clears the warning.
    const loadFailed = useRef(false)

    const commitRecords = useCallback((next: ScanRecord[]) => {
        recordsRef.current = next
        setRecords(next)
    }, [])

    const commitItems = useCallback((next: Record<string, InventoryItem>) => {
        itemsRef.current = next
        setItems(next)
    }, [])

    const report = useCallback((next: Omit<ScanFeedback, 'at'>, deviceId?: string) => {
        setFeedback({ ...next, at: Date.now() })
        playScanCue(next.kind === 'added' || next.kind === 'again')
        if (deviceId) setHighlightId(deviceId)
    }, [])

    /** Show the server's scans; `keepLocal` also keeps rows the server's list has not caught up with. */
    const applyServerScans = useCallback(
        (scans: ServerScan[], keepLocal: boolean) => {
            commitItems({ ...itemsRef.current, ...Object.fromEntries(scans.map((scan) => [scan.deviceId, scan.item])) })
            const serverIds = new Set(scans.map((scan) => scan.deviceId))
            commitRecords([
                ...(keepLocal ? recordsRef.current.filter((record) => !serverIds.has(record.deviceId)) : []),
                ...scans.map(toRecord),
            ])
        },
        [commitItems, commitRecords]
    )

    /** Replace the list with the server's copy, unless a local change overlaps the request. */
    const syncFromServer = useCallback(async () => {
        if (inFlight.current > 0) return
        const changesAtStart = localChanges.current
        const result = await trpcClient.inventoryScans.list.query()
        if (!result.success || inFlight.current > 0 || localChanges.current !== changesAtStart) return

        applyServerScans(result.data, false)
        if (loadFailed.current) {
            loadFailed.current = false
            setRestoreNote(null)
        }
    }, [applyServerScans])

    const handleScan = useCallback(
        async (raw: string) => {
            const deviceId = raw.trim()
            if (!deviceId) return
            const now = Date.now()

            // Already on the list: another unit of it, counted straight away so a handheld scanner
            // never waits on the network. The server's total replaces it once the save returns.
            const known = itemsRef.current[deviceId]
            const existing = recordsRef.current.find((record) => record.deviceId === deviceId)
            const repeat = Boolean(known && existing)
            if (known && existing) {
                const count = existing.count + 1
                commitRecords(
                    recordsRef.current.map((record) =>
                        record.deviceId === deviceId ? { ...record, count, lastScannedAt: now } : record
                    )
                )
                report({ kind: 'again', title: `${known.i_model} — counted ${count}`, detail: `Device ID ${deviceId}` }, deviceId)
            } else {
                if (pendingLookups.current.has(deviceId)) return
                pendingLookups.current.add(deviceId)
            }

            const undoRepeat = () =>
                commitRecords(
                    recordsRef.current.map((record) =>
                        record.deviceId === deviceId ? { ...record, count: Math.max(1, record.count - 1) } : record
                    )
                )

            localChanges.current += 1
            inFlight.current += 1
            try {
                const result = await trpcClient.inventoryScans.scan.mutate({ deviceId })
                if (!result.success) {
                    if (result.missing) {
                        commitRecords(recordsRef.current.filter((record) => record.deviceId !== deviceId))
                        report({ kind: 'missing', title: 'No item matches this barcode', detail: `Device ID ${deviceId}` })
                    } else {
                        if (repeat) undoRepeat()
                        report({ kind: 'error', title: 'Could not save the scan', detail: result.error })
                    }
                    return
                }

                const scan = result.data
                const saved = toRecord(scan)
                const current = recordsRef.current.find((record) => record.deviceId === deviceId)
                commitItems({ ...itemsRef.current, [deviceId]: scan.item })
                // The server's total includes scans from this user's other devices. The larger count
                // wins because answers to quick repeat scans can arrive out of order.
                commitRecords([
                    current
                        ? {
                              ...saved,
                              count: Math.max(saved.count, current.count),
                              lastScannedAt: Math.max(saved.lastScannedAt, current.lastScannedAt),
                          }
                        : saved,
                    ...recordsRef.current.filter((record) => record.deviceId !== deviceId),
                ])

                if (!repeat) {
                    report(
                        saved.count > 1
                            ? { kind: 'again', title: `${scan.item.i_model} — counted ${saved.count}`, detail: `Device ID ${deviceId}` }
                            : { kind: 'added', title: `${scan.item.i_model} added`, detail: `Device ID ${deviceId}` },
                        deviceId
                    )
                }
            } catch (error) {
                console.error('Error saving scan:', error)
                if (repeat) undoRepeat()
                report({ kind: 'error', title: 'Could not save the scan', detail: 'Check the connection and scan again.' })
            } finally {
                inFlight.current -= 1
                if (!repeat) pendingLookups.current.delete(deviceId)
            }
        },
        [commitItems, commitRecords, report]
    )

    useHandheldScanner(handleScan)

    // Load this account's count from the server, first moving over any count an earlier version
    // of the page left in this browser.
    useEffect(() => {
        let cancelled = false

        const load = async () => {
            const legacy = readLegacyRecords()
            if (legacy.length > 0) {
                try {
                    const imported = await trpcClient.inventoryScans.importLocal.mutate({ records: legacy })
                    if (!imported.success) throw new Error(imported.error)
                    clearLegacyRecords()
                } catch (error) {
                    console.error('Error moving saved scans to the account:', error)
                    if (!cancelled) {
                        setRestoreNote('Could not move the scans saved on this device to your account. They are kept here — reload the page to try again.')
                    }
                }
            }
            if (cancelled) return

            const result = await trpcClient.inventoryScans.list.query()
            if (!result.success) throw new Error(result.error)
            // Anything scanned while this was loading is kept alongside the loaded list.
            if (!cancelled) applyServerScans(result.data, true)
        }

        load()
            .catch((error) => {
                console.error('Error loading scanned items:', error)
                if (cancelled) return
                loadFailed.current = true
                setRestoreNote('Could not load your scanned items. Scanning still works — the list fills in once the connection is back.')
            })
            .finally(() => {
                if (!cancelled) setRestored(true)
            })

        return () => {
            cancelled = true
        }
    }, [applyServerScans])

    // Pick up scans made on this user's other devices while the page is open.
    useEffect(() => {
        if (!restored) return
        const sync = () => {
            if (document.visibilityState !== 'visible') return
            syncFromServer().catch((error) => console.error('Error syncing scanned items:', error))
        }

        const timer = setInterval(sync, SYNC_INTERVAL_MS)
        document.addEventListener('visibilitychange', sync)
        window.addEventListener('focus', sync)
        return () => {
            clearInterval(timer)
            document.removeEventListener('visibilitychange', sync)
            window.removeEventListener('focus', sync)
        }
    }, [restored, syncFromServer])

    // The row a scan just touched glows briefly, restarting on every scan of it.
    useEffect(() => {
        if (!highlightId) return
        const timer = setTimeout(() => setHighlightId(null), 2500)
        return () => clearTimeout(timer)
    }, [highlightId, feedback])

    // Only scanned rows whose details have loaded; the latest scan first.
    const scannedRows = useMemo<ScannedRow[]>(
        () =>
            records
                .filter((record) => items[record.deviceId])
                .map((record) => ({ record, item: items[record.deviceId]! }))
                .sort((a, b) => b.record.lastScannedAt - a.record.lastScannedAt),
        [records, items]
    )

    // "New" is a heuristic: the most recently added 30% of the scanned items, by id.
    const newThreshold = useMemo(
        () => Math.max(0, ...scannedRows.map((row) => row.item.id)) * 0.7,
        [scannedRows]
    )

    const matchesTab = useCallback(
        (row: ScannedRow, tabKey: TabKey) => {
            const tab = TABS.find((candidate) => candidate.key === tabKey)
            if (tabKey === 'all') return true
            if (tabKey === 'new') return row.item.id > newThreshold
            if (tabKey === 'old') return row.item.id <= newThreshold
            return row.item.i_status === tab?.status
        },
        [newThreshold]
    )

    const filteredRows = useMemo(() => {
        const query = searchTerm.trim().toLowerCase()
        return scannedRows.filter(
            (row) =>
                matchesTab(row, activeTab) &&
                (!query ||
                    [row.item.i_deviceID, row.item.i_model, row.item.i_category, row.item.i_brand, row.item.i_description]
                        .some((field) => field?.toLowerCase().includes(query)))
        )
    }, [scannedRows, activeTab, searchTerm, matchesTab])

    const totalScans = scannedRows.reduce((sum, row) => sum + row.record.count, 0)
    const activeTabLabel = TABS.find((tab) => tab.key === activeTab)?.label ?? 'Inventory'

    const openCamera = () => {
        unlockScanAudio()
        setCameraOpen(true)
    }

    const removeRow = async (deviceId: string) => {
        const removed = recordsRef.current.find((record) => record.deviceId === deviceId)
        if (!removed) return

        localChanges.current += 1
        commitRecords(recordsRef.current.filter((record) => record.deviceId !== deviceId))
        inFlight.current += 1
        try {
            const result = await trpcClient.inventoryScans.remove.mutate({ deviceId })
            if (!result.success) throw new Error(result.error)
        } catch (error) {
            console.error('Error removing scanned item:', error)
            // Put it back, unless it was scanned again in the meantime.
            if (!recordsRef.current.some((record) => record.deviceId === deviceId)) {
                commitRecords([...recordsRef.current, removed])
            }
            showError('Check the connection and try again.', 'Could not remove the item')
        } finally {
            inFlight.current -= 1
        }
    }

    const clearList = async () => {
        if (!window.confirm(`Clear all ${scannedRows.length} scanned items and start a new count?`)) return

        const cleared = recordsRef.current
        localChanges.current += 1
        commitRecords([])
        setFeedback(null)
        setRestoreNote(null)
        inFlight.current += 1
        try {
            const result = await trpcClient.inventoryScans.clear.mutate()
            if (!result.success) throw new Error(result.error)
        } catch (error) {
            console.error('Error clearing scanned items:', error)
            const kept = new Set(recordsRef.current.map((record) => record.deviceId))
            commitRecords([...recordsRef.current, ...cleared.filter((record) => !kept.has(record.deviceId))])
            showError('Check the connection and try again.', 'Could not clear the list')
        } finally {
            inFlight.current -= 1
        }
    }

    /** Both buttons print the rows currently shown — the active tab with the search applied. */
    const buildReportHtml = (compact: boolean) => {
        const cellPadding = compact ? '6px' : '8px'
        const fontSize = compact ? '10px' : '12px'
        const photoSize = compact ? 36 : 44
        const counted = filteredRows.reduce((sum, row) => sum + row.record.count, 0)
        const totalValue = filteredRows.reduce(
            (sum, row) => sum + (Number(row.item.i_price) || 0) * row.record.count,
            0
        )

        const rows = filteredRows
            .map(
                ({ item, record }) => `
                <tr>
                    <td class="photo">${photoCellHtml(item.i_photo, item.i_brand, item.i_model, photoSize)}</td>
                    <td>${escapeHtml(item.i_deviceID)}</td>
                    <td>${escapeHtml(item.i_model)}</td>
                    <td>${escapeHtml(item.i_category)}</td>
                    <td>${escapeHtml(item.i_brand)}</td>
                    <td>${escapeHtml(record.count)}</td>
                    <td>${escapeHtml(item.item_rawstock)}</td>
                    <td>${escapeHtml(getStatusLabel(item.i_status))}</td>
                    <td>${escapeHtml(peso(Number(item.i_price) || 0))}</td>
                    <td>${escapeHtml(scanTime(record.lastScannedAt))}</td>
                </tr>`
            )
            .join('')

        return `
            <html>
                <head>
                    <title>Inventory Count - ${escapeHtml(activeTabLabel)} - ${new Date().toLocaleDateString()}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; ${printColorStyles} }
                        h1 { color: #333; text-align: center; margin-bottom: 4px; }
                        h2 { color: #555; text-align: center; font-size: 14px; font-weight: normal; margin-top: 0; }
                        .meta { font-size: ${fontSize}; color: #444; margin-bottom: 12px; }
                        .meta span { margin-right: 16px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: ${fontSize}; }
                        th { background-color: #f8f9fa; border: 1px solid #ddd; padding: ${cellPadding}; font-weight: bold; text-align: left; }
                        td { border: 1px solid #ddd; padding: ${cellPadding}; }
                        td.photo { width: ${photoSize + 8}px; padding: 4px; }
                        tr { page-break-inside: avoid; }
                        @media print {
                            body { margin: 10px; }
                            thead { display: table-header-group; }
                        }
                    </style>
                </head>
                <body>
                    <h1>Inventory Count Report</h1>
                    <h2>${escapeHtml(activeTabLabel)}</h2>
                    <div class="meta">
                        <span><strong>Generated:</strong> ${new Date().toLocaleString()}</span>
                        <span><strong>Items:</strong> ${filteredRows.length}</span>
                        <span><strong>Units counted:</strong> ${counted}</span>
                        <span><strong>Counted value:</strong> ${peso(totalValue)}</span>
                        ${searchTerm ? `<span><strong>Search:</strong> ${escapeHtml(searchTerm)}</span>` : ''}
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Device ID</th>
                                <th>Model</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Counted</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Price</th>
                                <th>Last scanned</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </body>
            </html>`
    }

    const openReport = (compact: boolean, successText: string) => {
        if (filteredRows.length === 0) {
            showError('Scan some items first — the report lists the scanned items shown.', 'Nothing to export')
            return
        }

        openPrintableReport({
            html: buildReportHtml(compact),
            onBlocked: () =>
                showError('Please allow pop-ups for this site and try again.', 'Blocked by the browser'),
            onReady: () => showSuccess(successText, 'Success'),
            onError: (error) => {
                console.error('Error building inventory report:', error)
                showError('Failed to build the report', 'Something went wrong')
            },
        })
    }

    const handleExportPDF = () =>
        openReport(true, 'Inventory count is ready — choose "Save as PDF" in the print dialog')

    const handlePrint = () => openReport(false, 'Inventory count sent to the print dialog')

    /** Like the reports, the file holds the rows currently shown — the active tab with the search applied. */
    const handleExportExcel = () => {
        if (filteredRows.length === 0) {
            showError('Scan some items first — the file lists the scanned items shown.', 'Nothing to export')
            return
        }

        try {
            downloadExcel({
                filename: `inventory_count_${fileDate()}`,
                sheetName: `Inventory count - ${activeTabLabel}`,
                headers: ['Device ID', 'Model', 'Category', 'Brand', 'Counted', 'Stock', 'Status', 'Price', 'Last scanned'],
                rows: filteredRows.map(({ item, record }) => [
                    item.i_deviceID,
                    item.i_model,
                    item.i_category,
                    item.i_brand,
                    record.count,
                    item.item_rawstock,
                    getStatusLabel(item.i_status),
                    Number(item.i_price) || 0,
                    new Date(record.lastScannedAt).toLocaleString(),
                ]),
            })
            showSuccess('Inventory count saved as an Excel file', 'Success')
        } catch (error) {
            console.error('Error exporting inventory count:', error)
            showError('Failed to build the Excel file', 'Something went wrong')
        }
    }

    return (
        <Layout>
            <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Scan barcode labels to count the equipment. Items appear here only when scanned.
                        </p>
                    </div>
                    <Link
                        href="/admin/inventory/history"
                        className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <ClockIcon className="h-4 w-4" aria-hidden="true" />
                        Monthly history
                    </Link>
                </div>

                {/* Scan panel */}
                <div className="rounded-lg bg-white p-4 shadow sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            onClick={openCamera}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-4 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto sm:py-3"
                        >
                            <CameraIcon className="h-6 w-6" aria-hidden="true" />
                            Scan with camera
                        </button>
                        <p className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="relative mt-1.5 flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                            </span>
                            <span>Handheld scanner ready — scan a label any time on this page.</span>
                        </p>
                    </div>

                    <div role="status" aria-live="polite" data-scan-feedback>
                        {feedback && (
                            <div className="mt-4">
                                <ScanFeedbackBanner feedback={feedback} />
                            </div>
                        )}
                    </div>
                    {restoreNote && <p className="mt-3 text-xs text-amber-700">{restoreNote}</p>}
                </div>

                {/* Summary + actions */}
                <div className="flex flex-wrap items-center gap-2">
                    <p className="mr-auto text-sm text-gray-600">
                        <strong className="text-gray-900">{scannedRows.length}</strong> {scannedRows.length === 1 ? 'item' : 'items'}
                        {' · '}
                        <strong className="text-gray-900">{totalScans}</strong> {totalScans === 1 ? 'unit' : 'units'} counted
                    </p>
                    <button
                        type="button"
                        onClick={handleExportExcel}
                        className="inline-flex items-center rounded bg-green-600 px-3 py-2 text-sm text-white transition-opacity hover:opacity-90"
                    >
                        <TableCellsIcon className="mr-1.5 h-4 w-4" />
                        Excel
                    </button>
                    <button
                        type="button"
                        onClick={handleExportPDF}
                        className="inline-flex items-center rounded bg-red-500 px-3 py-2 text-sm text-white transition-opacity hover:opacity-90"
                    >
                        <DocumentArrowDownIcon className="mr-1.5 h-4 w-4" />
                        PDF
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center rounded bg-gray-600 px-3 py-2 text-sm text-white transition-opacity hover:opacity-90"
                    >
                        <PrinterIcon className="mr-1.5 h-4 w-4" />
                        Print
                    </button>
                    <button
                        type="button"
                        onClick={clearList}
                        disabled={scannedRows.length === 0}
                        className="inline-flex items-center rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <TrashIcon className="mr-1.5 h-4 w-4" />
                        Clear list
                    </button>
                </div>

                {/* Tabs — a sideways-scrolling strip on phones */}
                <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
                    <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
                        {TABS.map((tab) => {
                            const count = scannedRows.filter((row) => matchesTab(row, tab.key)).length
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    aria-pressed={activeTab === tab.key}
                                    className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {tab.label} <span className="opacity-75">({count})</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search scanned items by model, device ID, category or brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-base focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Scanned items */}
                {!restored ? (
                    <div className="flex items-center justify-center rounded-lg bg-white py-12 shadow">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading your scans...</span>
                    </div>
                ) : scannedRows.length === 0 ? (
                    <div className="rounded-lg bg-white px-6 py-12 text-center shadow">
                        <ScanBarcode className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                        <h3 className="mt-3 text-base font-medium text-gray-900">No items scanned yet</h3>
                        <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                            Scan a barcode label with the camera or a handheld scanner. Each scan fills in the item&apos;s
                            details here; scanning the same label again counts another unit.
                        </p>
                        <button
                            type="button"
                            onClick={openCamera}
                            className="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <CameraIcon className="h-5 w-5" aria-hidden="true" />
                            Scan with camera
                        </button>
                    </div>
                ) : filteredRows.length === 0 ? (
                    <div className="rounded-lg bg-white px-6 py-12 text-center text-sm text-gray-500 shadow">
                        No scanned items match this {searchTerm ? 'search' : 'filter'}.
                    </div>
                ) : (
                    <>
                        {/* Phones: one card per item */}
                        <ul className="space-y-3 md:hidden">
                            {filteredRows.map(({ item, record }) => (
                                <li
                                    key={item.i_deviceID}
                                    data-device-id={item.i_deviceID}
                                    data-count={record.count}
                                    className={`rounded-lg p-4 shadow transition-colors duration-500 ${highlightId === item.i_deviceID ? 'bg-green-50 ring-2 ring-green-500' : 'bg-white'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <ItemAvatar
                                            photo={item.i_photo}
                                            brand={item.i_brand}
                                            alt={item.i_model}
                                            className="h-14 w-14 shrink-0"
                                            textClassName="text-lg"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-gray-900 wrap-break-word">{item.i_model}</p>
                                            <p className="text-xs text-gray-500">
                                                {item.i_deviceID} · {item.i_category}
                                            </p>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <StatusBadge status={item.i_status} />
                                                <span className="text-xs text-gray-500">
                                                    Counted <CountVsStock count={record.count} stock={item.item_rawstock} /> in stock
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-400">Last scanned {scanTime(record.lastScannedAt)}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeRow(item.i_deviceID)}
                                            aria-label={`Remove ${item.i_model} from the list`}
                                            className="-mr-2 -mt-2 rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Wider screens: a table */}
                        <div className="hidden overflow-x-auto rounded-lg bg-white shadow md:block">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Device ID', 'Model', 'Category', 'Brand', 'Counted / Stock', 'Status', 'Price', 'Last scanned', ''].map((heading) => (
                                            <th
                                                key={heading || 'actions'}
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                            >
                                                {heading || <span className="sr-only">Actions</span>}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredRows.map(({ item, record }) => (
                                        <tr
                                            key={item.i_deviceID}
                                            data-device-id={item.i_deviceID}
                                            data-count={record.count}
                                            className={`transition-colors duration-500 ${highlightId === item.i_deviceID ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{item.i_deviceID}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                <div className="flex items-center gap-3">
                                                    <ItemAvatar
                                                        photo={item.i_photo}
                                                        brand={item.i_brand}
                                                        alt={item.i_model}
                                                        className="h-10 w-10 shrink-0"
                                                        textClassName="text-sm"
                                                    />
                                                    {item.i_model}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{item.i_category}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{item.i_brand}</td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <CountVsStock count={record.count} stock={item.item_rawstock} />
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <StatusBadge status={item.i_status} />
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                ₱{item.i_price?.toLocaleString() || '0.00'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{scanTime(record.lastScannedAt)}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(item.i_deviceID)}
                                                    aria-label={`Remove ${item.i_model} from the list`}
                                                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                <CameraScanner
                    open={cameraOpen}
                    onClose={() => setCameraOpen(false)}
                    onScan={handleScan}
                    feedback={feedback}
                />

                <Alert
                    type={alert.type}
                    title={alert.title}
                    message={alert.message}
                    isVisible={alert.isVisible}
                    onClose={hideAlert}
                />
            </div>
        </Layout>
    )
}
