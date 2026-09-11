'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    CameraIcon,
    DocumentArrowDownIcon,
    MagnifyingGlassIcon,
    PrinterIcon,
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

interface ScannedRow {
    record: ScanRecord
    item: InventoryItem
}

/**
 * The scan session lives in this browser, so a count survives a reload or a dropped connection
 * part-way through; "Clear list" starts a new one. Only device IDs and counts are kept — item
 * details are looked up fresh on load.
 */
const STORAGE_KEY = 'inventory-scan-session'
/** The most device IDs the lookup accepts in one request. */
const MAX_RESTORE = 500

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

const readSavedRecords = (): ScanRecord[] => {
    try {
        const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
        return Array.isArray(parsed) ? parsed.filter(isScanRecord).slice(0, MAX_RESTORE) : []
    } catch {
        return []
    }
}

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

    const handleScan = useCallback(
        async (raw: string) => {
            const deviceId = raw.trim()
            if (!deviceId) return
            const now = Date.now()

            // Already on the list: another unit of it.
            const known = itemsRef.current[deviceId]
            const existing = recordsRef.current.find((record) => record.deviceId === deviceId)
            if (known && existing) {
                const count = existing.count + 1
                commitRecords(
                    recordsRef.current.map((record) =>
                        record.deviceId === deviceId ? { ...record, count, lastScannedAt: now } : record
                    )
                )
                report({ kind: 'again', title: `${known.i_model} — counted ${count}`, detail: `Device ID ${deviceId}` }, deviceId)
                return
            }

            if (pendingLookups.current.has(deviceId)) return
            pendingLookups.current.add(deviceId)

            try {
                const result = await trpcClient.items.byDeviceIds.query({ deviceIds: [deviceId] })
                if (!result.success) {
                    report({ kind: 'error', title: 'Could not look up the item', detail: result.error })
                    return
                }

                const item = result.data.find((row) => row.i_deviceID === deviceId)
                if (!item) {
                    report({ kind: 'missing', title: 'No item matches this barcode', detail: `Device ID ${deviceId}` })
                    return
                }

                commitItems({ ...itemsRef.current, [deviceId]: item })
                commitRecords([
                    { deviceId, count: 1, firstScannedAt: now, lastScannedAt: now },
                    ...recordsRef.current.filter((record) => record.deviceId !== deviceId),
                ])
                report({ kind: 'added', title: `${item.i_model} added`, detail: `Device ID ${deviceId}` }, deviceId)
            } catch (error) {
                console.error('Error looking up scanned item:', error)
                report({ kind: 'error', title: 'Could not look up the item', detail: 'Check the connection and scan again.' })
            } finally {
                pendingLookups.current.delete(deviceId)
            }
        },
        [commitItems, commitRecords, report]
    )

    useHandheldScanner(handleScan)

    // Bring back an unfinished count from this browser, with fresh item details.
    useEffect(() => {
        const saved = readSavedRecords()
        if (saved.length === 0) {
            setRestored(true)
            return
        }

        let cancelled = false
        const savedIds = new Set(saved.map((record) => record.deviceId))
        // Anything scanned while this was loading is kept alongside the restored list.
        const keepNewScans = (restoredRecords: ScanRecord[]) => [
            ...recordsRef.current.filter((record) => !savedIds.has(record.deviceId)),
            ...restoredRecords,
        ]

        trpcClient.items.byDeviceIds
            .query({ deviceIds: [...savedIds] })
            .then((result) => {
                if (cancelled) return
                if (!result.success) {
                    commitRecords(keepNewScans(saved))
                    setRestoreNote('Could not load the details of earlier scans. They are kept — reload the page to try again.')
                    return
                }

                commitItems({
                    ...Object.fromEntries(result.data.map((item) => [item.i_deviceID, item])),
                    ...itemsRef.current,
                })
                const found = new Set(result.data.map((item) => item.i_deviceID))
                commitRecords(keepNewScans(saved.filter((record) => found.has(record.deviceId))))
                if (result.missing.length > 0) {
                    setRestoreNote(
                        `${result.missing.length} earlier scanned ${result.missing.length === 1 ? 'item no longer exists and was' : 'items no longer exist and were'} removed from the list.`
                    )
                }
            })
            .catch((error) => {
                console.error('Error restoring scanned items:', error)
                if (cancelled) return
                commitRecords(keepNewScans(saved))
                setRestoreNote('Could not load the details of earlier scans. They are kept — reload the page to try again.')
            })
            .finally(() => {
                if (!cancelled) setRestored(true)
            })

        return () => {
            cancelled = true
        }
    }, [commitItems, commitRecords])

    useEffect(() => {
        if (!restored) return
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
        } catch {
            // Storage blocked: the list still works until the page is reloaded.
        }
    }, [records, restored])

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

    const removeRow = (deviceId: string) => {
        commitRecords(recordsRef.current.filter((record) => record.deviceId !== deviceId))
    }

    const clearList = () => {
        if (!window.confirm(`Clear all ${scannedRows.length} scanned items and start a new count?`)) return
        commitRecords([])
        setFeedback(null)
        setRestoreNote(null)
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

    return (
        <Layout>
            <div className="space-y-5">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Scan barcode labels to count the equipment. Items appear here only when scanned.
                    </p>
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
