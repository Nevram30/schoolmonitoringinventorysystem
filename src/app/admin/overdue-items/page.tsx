'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Cog6ToothIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    PrinterIcon
} from '@heroicons/react/24/outline';

import Layout from '../Layout';
import ItemAvatar from '@/components/ui-components/item.avatar';
import Alert from '@/components/ui-components/alert';
import { useAlert } from '@/components/ui-components/useAlert';
import { trpcClient } from '@/trpc/client';
import { DEFAULT_FEE_SETTINGS, type FeeSettings } from '@/lib/fees';
import {
    escapeHtml,
    openPrintableReport,
    peso,
    photoCellHtml,
    printColorStyles
} from '@/lib/print-report';

interface UnreturnedItem {
    id: number;
    b_date_borrowed: Date;
    b_due_date: Date;
    b_quantity: number;
    b_purpose: string | null;
    /** Calendar days past the due date. 0 means the item is not late yet. */
    daysOverdue: number;
    /** Days actually billed — `daysOverdue` minus the grace period from settings. */
    chargeableDays: number;
    lateFee: number;
    lateFeeCapped: boolean;
    Item: {
        i_model: string;
        i_deviceID: string;
        i_brand?: string | null;
        i_photo?: string | null;
    };
    Member: {
        m_fname: string;
        m_lname: string;
        m_school_id: string;
        m_contact: string;
        m_department: string;
    };
    Room: {
        r_name: string;
    } | null;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

type Filter = 'overdue' | 'pending' | 'all';

const FILTERS: { value: Filter; label: string }[] = [
    { value: 'overdue', label: 'Overdue' },
    { value: 'pending', label: 'Not yet due' },
    { value: 'all', label: 'All unreturned' }
];

const formatFee = (value: number) => Number(value ?? 0).toFixed(2);

/**
 * Why a row costs what it costs. A fee of 0.00 on an item that is plainly late looks like a bug
 * unless the screen says which part of the policy zeroed it — most often a grace period longer
 * than the delay.
 */
function explainFee(item: UnreturnedItem, policy: FeeSettings): string {
    if (item.daysOverdue === 0) return 'Not late yet';

    if (policy.f_overdue_fee_per_day <= 0) {
        return 'No daily fee set in Settings';
    }

    if (item.chargeableDays === 0) {
        return `Within the ${policy.f_overdue_grace_days}-day grace period`;
    }

    const basis =
        item.chargeableDays === item.daysOverdue
            ? `${item.chargeableDays} day(s) × ${formatFee(policy.f_overdue_fee_per_day)}`
            : `${item.chargeableDays} of ${item.daysOverdue} day(s) × ${formatFee(policy.f_overdue_fee_per_day)}`;

    return item.lateFeeCapped ? `${basis}, capped at the maximum` : basis;
}

/**
 * Items that are still out, and what the borrower owes for holding them past the due date.
 *
 * Only the late fee is shown: a damage fee depends on the condition of the item, which nobody
 * knows until it is actually handed back on /admin/returned-items.
 */
export default function AdminOverdueItemsPage() {
    const [items, setItems] = useState<UnreturnedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<Filter>('overdue');
    const [summary, setSummary] = useState({ unreturned: 0, overdue: 0, totalFees: 0 });
    const [policy, setPolicy] = useState<FeeSettings>(DEFAULT_FEE_SETTINGS);
    const [asOf, setAsOf] = useState<Date | null>(null);
    const [printing, setPrinting] = useState(false);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const { alert, showSuccess, showError, hideAlert } = useAlert();

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const data = await trpcClient.borrows.unreturned.query({
                page: pagination.page,
                limit: pagination.limit,
                search: searchTerm,
                filter
            });

            if (data.success) {
                setItems(data.data);
                setPagination(data.pagination);
                setSummary(data.summary);
                setPolicy(data.policy);
                setAsOf(new Date(data.asOf));
            } else {
                showError(data.error, 'Something went wrong');
            }
        } catch (error) {
            console.error('Error fetching unreturned items:', error);
            showError('Error loading unreturned items', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, searchTerm, filter, showError]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    /** One sentence describing the policy the printed fees were worked out from. */
    const describePolicy = (settings: FeeSettings) => {
        if (settings.f_overdue_fee_per_day <= 0) {
            return 'No overdue fee is configured, so every late fee below is 0.00.';
        }

        const parts = [`${peso(settings.f_overdue_fee_per_day)} per day`];
        if (settings.f_overdue_grace_days > 0) {
            parts.push(`after a ${settings.f_overdue_grace_days}-day grace period`);
        }
        if (settings.f_overdue_max_fee > 0) {
            parts.push(`up to a maximum of ${peso(settings.f_overdue_max_fee)}`);
        }
        return `Charged ${parts.join(', ')}.`;
    };

    const buildReportHtml = (rows: UnreturnedItem[], filterLabel: string, generatedAt: Date) => {
        const totalFees = rows.reduce((sum, row) => sum + (Number(row.lateFee) || 0), 0);
        const overdueCount = rows.filter((row) => row.daysOverdue > 0).length;

        const bodyRows = rows
            .map(
                (row) => `
                <tr>
                  <td class="photo">${photoCellHtml(row.Item.i_photo, row.Item.i_brand, row.Item.i_model, 36)}</td>
                  <td>
                    <strong>${escapeHtml(row.Item.i_model)}</strong><br />
                    ${escapeHtml(row.Item.i_deviceID)}${row.b_quantity > 1 ? ` &middot; Qty ${escapeHtml(row.b_quantity)}` : ''}
                  </td>
                  <td>
                    ${escapeHtml(`${row.Member.m_fname} ${row.Member.m_lname}`)}<br />
                    ${escapeHtml(row.Member.m_school_id)}<br />
                    ${escapeHtml(row.Member.m_contact)}
                  </td>
                  <td>${escapeHtml(row.Member.m_department)}</td>
                  <td>${new Date(row.b_date_borrowed).toLocaleDateString()}</td>
                  <td>${new Date(row.b_due_date).toLocaleDateString()}</td>
                  <td class="num">${row.daysOverdue > 0 ? escapeHtml(row.daysOverdue) : '—'}</td>
                  <td class="num">${escapeHtml(peso(Number(row.lateFee) || 0))}</td>
                  <td>${escapeHtml(row.Room?.r_name ?? '—')}</td>
                </tr>`
            )
            .join('');

        return `
      <html>
        <head>
          <title>${escapeHtml(filterLabel)} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 11px; ${printColorStyles} }
            h1 { color: #333; text-align: center; margin-bottom: 4px; }
            .meta { color: #444; text-align: center; margin-bottom: 12px; }
            .policy { background: #f8f9fa; border: 1px solid #ddd; padding: 8px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th { background-color: #f8f9fa; border: 1px solid #ddd; padding: 6px; font-weight: bold; text-align: left; }
            td { border: 1px solid #ddd; padding: 6px; vertical-align: top; }
            td.photo { width: 44px; padding: 4px; }
            td.num, th.num { text-align: right; }
            tfoot td { font-weight: bold; background: #f8f9fa; }
            tr { page-break-inside: avoid; }
            .totals { margin-top: 12px; display: flex; justify-content: space-between; }
            @media print {
              body { margin: 10px; }
              thead { display: table-header-group; }
            }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(filterLabel)}</h1>
          <div class="meta">
            <strong>Generated:</strong> ${generatedAt.toLocaleString()}
            ${searchTerm ? `&nbsp;&middot;&nbsp; <strong>Search:</strong> ${escapeHtml(searchTerm)}` : ''}
          </div>

          <div class="policy">
            <strong>Fee policy:</strong> ${escapeHtml(describePolicy(policy))}
            Late fees are counted from the day after the due date and exclude damage fees, which are
            assessed when the item is returned.
          </div>

          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Item</th>
                <th>Borrower</th>
                <th>Department</th>
                <th>Borrowed</th>
                <th>Due Date</th>
                <th class="num">Days Overdue</th>
                <th class="num">Late Fee</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              ${bodyRows ||
                  '<tr><td colspan="9" style="text-align: center; color: #666;">No items to report.</td></tr>'}
            </tbody>
            ${rows.length
                ? `<tfoot>
                     <tr>
                       <td colspan="7">Total — ${escapeHtml(rows.length)} item(s), ${escapeHtml(overdueCount)} overdue</td>
                       <td class="num">${escapeHtml(peso(totalFees))}</td>
                       <td></td>
                     </tr>
                   </tfoot>`
                : ''}
          </table>
        </body>
      </html>`;
    };

    /**
     * Prints whichever category is selected — Overdue, Not yet due, or All unreturned. It refetches
     * with the row count as the limit so the report covers every match, not just the page on screen.
     */
    const handlePrintPDF = async () => {
        const filterLabel = FILTERS.find((option) => option.value === filter)?.label ?? 'Unreturned';
        const reportTitle =
            filter === 'overdue'
                ? 'Overdue Items'
                : filter === 'pending'
                    ? 'Items Not Yet Due'
                    : 'All Unreturned Items';

        try {
            setPrinting(true);

            const data = await trpcClient.borrows.unreturned.query({
                page: 1,
                limit: Math.max(pagination.total, 1),
                search: searchTerm,
                filter
            });

            if (!data.success) {
                showError(data.error, 'Something went wrong');
                return;
            }

            if (data.data.length === 0) {
                showError(`There are no ${filterLabel.toLowerCase()} items to print.`, 'Nothing to print');
                return;
            }

            openPrintableReport({
                html: buildReportHtml(data.data, reportTitle, new Date(data.asOf)),
                onBlocked: () =>
                    showError('Please allow pop-ups for this site and try again.', 'Blocked by the browser'),
                onReady: () =>
                    showSuccess(
                        'Choose "Save as PDF" in the print dialog to save the report',
                        'Success'
                    ),
                onError: (error) => {
                    console.error('Error building report:', error);
                    showError('Failed to build the report', 'Something went wrong');
                }
            });
        } catch (error) {
            console.error('Error printing unreturned items:', error);
            showError('Failed to build the report', 'Something went wrong');
        } finally {
            setPrinting(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        setSearchTerm(search);
    };

    const handleFilterChange = (value: Filter) => {
        setPagination(prev => ({ ...prev, page: 1 }));
        setFilter(value);
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Overdue Items</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Items that have not been returned, and the late fee each borrower has run up
                            so far.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                        <Link
                            href="/admin/settings"
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Cog6ToothIcon className="mr-1.5 h-4 w-4" />
                            Fee Settings
                        </Link>
                    </div>
                </div>

                {/* The policy driving every number below, stated plainly so a 0.00 is traceable. */}
                {!loading && (
                    policy.f_overdue_fee_per_day <= 0 ? (
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                            <strong>No overdue fee is set.</strong> Every late fee below will stay 0.00
                            until a daily rate is saved in{' '}
                            <Link href="/admin/settings" className="font-medium underline">
                                Settings
                            </Link>
                            .
                        </div>
                    ) : (
                        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                            Charging <strong>{formatFee(policy.f_overdue_fee_per_day)}</strong> per day
                            {policy.f_overdue_grace_days > 0 && (
                                <>
                                    {' '}after a <strong>{policy.f_overdue_grace_days}-day</strong> grace period
                                    — an item is not charged until it is{' '}
                                    {policy.f_overdue_grace_days + 1} day(s) late
                                </>
                            )}
                            {policy.f_overdue_max_fee > 0 && (
                                <>, up to a maximum of <strong>{formatFee(policy.f_overdue_max_fee)}</strong></>
                            )}
                            .{' '}
                            <Link href="/admin/settings" className="font-medium underline">
                                Change
                            </Link>
                        </div>
                    )
                )}

                {/* Summary */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="bg-white shadow rounded-lg px-4 py-5">
                        <p className="text-sm font-medium text-gray-500">Still out</p>
                        <p className="mt-1 text-3xl font-semibold text-gray-900">{summary.unreturned}</p>
                    </div>
                    <div className="bg-white shadow rounded-lg px-4 py-5">
                        <p className="text-sm font-medium text-gray-500">Overdue</p>
                        <p className="mt-1 text-3xl font-semibold text-red-600">{summary.overdue}</p>
                    </div>
                    <div className="bg-white shadow rounded-lg px-4 py-5">
                        <p className="text-sm font-medium text-gray-500">Late fees accrued</p>
                        <p className="mt-1 text-3xl font-semibold text-gray-900">
                            {formatFee(summary.totalFees)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Across every overdue item{asOf && `, as of ${asOf.toLocaleString()}`}
                        </p>
                    </div>
                </div>

                {/* Search + filter */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6 space-y-4">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Search by borrower, school ID, item model, device ID or room..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Search
                            </button>
                        </form>

                        <div className="flex flex-wrap items-center gap-2">
                            {FILTERS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleFilterChange(option.value)}
                                    className={`rounded-md px-3 py-1.5 text-sm font-medium border ${filter === option.value
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}

                            {/* Prints the selected category, so each of the three has its own report. */}
                            <button
                                type="button"
                                onClick={handlePrintPDF}
                                disabled={printing || loading}
                                title={`Print the ${FILTERS.find((option) => option.value === filter)?.label.toLowerCase()} list as PDF`}
                                className="ml-auto inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <PrinterIcon className="mr-1.5 h-4 w-4" />
                                {printing ? 'Preparing...' : 'Print PDF'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Overdue</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late Fee</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {items.map((item) => {
                                            const isOverdue = item.daysOverdue > 0;

                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <ItemAvatar
                                                                photo={item.Item.i_photo}
                                                                brand={item.Item.i_brand}
                                                                alt={item.Item.i_model}
                                                                className="h-10 w-10 shrink-0"
                                                                textClassName="text-sm"
                                                            />
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{item.Item.i_model}</div>
                                                                <div className="text-xs text-blue-600">{item.Item.i_deviceID}</div>
                                                                {item.b_quantity > 1 && (
                                                                    <div className="text-xs text-gray-400">Qty {item.b_quantity}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div>{`${item.Member.m_fname} ${item.Member.m_lname}`}</div>
                                                        <div className="text-xs text-gray-400">{item.Member.m_school_id}</div>
                                                        <div className="text-xs text-gray-400">{item.Member.m_contact}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(item.b_date_borrowed).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(item.b_due_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {isOverdue ? (
                                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                                                                <ExclamationTriangleIcon className="mr-1 h-3.5 w-3.5" />
                                                                {item.daysOverdue} day{item.daysOverdue === 1 ? '' : 's'}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                                                                Not yet due
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className={`text-sm font-medium ${item.lateFee > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                                            {formatFee(item.lateFee)}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {explainFee(item, policy)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.Room?.r_name ?? '—'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {items.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-sm text-gray-500">
                                            {filter === 'overdue'
                                                ? 'No overdue items. Everything still out is within its due date.'
                                                : 'No unreturned items found.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <p className="text-sm text-gray-700">
                                Showing{' '}
                                <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>{' '}
                                to{' '}
                                <span className="font-medium">
                                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                                </span>{' '}
                                of <span className="font-medium">{pagination.total}</span> results
                            </p>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    )}
                </div>

                <p className="text-xs text-gray-500">
                    Late fees are counted from the day after the due date, using the fee policy on{' '}
                    <Link href="/admin/settings" className="text-blue-600 hover:underline">
                        Settings
                    </Link>
                    . Damage fees are not included here — they are assessed on Returned Items once the
                    item is actually handed back.
                </p>

                <Alert
                    type={alert.type}
                    title={alert.title}
                    message={alert.message}
                    isVisible={alert.isVisible}
                    onClose={hideAlert}
                />
            </div>
        </Layout>
    );
}
