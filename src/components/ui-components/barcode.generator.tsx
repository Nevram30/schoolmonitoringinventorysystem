'use client'

import { useEffect, useMemo, useState } from 'react'
import JsBarcode from 'jsbarcode'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Barcode, Printer } from 'lucide-react'

import { escapeHtml, openPrintableReport } from '@/lib/print-report'
import { trpcClient } from '@/trpc/client'

interface BarcodeItem {
    id: number
    i_deviceID: string
    i_model: string
    i_brand?: string | null
    i_category?: string | null
}

interface BarcodeGeneratorProps {
    onSuccess: (message: string, title: string) => void
    onError: (message: string, title: string) => void
}

/** Enough to load the whole inventory in one request; the list is filtered client-side. */
const ITEM_LIMIT = 1000
const MAX_COPIES = 50

/**
 * Code 128 SVG markup for a device ID, or null when the ID holds characters Code 128 cannot
 * encode (only possible for legacy, hand-typed IDs). JsBarcode writes the human-readable text
 * with textContent, so the markup is safe to inject.
 */
const barcodeSvg = (value: string) => {
    // With `valid` set, JsBarcode reports input it cannot encode instead of throwing, so a
    // genuine failure below is not mistaken for a bad device ID.
    let encodable = true

    try {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        JsBarcode(svg, value, {
            format: 'CODE128',
            width: 2,
            height: 60,
            fontSize: 14,
            margin: 6,
            valid: (isValid) => {
                encodable = isValid
            },
        })
        return encodable ? svg.outerHTML : null
    } catch (error) {
        console.error(`Error generating barcode for "${value}":`, error)
        return null
    }
}

/**
 * Turns device IDs into scannable Code 128 barcodes: pick items, preview their labels and
 * print a sheet of them to stick on the equipment.
 */
export default function BarcodeGenerator({ onSuccess, onError }: BarcodeGeneratorProps) {
    const [items, setItems] = useState<BarcodeItem[]>([])
    const [loading, setLoading] = useState(true)
    const [loadFailed, setLoadFailed] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [copies, setCopies] = useState('1')

    useEffect(() => {
        let cancelled = false

        trpcClient.items.list
            .query({ page: 1, limit: ITEM_LIMIT, search: '', category: '' })
            .then((result) => {
                if (cancelled) return
                if (result.success) setItems(result.data)
                else setLoadFailed(true)
            })
            .catch((error) => {
                console.error('Error fetching items for barcodes:', error)
                if (!cancelled) setLoadFailed(true)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [])

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return items

        return items.filter((item) =>
            [item.i_model, item.i_deviceID, item.i_brand, item.i_category]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(query))
        )
    }, [items, search])

    // Keeps the inventory order rather than the order the boxes were ticked.
    const selectedItems = useMemo(
        () => items.filter((item) => selectedIds.has(item.id)),
        [items, selectedIds]
    )

    const barcodes = useMemo(
        () => new Map(selectedItems.map((item) => [item.id, barcodeSvg(item.i_deviceID)])),
        [selectedItems]
    )

    const toggleItem = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const selectAllFiltered = () => {
        setSelectedIds((prev) => new Set([...prev, ...filtered.map((item) => item.id)]))
    }

    const copiesPerItem = Math.min(Math.max(parseInt(copies) || 1, 1), MAX_COPIES)

    const handlePrint = () => {
        const printable = selectedItems.filter((item) => barcodes.get(item.id))
        const skipped = selectedItems.length - printable.length

        if (printable.length === 0) {
            onError('Select at least one item with a valid device ID.', 'Nothing to print')
            return
        }

        const labels = printable
            .flatMap((item) => {
                const label = `
                    <div class="label">
                        <div class="name">${escapeHtml(item.i_model)}</div>
                        ${barcodes.get(item.id)}
                    </div>`
                return Array.from({ length: copiesPerItem }, () => label)
            })
            .join('')

        openPrintableReport({
            html: `
                <html>
                    <head>
                        <title>Device ID Barcodes - ${new Date().toLocaleDateString()}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 12px; }
                            .sheet { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
                            .label { border: 1px dashed #bbb; padding: 8px; text-align: center; break-inside: avoid; page-break-inside: avoid; }
                            .name { font-size: 11px; font-weight: bold; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                            .label svg { max-width: 100%; height: auto; }
                            @media print { body { margin: 6px; } }
                        </style>
                    </head>
                    <body>
                        <div class="sheet">${labels}</div>
                    </body>
                </html>`,
            onBlocked: () =>
                onError('Please allow pop-ups for this site and try again.', 'Blocked by the browser'),
            onReady: () =>
                onSuccess(
                    skipped > 0
                        ? `Print dialog opened. ${skipped} item(s) were skipped because their device ID cannot be encoded.`
                        : 'Print dialog opened. Choose "Save as PDF" to keep a copy.',
                    'Barcodes Ready'
                ),
            onError: (error) => {
                console.error('Error building barcode sheet:', error)
                onError('Failed to build the barcode sheet', 'Something went wrong')
            },
        })
    }

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="mb-4 sm:flex sm:items-start sm:justify-between">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg leading-6 font-medium text-gray-900">
                            <Barcode className="h-5 w-5 text-gray-500" />
                            Barcode Generator
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Generate Code 128 barcodes from item device IDs and print them as labels.
                        </p>
                    </div>
                    <div className="mt-4 flex items-end gap-3 sm:mt-0">
                        <div>
                            <label htmlFor="barcodeCopies" className="block text-xs font-medium text-gray-700">
                                Copies per item
                            </label>
                            <input
                                id="barcodeCopies"
                                type="number"
                                min="1"
                                max={MAX_COPIES}
                                value={copies}
                                onChange={(e) => setCopies(e.target.value)}
                                className="mt-1 block w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handlePrint}
                            disabled={selectedItems.length === 0}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Printer className="-ml-1 mr-2 h-4 w-4" />
                            Print Labels
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Item selection */}
                    <div>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by model, device ID, brand or category..."
                                className="block w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                            <span>
                                {selectedItems.length} selected
                                {selectedItems.length > 0 && ` · ${selectedItems.length * copiesPerItem} label(s)`}
                            </span>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={selectAllFiltered}
                                    disabled={filtered.length === 0}
                                    className="font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                >
                                    Select all{search ? ' shown' : ''}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedIds(new Set())}
                                    disabled={selectedIds.size === 0}
                                    className="font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="mt-2 max-h-96 overflow-y-auto rounded-md border border-gray-200">
                            {loading ? (
                                <div className="flex h-32 items-center justify-center">
                                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                </div>
                            ) : loadFailed ? (
                                <p className="py-8 text-center text-sm text-red-600">Failed to load items.</p>
                            ) : filtered.length === 0 ? (
                                <p className="py-8 text-center text-sm text-gray-500">No items match your search.</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {filtered.map((item) => (
                                        <li key={item.id}>
                                            <label className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.has(item.id)}
                                                    onChange={() => toggleItem(item.id)}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm font-medium text-gray-900">
                                                        {item.i_model}
                                                    </span>
                                                    <span className="block truncate text-xs text-gray-500">
                                                        {item.i_deviceID}
                                                        {item.i_category && ` · ${item.i_category}`}
                                                    </span>
                                                </span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Label preview */}
                    <div>
                        <p className="text-sm font-medium text-gray-700">Preview</p>
                        {selectedItems.length === 0 ? (
                            <div className="mt-2 flex h-40 items-center justify-center rounded-md border-2 border-dashed border-gray-200">
                                <p className="text-sm text-gray-500">Select items to preview their barcodes.</p>
                            </div>
                        ) : (
                            <div className="mt-2 grid max-h-104 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
                                {selectedItems.map((item) => {
                                    const svg = barcodes.get(item.id)

                                    return (
                                        <div
                                            key={item.id}
                                            className="relative rounded-md border border-dashed border-gray-300 p-3 text-center"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleItem(item.id)}
                                                className="absolute right-1 top-1 text-gray-400 hover:text-gray-600"
                                                title="Remove"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                            <p className="truncate px-4 text-xs font-semibold text-gray-900">{item.i_model}</p>
                                            {svg ? (
                                                <div
                                                    className="mt-1 [&>svg]:mx-auto [&>svg]:h-auto [&>svg]:max-w-full"
                                                    dangerouslySetInnerHTML={{ __html: svg }}
                                                />
                                            ) : (
                                                <p className="mt-2 text-xs text-red-600">
                                                    &quot;{item.i_deviceID}&quot; cannot be encoded as a barcode.
                                                </p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
