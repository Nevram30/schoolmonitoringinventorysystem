'use client';

import { useCallback, useEffect, useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Layout from '../Layout';
import { usePendingRequests } from '../components/pending-requests.context';
import { trpcClient } from '@/trpc/client';
import ItemAvatar from '@/components/ui-components/item.avatar';
import Alert from '@/components/ui-components/alert';
import { useAlert } from '@/components/ui-components/useAlert';

/**
 * Borrow approvals.
 *
 * Faculty, staff and students cannot create a borrow themselves — their transaction pages send a
 * request here instead. Approving one creates the borrow and takes the stock; rejecting one moves
 * nothing and records the reason for the requester to read.
 */

interface BorrowRequest {
    id: number;
    br_quantity: number;
    br_due_date: Date | string;
    br_status: number;
    br_purpose: string | null;
    br_review_note: string | null;
    br_reviewed_at: Date | string | null;
    createdAt: Date | string;
    Item?: {
        i_model: string;
        i_deviceID: string;
        i_photo?: string | null;
        i_brand?: string | null;
        item_rawstock: number;
    } | null;
    Member?: { m_fname: string; m_lname: string; m_school_id: string } | null;
    Room?: { r_name: string } | null;
    Requester?: { name: string; role: string } | null;
    Reviewer?: { name: string } | null;
}

type StatusFilter = '' | 'pending' | 'approved' | 'rejected';

const STATUS_LABEL: Record<number, string> = {
    1: 'Pending',
    2: 'Approved',
    3: 'Rejected',
};

const STATUS_COLOR: Record<number, string> = {
    1: 'bg-yellow-100 text-yellow-800',
    2: 'bg-green-100 text-green-800',
    3: 'bg-red-100 text-red-800',
};

const FILTERS: { value: StatusFilter; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: '', label: 'All' },
];

const formatDate = (value: Date | string | null | undefined) =>
    value ? new Date(value).toLocaleDateString() : 'N/A';

export default function AdminBorrowRequestsPage() {
    return (
        <Layout>
            <BorrowRequestsScreen />
        </Layout>
    );
}

/**
 * Rendered inside <Layout> so it sits under PendingRequestsProvider — that is what lets an
 * approval drop the header bell and sidebar counts immediately instead of on the next poll.
 */
function BorrowRequestsScreen() {
    const [requests, setRequests] = useState<BorrowRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
    const [pendingTotal, setPendingTotal] = useState(0);
    // Id of the request whose approve/reject call is in flight, so only its buttons lock up.
    const [actingOn, setActingOn] = useState<number | null>(null);
    const [rejecting, setRejecting] = useState<BorrowRequest | null>(null);
    const [rejectNote, setRejectNote] = useState('');
    const { alert, showSuccess, showError, hideAlert } = useAlert();
    // Drives the header bell and the sidebar badge; refreshed whenever a request is decided.
    const { refresh: refreshPendingBadges } = usePendingRequests();
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const data = await trpcClient.borrowRequests.list.query({
                page: pagination.page,
                limit: pagination.limit,
                search: searchTerm,
                status: statusFilter,
            });

            if (data.success) {
                setRequests(data.data as BorrowRequest[]);
                setPagination(data.pagination);
                setPendingTotal(data.pendingTotal);
            } else {
                showError(data.error ?? 'Failed to load requests', 'Something went wrong');
            }
        } catch (error) {
            console.error('Error fetching borrow requests:', error);
            showError('Failed to load requests', 'Something went wrong');
        } finally {
            setLoading(false);
        }
        // showError is stable for the lifetime of the page; including it would re-run the fetch.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, pagination.limit, searchTerm, statusFilter]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchTerm(search);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleFilterChange = (value: StatusFilter) => {
        setStatusFilter(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleApprove = async (request: BorrowRequest) => {
        setActingOn(request.id);
        try {
            const data = await trpcClient.borrowRequests.approve.mutate({ id: request.id });

            if (data.success) {
                showSuccess(
                    `${request.Item?.i_model ?? 'Item'} released to ${request.Member?.m_fname ?? 'the borrower'}.`,
                    'Request approved'
                );
                fetchRequests();
                refreshPendingBadges();
            } else {
                showError(data.error ?? 'Failed to approve request', 'Something went wrong');
            }
        } catch (error) {
            console.error('Error approving borrow request:', error);
            showError('Failed to approve request', 'Something went wrong');
        } finally {
            setActingOn(null);
        }
    };

    const handleReject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejecting) return;

        setActingOn(rejecting.id);
        try {
            const data = await trpcClient.borrowRequests.reject.mutate({
                id: rejecting.id,
                note: rejectNote,
            });

            if (data.success) {
                setRejecting(null);
                setRejectNote('');
                showSuccess('The requester will see your reason on their transaction page.', 'Request rejected');
                fetchRequests();
                refreshPendingBadges();
            } else {
                showError(data.error ?? 'Failed to reject request', 'Something went wrong');
            }
        } catch (error) {
            console.error('Error rejecting borrow request:', error);
            showError('Failed to reject request', 'Something went wrong');
        } finally {
            setActingOn(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Borrow Requests</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Approve or reject the borrows faculty, staff and students have asked for.
                        Stock is only taken when you approve.
                    </p>
                </div>
                {pendingTotal > 0 && (
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
                            {pendingTotal} awaiting approval
                        </span>
                    </div>
                )}
            </div>

            {/* Search and Filters */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter.label}
                                type="button"
                                onClick={() => handleFilterChange(filter.value)}
                                className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${statusFilter === filter.value
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {filter.label}
                                {filter.value === 'pending' && pendingTotal > 0 && (
                                    <span
                                        className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${statusFilter === 'pending'
                                            ? 'bg-white text-blue-700'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {pendingTotal}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Search by borrower name, item model, or device ID..."
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
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : requests.length === 0 ? (
                        <p className="py-10 text-center text-sm text-gray-500">
                            {statusFilter === 'pending'
                                ? 'No requests are waiting for approval.'
                                : 'No requests match this view.'}
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {requests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                <div className="flex items-center gap-3">
                                                    <ItemAvatar
                                                        photo={request.Item?.i_photo}
                                                        brand={request.Item?.i_brand}
                                                        alt={request.Item?.i_model ?? ''}
                                                        className="h-10 w-10 shrink-0"
                                                        textClassName="text-sm"
                                                    />
                                                    <div>
                                                        <div className="font-medium">{request.Item?.i_model || 'N/A'}</div>
                                                        <div className="text-xs text-gray-500">{request.Item?.i_deviceID || 'N/A'}</div>
                                                        <div className="text-xs text-gray-400">
                                                            {request.Item?.item_rawstock ?? 0} in stock
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>{request.Member ? `${request.Member.m_fname} ${request.Member.m_lname}` : 'N/A'}</div>
                                                <div className="text-xs text-gray-400">{request.Member?.m_school_id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {request.Room?.r_name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {request.br_quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>{request.Requester?.name || 'N/A'}</div>
                                                <div className="text-xs capitalize text-gray-400">
                                                    {request.Requester?.role} · {formatDate(request.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(request.br_due_date)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLOR[request.br_status] ?? 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {STATUS_LABEL[request.br_status] ?? 'Unknown'}
                                                </span>
                                                {request.br_purpose && (
                                                    <div className="mt-1 max-w-xs text-xs text-gray-500">
                                                        “{request.br_purpose}”
                                                    </div>
                                                )}
                                                {request.br_review_note && (
                                                    <div className="mt-1 max-w-xs text-xs text-gray-400">
                                                        {request.Reviewer?.name}: {request.br_review_note}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                {request.br_status === 1 ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApprove(request)}
                                                            disabled={actingOn === request.id}
                                                            className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                                        >
                                                            {actingOn === request.id ? 'Working...' : 'Approve'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setRejecting(request);
                                                                setRejectNote('');
                                                            }}
                                                            disabled={actingOn === request.id}
                                                            className="px-3 py-1.5 rounded-md text-xs font-medium text-red-700 border border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">
                                                        {formatDate(request.br_reviewed_at)}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="text-sm text-gray-700">
                            Page <span className="font-medium">{pagination.page}</span> of{' '}
                            <span className="font-medium">{pagination.totalPages}</span> ·{' '}
                            <span className="font-medium">{pagination.total}</span> requests
                        </div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === pagination.totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Reject slide-over — the note is what the requester reads, so it is worth typing. */}
            {rejecting && (
                <div className="fixed inset-0 bg-gray-600/25 bg-opacity-20 h-full w-full z-50 flex justify-end">
                    <div className="slide-over-panel relative h-full w-full max-w-md p-5 border-l shadow-xl bg-white overflow-y-auto">
                        <div className="mt-3">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Reject Request</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {rejecting.Item?.i_model} for{' '}
                                        {rejecting.Member ? `${rejecting.Member.m_fname} ${rejecting.Member.m_lname}` : 'the borrower'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setRejecting(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleReject} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Reason <span className="text-gray-400">(optional)</span>
                                    </label>
                                    <textarea
                                        value={rejectNote}
                                        onChange={(e) => setRejectNote(e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Shown to the requester, e.g. the item is booked for a class that week."
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setRejecting(null)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actingOn === rejecting.id}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                    >
                                        {actingOn === rejecting.id ? 'Rejecting...' : 'Reject Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast: rendered last so it stays above the slide-over. */}
            <Alert
                type={alert.type}
                title={alert.title}
                message={alert.message}
                isVisible={alert.isVisible}
                onClose={hideAlert}
            />
        </div>
    );
}
