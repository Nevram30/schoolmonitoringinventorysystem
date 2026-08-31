'use client';

import { useCallback, useEffect, useState } from 'react';
import { trpcClient } from '@/trpc/client';
import ItemAvatar from '@/components/ui-components/item.avatar';
import { departmentLabel } from '@/lib/departments';

/**
 * Borrow requests waiting on — or already decided by — an admin.
 *
 * The faculty, staff and student transaction pages all send requests rather than creating borrows
 * directly, so each of them shows this next to the transaction table: without it a requester has
 * no way to find out what happened to what they sent.
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
    } | null;
    Member?: { m_fname: string; m_lname: string; m_department?: string | null } | null;
    Room?: { r_name: string } | null;
    Reviewer?: { name: string } | null;
}

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

const formatDate = (value: Date | string | null | undefined) =>
    value ? new Date(value).toLocaleDateString() : 'N/A';

export default function BorrowRequestsTable({
    refreshKey = 0,
    limit = 5,
}: {
    /** Bump to reload the list — the transaction pages do this after sending a request. */
    refreshKey?: number;
    limit?: number;
}) {
    const [requests, setRequests] = useState<BorrowRequest[]>([]);
    const [pendingTotal, setPendingTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const data = await trpcClient.borrowRequests.list.query({
                page: 1,
                limit,
                search: '',
                status: '',
            });

            if (data.success) {
                setRequests(data.data as BorrowRequest[]);
                setPendingTotal(data.pendingTotal);
            }
        } catch (error) {
            console.error('Error fetching borrow requests:', error);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests, refreshKey]);

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Borrow Requests</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Requests are added to the transactions below once an admin approves them.
                        </p>
                    </div>
                    {pendingTotal > 0 && (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                            {pendingTotal} awaiting approval
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-24">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : requests.length === 0 ? (
                    <p className="py-6 text-center text-sm text-gray-500">
                        No borrow requests yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {request.Member ? `${request.Member.m_fname} ${request.Member.m_lname}` : 'N/A'}
                                        </td>
                                        {/* Abbreviated, with the full program name on hover — the
                                            stored names are too long for a table cell. */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {request.Member?.m_department ? (
                                                <span title={request.Member.m_department}>
                                                    {departmentLabel(request.Member.m_department)}
                                                </span>
                                            ) : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {request.Room?.r_name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {request.br_quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(request.createdAt)}
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
                                            {request.br_review_note && (
                                                <div className="mt-1 max-w-xs text-xs text-gray-500">
                                                    {request.br_review_note}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
