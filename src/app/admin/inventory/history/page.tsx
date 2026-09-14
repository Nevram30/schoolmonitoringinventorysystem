'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    ArrowLeftIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    TableCellsIcon,
} from '@heroicons/react/24/outline'
import { ScanBarcode } from 'lucide-react'

import Layout from '../../Layout'
import ItemAvatar from '@/components/ui-components/item.avatar'
import Alert from '@/components/ui-components/alert'
import { useAlert } from '@/components/ui-components/useAlert'
import { downloadExcel } from '@/lib/excel-export'
import { peso } from '@/lib/print-report'
import { trpcClient } from '@/trpc/client'

type HistoryResult = Awaited<ReturnType<typeof trpcClient.inventoryScans.history.query>>
type HistoryRow = Extract<HistoryResult, { success: true }>['data'][number]

type LoadState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'ready'; rows: HistoryRow[] }

/** Midnight on the 1st of the month `offset` months from `month`, in the user's time zone. */
const addMonths = (month: Date, offset: number) => new Date(month.getFullYear(), month.getMonth() + offset, 1)
const startOfThisMonth = () => addMonths(new Date(), 0)

const monthLabel = (month: Date, format: 'long' | 'short' = 'long') =>
    month.toLocaleDateString('en-US', { month: format, year: 'numeric' })

const scanDate = (timestamp: number) =>
    new Date(timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

/** Units counted against the stock on record; green when they agree. */
function CountVsStock({ count, stock }: { count: number; stock: number }) {
    return (
        <span className="text-sm text-gray-600 tabular-nums">
            <strong className={`font-semibold ${count === stock ? 'text-green-700' : 'text-amber-700'}`}>{count}</strong>
            {' / '}
            {stock}
        </span>
    )
}

export default function InventoryHistoryPage() {
    const [month, setMonth] = useState(startOfThisMonth)
    const [state, setState] = useState<LoadState>({ status: 'loading' })
    const [reloadKey, setReloadKey] = useState(0)
    const { alert, showSuccess, showError, hideAlert } = useAlert()

    // No history exists for months that have not started yet.
    const isCurrentMonth = month.getTime() >= startOfThisMonth().getTime()

    useEffect(() => {
        let cancelled = false
        setState({ status: 'loading' })

        trpcClient.inventoryScans.history
            .query({ from: month.getTime(), to: addMonths(month, 1).getTime() })
            .then((result) => {
                if (cancelled) return
                setState(result.success ? { status: 'ready', rows: result.data } : { status: 'error', message: result.error })
            })
            .catch((error) => {
                console.error('Error loading inventory history:', error)
                if (!cancelled) setState({ status: 'error', message: 'Check the connection and try again.' })
            })

        return () => {
            cancelled = true
        }
    }, [month, reloadKey])

    const rows = state.status === 'ready' ? state.rows : []
    const totalUnits = rows.reduce((sum, row) => sum + row.count, 0)

    const handleExportExcel = () => {
        if (rows.length === 0) {
            showError(`Nothing was counted in ${monthLabel(month)}.`, 'Nothing to export')
            return
        }

        try {
            downloadExcel({
                filename: `inventory_history_${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`,
                sheetName: monthLabel(month),
                headers: ['Device ID', 'Model', 'Category', 'Brand', 'Units counted', 'Stock', 'Price', 'First scanned', 'Last scanned'],
                rows: rows.map(({ item, count, firstScannedAt, lastScannedAt }) => [
                    item.i_deviceID,
                    item.i_model,
                    item.i_category,
                    item.i_brand,
                    count,
                    item.item_rawstock,
                    Number(item.i_price) || 0,
                    new Date(firstScannedAt).toLocaleString(),
                    new Date(lastScannedAt).toLocaleString(),
                ]),
            })
            showSuccess(`${monthLabel(month)} history saved as an Excel file`, 'Success')
        } catch (error) {
            console.error('Error exporting inventory history:', error)
            showError('Failed to build the Excel file', 'Something went wrong')
        }
    }

    return (
        <Layout>
            <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <Link
                            href="/admin/inventory"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
                            Back to scanning
                        </Link>
                        <h1 className="mt-1 text-2xl font-semibold text-gray-900">Inventory history</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Everything you counted each month — kept even after the scan list is cleared.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleExportExcel}
                        disabled={state.status !== 'ready'}
                        className="inline-flex items-center rounded bg-green-600 px-3 py-2 text-sm text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <TableCellsIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Excel
                    </button>
                </div>

                {/* Month switcher */}
                <div className="flex items-center justify-between gap-2 rounded-lg bg-white p-2 shadow">
                    <button
                        type="button"
                        onClick={() => setMonth(addMonths(month, -1))}
                        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">{monthLabel(addMonths(month, -1), 'short')}</span>
                        <span className="sm:hidden">Previous</span>
                    </button>
                    <h2 className="text-base font-semibold text-gray-900" aria-live="polite">
                        {monthLabel(month)}
                    </h2>
                    <button
                        type="button"
                        onClick={() => setMonth(addMonths(month, 1))}
                        disabled={isCurrentMonth}
                        title={isCurrentMonth ? 'This is the current month' : undefined}
                        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                        <span className="hidden sm:inline">{monthLabel(addMonths(month, 1), 'short')}</span>
                        <span className="sm:hidden">Next</span>
                        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>

                {state.status === 'ready' && rows.length > 0 && (
                    <p className="text-sm text-gray-600">
                        <strong className="text-gray-900">{rows.length}</strong> {rows.length === 1 ? 'item' : 'items'}
                        {' · '}
                        <strong className="text-gray-900">{totalUnits}</strong> {totalUnits === 1 ? 'unit' : 'units'} counted
                    </p>
                )}

                {state.status === 'loading' ? (
                    <div className="flex items-center justify-center rounded-lg bg-white py-12 shadow">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading {monthLabel(month)}...</span>
                    </div>
                ) : state.status === 'error' ? (
                    <div className="rounded-lg bg-white px-6 py-12 text-center shadow">
                        <p className="text-sm font-medium text-gray-900">Could not load the history</p>
                        <p className="mt-1 text-sm text-gray-500">{state.message}</p>
                        <button
                            type="button"
                            onClick={() => setReloadKey((key) => key + 1)}
                            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Try again
                        </button>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="rounded-lg bg-white px-6 py-12 text-center shadow">
                        <ScanBarcode className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                        <h3 className="mt-3 text-base font-medium text-gray-900">Nothing counted in {monthLabel(month)}</h3>
                        <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                            Items you scan on the inventory page show up here under the month they were scanned.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Phones: one card per item */}
                        <ul className="space-y-3 md:hidden">
                            {rows.map(({ item, count, firstScannedAt, lastScannedAt }) => (
                                <li key={item.i_deviceID} className="rounded-lg bg-white p-4 shadow">
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
                                            <p className="mt-2 text-xs text-gray-500">
                                                Counted <CountVsStock count={count} stock={item.item_rawstock} /> in stock
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {count > 1 ? `${scanDate(firstScannedAt)} – ${scanDate(lastScannedAt)}` : scanDate(lastScannedAt)}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Wider screens: a table */}
                        <div className="hidden overflow-x-auto rounded-lg bg-white shadow md:block">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Device ID', 'Model', 'Category', 'Brand', 'Counted / Stock', 'Price', 'First scanned', 'Last scanned'].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {rows.map(({ item, count, firstScannedAt, lastScannedAt }) => (
                                        <tr key={item.i_deviceID} className="hover:bg-gray-50">
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
                                                <CountVsStock count={count} stock={item.item_rawstock} />
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{peso(Number(item.i_price) || 0)}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{scanDate(firstScannedAt)}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{scanDate(lastScannedAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

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
