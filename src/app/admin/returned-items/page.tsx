'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Cog6ToothIcon, MagnifyingGlassIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

import Layout from '../Layout';
import ItemAvatar from '@/components/ui-components/item.avatar';
import Alert from '@/components/ui-components/alert';
import { useAlert } from '@/components/ui-components/useAlert';
import { trpcClient } from '@/trpc/client';
import { DEFAULT_FEE_SETTINGS, suggestFees, type FeeSettings } from '@/lib/fees';

interface ReturnedItem {
    id: number;
    r_date_returned: Date;
    r_quantity: number;
    r_condition: string | null;
    r_notes: string | null;
    r_late_fee: number;
    r_damage_fee: number;
    Borrow: {
        b_due_date: Date;
    } | null;
    Item: {
        i_model: string;
        i_deviceID: string;
        i_brand?: string | null;
        i_photo?: string | null;
        i_price?: number | null;
    };
    Member: {
        m_fname: string;
        m_lname: string;
        m_school_id: string;
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

const formatFee = (value: number) => Number(value ?? 0).toFixed(2);

/**
 * Returned items, with the fee controls. Faculty and staff record the return itself; only an
 * admin assesses what the borrower owes, so this is the only screen where fees can be edited.
 */
export default function AdminReturnedItemsPage() {
    const [returnedItems, setReturnedItems] = useState<ReturnedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState<ReturnedItem | null>(null);
    const [showFeesModal, setShowFeesModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [feeForm, setFeeForm] = useState({ lateFee: '0', damageFee: '0' });
    const [feeSettings, setFeeSettings] = useState<FeeSettings>(DEFAULT_FEE_SETTINGS);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const { alert, showSuccess, showError, hideAlert } = useAlert();

    const fetchReturnedItems = useCallback(async () => {
        try {
            setLoading(true);
            const data = await trpcClient.returns.list.query({
                page: pagination.page,
                limit: pagination.limit,
                search
            });

            if (data.success) {
                setReturnedItems(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching returned items:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, search]);

    useEffect(() => {
        fetchReturnedItems();
    }, [fetchReturnedItems]);

    // The fee policy set on /admin/settings; used to suggest what each return should be charged.
    useEffect(() => {
        trpcClient.settings.getFees
            .query()
            .then((data) => {
                if (data.success) setFeeSettings(data.data);
            })
            .catch((error) => console.error('Error fetching fee settings:', error));
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchReturnedItems();
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    /** What the saved fee policy says this return should cost. */
    const suggestionFor = (item: ReturnedItem) =>
        suggestFees(feeSettings, {
            dueDate: item.Borrow?.b_due_date ?? null,
            returnedAt: item.r_date_returned,
            condition: item.r_condition,
            quantity: item.r_quantity,
            itemPrice: item.Item.i_price
        });

    const handleEditFees = (item: ReturnedItem) => {
        setSelectedItem(item);

        // A return that has never been assessed opens on the policy's suggestion; one that already
        // carries fees opens on those, so an admin's earlier decision is not silently overwritten.
        const assessed = Number(item.r_late_fee) > 0 || Number(item.r_damage_fee) > 0;
        const suggested = suggestionFor(item);

        setFeeForm({
            lateFee: formatFee(assessed ? item.r_late_fee : suggested.lateFee),
            damageFee: formatFee(assessed ? item.r_damage_fee : suggested.damageFee)
        });
        setShowFeesModal(true);
    };

    const closeFeesModal = () => {
        setShowFeesModal(false);
        setSelectedItem(null);
    };

    const handleSaveFees = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;

        const lateFee = parseFloat(feeForm.lateFee) || 0;
        const damageFee = parseFloat(feeForm.damageFee) || 0;

        if (lateFee < 0 || damageFee < 0) {
            showError('Fees cannot be negative.', 'Check the amounts');
            return;
        }

        try {
            setSaving(true);
            const data = await trpcClient.returns.updateFees.mutate({
                id: selectedItem.id,
                r_late_fee: lateFee,
                r_damage_fee: damageFee
            });

            if (data.success) {
                closeFeesModal();
                fetchReturnedItems();
                showSuccess('Fees updated successfully', 'Success');
            } else {
                showError(data.error, 'Something went wrong');
            }
        } catch (error) {
            console.error('Error updating fees:', error);
            showError('Error updating fees', 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Returned Items</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Review returned property and assess late and damage fees.
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

                {/* Search */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Search by borrower, item model, device ID or condition..."
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Returned</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late Fee</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Damage Fee</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {returnedItems.map((item) => {
                                            const total = (Number(item.r_late_fee) || 0) + (Number(item.r_damage_fee) || 0);

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
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div>{`${item.Member.m_fname} ${item.Member.m_lname}`}</div>
                                                        <div className="text-xs text-gray-400">{item.Member.m_school_id}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(item.r_date_returned).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.r_condition ?? 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatFee(item.r_late_fee)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatFee(item.r_damage_fee)}
                                                    </td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${total > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                                        {formatFee(total)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditFees(item)}
                                                            className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <PencilSquareIcon className="mr-1.5 h-4 w-4" />
                                                            Edit Fees
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {returnedItems.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-sm text-gray-500">No returned items found.</p>
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

                {/* Edit Fees Modal */}
                {showFeesModal && selectedItem && (
                    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Assess Fees</h3>
                                    <button
                                        onClick={closeFeesModal}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-blue-900 mb-2">Item Information</h4>
                                    <div className="flex items-start gap-3">
                                        <ItemAvatar
                                            photo={selectedItem.Item.i_photo}
                                            brand={selectedItem.Item.i_brand}
                                            alt={selectedItem.Item.i_model}
                                            className="h-16 w-16 shrink-0"
                                            textClassName="text-xl"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-sm text-blue-800">
                                                <strong>Device ID:</strong> {selectedItem.Item.i_deviceID} |
                                                <strong> Model:</strong> {selectedItem.Item.i_model} |
                                                <strong> Quantity:</strong> {selectedItem.r_quantity}
                                            </p>
                                            <p className="text-sm text-blue-800">
                                                <strong>Borrower:</strong> {`${selectedItem.Member.m_fname} ${selectedItem.Member.m_lname}`}
                                            </p>
                                            <p className="text-sm text-blue-800">
                                                <strong>Condition:</strong> {selectedItem.r_condition ?? 'N/A'} |
                                                <strong> Returned:</strong> {new Date(selectedItem.r_date_returned).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* What the fee policy on /admin/settings suggests for this return. */}
                                {(() => {
                                    const suggested = suggestionFor(selectedItem);
                                    const total = suggested.lateFee + suggested.damageFee;

                                    return (
                                        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        Suggested by the fee policy
                                                    </h4>
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        Late {formatFee(suggested.lateFee)} + Damage{' '}
                                                        {formatFee(suggested.damageFee)} ={' '}
                                                        <strong>{formatFee(total)}</strong>
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {selectedItem.Borrow
                                                            ? suggested.daysLate > 0
                                                                ? `${suggested.daysLate} day(s) past the due date, ${suggested.chargeableDays} charged${suggested.lateFeeCapped ? ', trimmed by the maximum' : ''}.`
                                                                : 'Returned on or before the due date.'
                                                            : 'No due date on record for this borrow.'}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setFeeForm({
                                                            lateFee: formatFee(suggested.lateFee),
                                                            damageFee: formatFee(suggested.damageFee)
                                                        })
                                                    }
                                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Apply suggested
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}

                                <form onSubmit={handleSaveFees} className="space-y-4 mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Late Fee</label>
                                            <input
                                                type="number"
                                                value={feeForm.lateFee}
                                                onChange={(e) => setFeeForm(prev => ({ ...prev, lateFee: e.target.value }))}
                                                min="0"
                                                step="0.01"
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Damage Fee</label>
                                            <input
                                                type="number"
                                                value={feeForm.damageFee}
                                                onChange={(e) => setFeeForm(prev => ({ ...prev, damageFee: e.target.value }))}
                                                min="0"
                                                step="0.01"
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    {selectedItem.r_notes && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Return Notes</label>
                                            <p className="mt-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                                                {selectedItem.r_notes}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={closeFeesModal}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : 'Save Fees'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast: rendered last so it stays above the modal. */}
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
