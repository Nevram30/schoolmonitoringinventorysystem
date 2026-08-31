'use client';

import { useCallback, useEffect, useState } from 'react';
import { MagnifyingGlassIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Layout from '../Layout';
import { trpcClient } from '@/trpc/client';
import { useUploadThing } from '@/lib/uploadthing';
import ItemAvatar from '@/components/ui-components/item.avatar';
import Alert from '@/components/ui-components/alert';
import { useAlert } from '@/components/ui-components/useAlert';

/**
 * Item hand-overs.
 *
 * An approved borrow request creates the borrow, but the item does not leave the storeroom until
 * someone collects it. This screen is the counter: it lists the approved borrows nobody has picked
 * up yet, and records who actually took each one — with a photo taken at the moment of hand-over,
 * so a loan can be traced to a person and not just to the account that asked for it.
 */

interface BorrowerInfo {
    m_fname: string;
    m_lname: string;
    m_school_id: string;
    m_contact: string;
    m_department: string;
    m_type: number;
}

interface ItemInfo {
    i_model: string;
    i_deviceID: string;
    i_photo?: string | null;
    i_brand?: string | null;
    i_category?: string | null;
}

interface RequestInfo {
    id: number;
    br_reviewed_at: Date | string | null;
    Requester?: { name: string; role: string } | null;
    Reviewer?: { name: string } | null;
}

/** An approved borrow nobody has collected yet. */
interface PendingBorrow {
    id: number;
    b_date_borrowed: Date | string;
    b_due_date: Date | string;
    b_quantity: number;
    b_purpose: string | null;
    Item?: ItemInfo | null;
    Member?: BorrowerInfo | null;
    Room?: { r_name: string } | null;
    request?: RequestInfo | null;
}

interface Receipt {
    id: number;
    rc_receiver_name: string;
    rc_receiver_id: string | null;
    rc_contact: string | null;
    rc_relationship: string;
    rc_id_presented: string | null;
    rc_receiver_photo: string | null;
    rc_quantity: number;
    rc_condition: string;
    rc_notes: string | null;
    rc_received_at: Date | string;
    Borrow: PendingBorrow;
    Releaser?: { name: string } | null;
}

type Tab = 'awaiting' | 'received';

const RELATIONSHIPS = [
    { value: 'self', label: 'Borrower (self)' },
    { value: 'representative', label: 'Representative' },
    { value: 'classmate', label: 'Classmate' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'guardian', label: 'Parent / Guardian' },
];

const ID_TYPES = ['School ID', 'Employee ID', "Driver's License", 'National ID', 'Other'];

/** Same wording as the return form, so the two ends of a loan describe condition the same way. */
const CONDITIONS = ['Good', 'Fair', 'Damaged'];

const CONDITION_COLOR: Record<string, string> = {
    Good: 'bg-green-100 text-green-800',
    Fair: 'bg-yellow-100 text-yellow-800',
    Damaged: 'bg-orange-100 text-orange-800',
};

const BORROWER_TYPE: Record<number, string> = {
    1: 'Student',
    2: 'Faculty',
    3: 'Staff',
};

const formatDate = (value: Date | string | null | undefined) =>
    value ? new Date(value).toLocaleDateString() : 'N/A';

const formatDateTime = (value: Date | string | null | undefined) =>
    value ? new Date(value).toLocaleString() : 'N/A';

const fullName = (member?: BorrowerInfo | null) =>
    member ? `${member.m_fname} ${member.m_lname}` : 'N/A';

const relationshipLabel = (value: string) =>
    RELATIONSHIPS.find((r) => r.value === value)?.label ?? value;

/** `datetime-local` wants `YYYY-MM-DDTHH:mm` in local time, which toISOString does not give. */
const toLocalInput = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
        date.getHours()
    )}:${pad(date.getMinutes())}`;
};

const emptyForm = {
    rc_receiver_name: '',
    rc_receiver_id: '',
    rc_contact: '',
    rc_relationship: 'self',
    rc_id_presented: 'School ID',
    rc_quantity: '1',
    rc_condition: 'Good',
    rc_notes: '',
    rc_received_at: '',
};

/** Photo of the receiver, falling back to a neutral avatar when none was taken. */
function ReceiverPhoto({
    photo,
    alt,
    className = 'h-10 w-10',
}: {
    photo?: string | null;
    alt: string;
    className?: string;
}) {
    const [failed, setFailed] = useState(false);

    if (photo && !failed) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={photo}
                alt={alt}
                onError={() => setFailed(true)}
                className={`${className} shrink-0 rounded-full border border-gray-300 object-cover`}
            />
        );
    }

    return (
        <div
            className={`${className} flex shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-100`}
            title="No photo taken"
        >
            <UserIcon className="h-1/2 w-1/2 text-gray-400" />
        </div>
    );
}

export default function AdminReceivedItemsPage() {
    return (
        <Layout>
            <ReceivedItemsScreen />
        </Layout>
    );
}

function ReceivedItemsScreen() {
    const [tab, setTab] = useState<Tab>('awaiting');
    const [pendingBorrows, setPendingBorrows] = useState<PendingBorrow[]>([]);
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [awaitingTotal, setAwaitingTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

    // The borrow being handed over, or the receipt being corrected — never both.
    const [recording, setRecording] = useState<PendingBorrow | null>(null);
    const [editing, setEditing] = useState<Receipt | null>(null);
    const [viewing, setViewing] = useState<Receipt | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    /** Photo already stored on the receipt being edited, kept unless a new one replaces it. */
    const [existingPhoto, setExistingPhoto] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const { startUpload, isUploading } = useUploadThing('receiptPhoto');
    const { alert, showSuccess, showError, hideAlert } = useAlert();

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            if (tab === 'awaiting') {
                const data = await trpcClient.receipts.pending.query({
                    page: pagination.page,
                    limit: pagination.limit,
                    search: searchTerm,
                });

                if (data.success) {
                    setPendingBorrows(data.data as PendingBorrow[]);
                    setPagination(data.pagination);
                    setAwaitingTotal(data.awaitingTotal);
                } else {
                    showError(data.error ?? 'Failed to load the hand-over queue', 'Something went wrong');
                }
            } else {
                const data = await trpcClient.receipts.list.query({
                    page: pagination.page,
                    limit: pagination.limit,
                    search: searchTerm,
                });

                if (data.success) {
                    setReceipts(data.data as Receipt[]);
                    setPagination(data.pagination);
                } else {
                    showError(data.error ?? 'Failed to load received items', 'Something went wrong');
                }
            }
        } catch (error) {
            console.error('Error fetching received items:', error);
            showError('Failed to load received items', 'Something went wrong');
        } finally {
            setLoading(false);
        }
        // showError is stable for the lifetime of the page; including it would re-run the fetch.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab, pagination.page, pagination.limit, searchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTabChange = (next: Tab) => {
        setTab(next);
        setSearch('');
        setSearchTerm('');
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchTerm(search);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const closeForm = () => {
        setRecording(null);
        setEditing(null);
        setForm(emptyForm);
        setPhotoFile(null);
        setPhotoPreview(null);
        setExistingPhoto(null);
    };

    /** Open the counter form for a borrow, pre-filled with what the borrower record already says. */
    const openRecordForm = (borrow: PendingBorrow) => {
        setEditing(null);
        setRecording(borrow);
        setPhotoFile(null);
        setPhotoPreview(null);
        setExistingPhoto(null);
        setForm({
            ...emptyForm,
            rc_receiver_name: fullName(borrow.Member),
            rc_receiver_id: borrow.Member?.m_school_id ?? '',
            rc_contact: borrow.Member?.m_contact ?? '',
            rc_quantity: String(borrow.b_quantity),
            rc_received_at: toLocalInput(new Date()),
        });
    };

    const openEditForm = (receipt: Receipt) => {
        setRecording(null);
        setViewing(null);
        setEditing(receipt);
        setPhotoFile(null);
        setPhotoPreview(null);
        setExistingPhoto(receipt.rc_receiver_photo);
        setForm({
            rc_receiver_name: receipt.rc_receiver_name,
            rc_receiver_id: receipt.rc_receiver_id ?? '',
            rc_contact: receipt.rc_contact ?? '',
            rc_relationship: receipt.rc_relationship,
            rc_id_presented: receipt.rc_id_presented ?? 'School ID',
            rc_quantity: String(receipt.rc_quantity),
            rc_condition: receipt.rc_condition,
            rc_notes: receipt.rc_notes ?? '',
            rc_received_at: toLocalInput(new Date(receipt.rc_received_at)),
        });
    };

    /**
     * Switching away from "self" blanks the identity fields: they were pre-filled with the
     * borrower's details, and saving those for a proxy would record the wrong person as having
     * the item. Switching back restores them.
     */
    const handleRelationshipChange = (value: string) => {
        const borrow = recording ?? editing?.Borrow ?? null;

        setForm((prev) => {
            if (value === 'self') {
                return {
                    ...prev,
                    rc_relationship: value,
                    rc_receiver_name: fullName(borrow?.Member),
                    rc_receiver_id: borrow?.Member?.m_school_id ?? '',
                    rc_contact: borrow?.Member?.m_contact ?? '',
                };
            }

            const wasBorrower = prev.rc_receiver_name === fullName(borrow?.Member);
            return {
                ...prev,
                rc_relationship: value,
                rc_receiver_name: wasBorrower ? '' : prev.rc_receiver_name,
                rc_receiver_id: wasBorrower ? '' : prev.rc_receiver_id,
                rc_contact: wasBorrower ? '' : prev.rc_contact,
            };
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) {
            showError('Please choose an image smaller than 4MB.', 'File too large');
            return;
        }

        setPhotoFile(file);
        const reader = new FileReader();
        reader.onload = (event) => setPhotoPreview(event.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Upload first: a receipt saved without the photo it was supposed to carry is worse
            // than one the admin has to retry.
            let photoUrl: string | null = existingPhoto;

            if (photoFile) {
                const uploaded = await startUpload([photoFile]);
                const url = uploaded?.[0]?.ufsUrl;

                if (!url) {
                    showError('The photo could not be uploaded. Nothing was saved.', 'Upload failed');
                    setSubmitting(false);
                    return;
                }
                photoUrl = url;
            }

            const details = {
                rc_receiver_name: form.rc_receiver_name,
                rc_receiver_id: form.rc_receiver_id,
                rc_contact: form.rc_contact,
                rc_relationship: form.rc_relationship,
                rc_id_presented: form.rc_id_presented,
                rc_receiver_photo: photoUrl,
                rc_quantity: parseInt(form.rc_quantity, 10) || 1,
                rc_condition: form.rc_condition,
                rc_notes: form.rc_notes,
                rc_received_at: form.rc_received_at
                    ? new Date(form.rc_received_at).toISOString()
                    : null,
            };

            const data = editing
                ? await trpcClient.receipts.update.mutate({ id: editing.id, ...details })
                : await trpcClient.receipts.create.mutate({
                    borrow_id: recording!.id,
                    ...details,
                });

            if (data.success) {
                showSuccess(
                    editing
                        ? 'The hand-over record has been corrected.'
                        : `${form.rc_receiver_name} is now on record as having received this item.`,
                    editing ? 'Receipt updated' : 'Hand-over recorded'
                );
                closeForm();
                fetchData();
            } else {
                showError(data.error ?? 'Failed to save the hand-over', 'Something went wrong');
            }
        } catch (error) {
            console.error('Error saving hand-over:', error);
            showError('Failed to save the hand-over', 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const formOpen = Boolean(recording || editing);
    const formBorrow = recording ?? editing?.Borrow ?? null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Received Items</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Record who collected each approved borrow. Take a photo of the person at the
                        counter so the item can be traced to a person, not just to an account.
                    </p>
                </div>
                {awaitingTotal > 0 && (
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
                            {awaitingTotal} awaiting hand-over
                        </span>
                    </div>
                )}
            </div>

            {/* Tabs and search */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {([
                            { value: 'awaiting', label: 'Awaiting Hand-over' },
                            { value: 'received', label: 'Received' },
                        ] as { value: Tab; label: string }[]).map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleTabChange(option.value)}
                                className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${tab === option.value
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {option.label}
                                {option.value === 'awaiting' && awaitingTotal > 0 && (
                                    <span
                                        className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${tab === 'awaiting'
                                            ? 'bg-white text-blue-700'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}
                                    >
                                        {awaitingTotal}
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
                                    placeholder={
                                        tab === 'awaiting'
                                            ? 'Search by borrower name, item model, or device ID...'
                                            : 'Search by receiver name, ID number, item model...'
                                    }
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
                    ) : tab === 'awaiting' ? (
                        pendingBorrows.length === 0 ? (
                            <p className="py-10 text-center text-sm text-gray-500">
                                Every approved borrow has been collected.
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return By</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pendingBorrows.map((borrow) => (
                                            <tr key={borrow.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <div className="flex items-center gap-3">
                                                        <ItemAvatar
                                                            photo={borrow.Item?.i_photo}
                                                            brand={borrow.Item?.i_brand}
                                                            alt={borrow.Item?.i_model ?? ''}
                                                            className="h-10 w-10 shrink-0"
                                                            textClassName="text-sm"
                                                        />
                                                        <div>
                                                            <div className="font-medium">{borrow.Item?.i_model || 'N/A'}</div>
                                                            <div className="text-xs text-gray-500">{borrow.Item?.i_deviceID || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div>{fullName(borrow.Member)}</div>
                                                    <div className="text-xs text-gray-400">
                                                        {borrow.Member?.m_school_id}
                                                        {borrow.Member ? ` · ${BORROWER_TYPE[borrow.Member.m_type] ?? ''}` : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {borrow.Room?.r_name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {borrow.b_quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {borrow.request ? (
                                                        <>
                                                            <div>{borrow.request.Reviewer?.name ?? 'Admin'}</div>
                                                            <div className="text-xs text-gray-400">
                                                                Requested by {borrow.request.Requester?.name ?? 'N/A'}
                                                                {borrow.request.Requester?.role ? ` (${borrow.request.Requester.role})` : ''}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">
                                                            Counter borrow · {formatDate(borrow.b_date_borrowed)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(borrow.b_due_date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => openRecordForm(borrow)}
                                                        className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        Record Receipt
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ) : receipts.length === 0 ? (
                        <p className="py-10 text-center text-sm text-gray-500">
                            No hand-overs have been recorded yet.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty / Condition</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Released By</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {receipts.map((receipt) => (
                                        <tr key={receipt.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="flex items-center gap-3">
                                                    <ReceiverPhoto
                                                        photo={receipt.rc_receiver_photo}
                                                        alt={receipt.rc_receiver_name}
                                                    />
                                                    <div>
                                                        <div className="font-medium">{receipt.rc_receiver_name}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {relationshipLabel(receipt.rc_relationship)}
                                                            {receipt.rc_receiver_id ? ` · ${receipt.rc_receiver_id}` : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div>{receipt.Borrow.Item?.i_model || 'N/A'}</div>
                                                <div className="text-xs text-gray-400">{receipt.Borrow.Item?.i_deviceID}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>{fullName(receipt.Borrow.Member)}</div>
                                                <div className="text-xs text-gray-400">{receipt.Borrow.Member?.m_school_id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>{receipt.rc_quantity}</div>
                                                <span
                                                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${CONDITION_COLOR[receipt.rc_condition] ?? 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {receipt.rc_condition}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDateTime(receipt.rc_received_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {receipt.Releaser?.name ?? 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewing(receipt)}
                                                        className="px-3 py-1.5 rounded-md text-xs font-medium text-blue-700 border border-blue-300 hover:bg-blue-50"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditForm(receipt)}
                                                        className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
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
                            <span className="font-medium">{pagination.total}</span> records
                        </div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === pagination.totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Counter form */}
            {formOpen && (
                <div className="fixed inset-0 bg-gray-600/25 bg-opacity-20 h-full w-full z-50 flex justify-end">
                    <div className="slide-over-panel relative h-full w-full max-w-lg p-5 border-l shadow-xl bg-white overflow-y-auto">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {editing ? 'Edit Hand-over' : 'Record Hand-over'}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {formBorrow?.Item?.i_model} ({formBorrow?.Item?.i_deviceID}) for{' '}
                                    {fullName(formBorrow?.Member)}
                                </p>
                            </div>
                            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* What was approved — the admin should not have to remember it while typing. */}
                        {formBorrow && (
                            <dl className="mb-5 grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4 text-sm">
                                <div>
                                    <dt className="text-xs text-gray-500">Approved quantity</dt>
                                    <dd className="font-medium text-gray-900">{formBorrow.b_quantity}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500">Return by</dt>
                                    <dd className="font-medium text-gray-900">{formatDate(formBorrow.b_due_date)}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500">Room</dt>
                                    <dd className="font-medium text-gray-900">{formBorrow.Room?.r_name ?? 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500">Borrower type</dt>
                                    <dd className="font-medium text-gray-900">
                                        {formBorrow.Member ? BORROWER_TYPE[formBorrow.Member.m_type] ?? 'N/A' : 'N/A'}
                                    </dd>
                                </div>
                                {formBorrow.b_purpose && (
                                    <div className="col-span-2">
                                        <dt className="text-xs text-gray-500">Purpose</dt>
                                        <dd className="text-gray-700">{formBorrow.b_purpose}</dd>
                                    </div>
                                )}
                            </dl>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Photo of the person receiving the item */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Photo of receiver
                                </label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handlePhotoChange}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            On a phone or tablet this opens the camera. PNG or JPG up to 4MB.
                                        </p>
                                    </div>
                                    <ReceiverPhoto
                                        photo={photoPreview ?? existingPhoto}
                                        alt="Receiver"
                                        className="h-20 w-20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Received by</label>
                                <select
                                    value={form.rc_relationship}
                                    onChange={(e) => handleRelationshipChange(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {RELATIONSHIPS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Receiver name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.rc_receiver_name}
                                    onChange={(e) => setForm((prev) => ({ ...prev, rc_receiver_name: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Name of the person taking the item"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">ID number</label>
                                    <input
                                        type="text"
                                        value={form.rc_receiver_id}
                                        onChange={(e) => setForm((prev) => ({ ...prev, rc_receiver_id: e.target.value }))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">ID presented</label>
                                    <select
                                        value={form.rc_id_presented}
                                        onChange={(e) => setForm((prev) => ({ ...prev, rc_id_presented: e.target.value }))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {ID_TYPES.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact number</label>
                                    <input
                                        type="text"
                                        value={form.rc_contact}
                                        onChange={(e) => setForm((prev) => ({ ...prev, rc_contact: e.target.value }))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Quantity released
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={formBorrow?.b_quantity ?? 1}
                                        required
                                        value={form.rc_quantity}
                                        onChange={(e) => setForm((prev) => ({ ...prev, rc_quantity: e.target.value }))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Condition at release
                                    </label>
                                    <select
                                        value={form.rc_condition}
                                        onChange={(e) => setForm((prev) => ({ ...prev, rc_condition: e.target.value }))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {CONDITIONS.map((condition) => (
                                            <option key={condition} value={condition}>
                                                {condition}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date received</label>
                                    <input
                                        type="datetime-local"
                                        value={form.rc_received_at}
                                        onChange={(e) => setForm((prev) => ({ ...prev, rc_received_at: e.target.value }))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Notes</label>
                                <textarea
                                    rows={3}
                                    value={form.rc_notes}
                                    onChange={(e) => setForm((prev) => ({ ...prev, rc_notes: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Accessories handed over, visible scratches, anything worth a record."
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || isUploading}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isUploading
                                        ? 'Uploading photo...'
                                        : submitting
                                            ? 'Saving...'
                                            : editing
                                                ? 'Save Changes'
                                                : 'Record Receipt'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail view */}
            {viewing && (
                <div className="fixed inset-0 bg-gray-600/25 h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl max-h-full overflow-y-auto">
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Hand-over Record</h3>
                            <button onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mt-4 flex flex-col gap-6 sm:flex-row">
                            <div className="flex flex-col items-center gap-2">
                                <ReceiverPhoto
                                    photo={viewing.rc_receiver_photo}
                                    alt={viewing.rc_receiver_name}
                                    className="h-40 w-40"
                                />
                                <span className="text-sm font-medium text-gray-900">{viewing.rc_receiver_name}</span>
                                <span className="text-xs text-gray-500">
                                    {relationshipLabel(viewing.rc_relationship)}
                                </span>
                            </div>

                            <dl className="grid flex-1 grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-xs text-gray-500">Item</dt>
                                    <dd className="text-gray-900">{viewing.Borrow.Item?.i_model}</dd>
                                    <dd className="text-xs text-gray-500">{viewing.Borrow.Item?.i_deviceID}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500">Borrower</dt>
                                    <dd className="text-gray-900">{fullName(viewing.Borrow.Member)}</dd>
                                    <dd className="text-xs text-gray-500">{viewing.Borrow.Member?.m_school_id}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500">ID presented</dt>
                                    <dd className="text-gray-900">
                                        {viewing.rc_id_presented ?? 'N/A'}
                                        {viewing.rc_receiver_id ? ` · ${viewing.rc_receiver_id}` : ''}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500">Contact</dt>
                                    <dd className="text-gray-900">{viewing.rc_contact ?? 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500">Quantity released</dt>
                                    <dd className="text-gray-900">
                                        {viewing.rc_quantity} of {viewing.Borrow.b_quantity}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500">Condition at release</dt>
                                    <dd className="text-gray-900">{viewing.rc_condition}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500">Received</dt>
                                    <dd className="text-gray-900">{formatDateTime(viewing.rc_received_at)}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500">Released by</dt>
                                    <dd className="text-gray-900">{viewing.Releaser?.name ?? 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500">Return by</dt>
                                    <dd className="text-gray-900">{formatDate(viewing.Borrow.b_due_date)}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500">Room</dt>
                                    <dd className="text-gray-900">{viewing.Borrow.Room?.r_name ?? 'N/A'}</dd>
                                </div>
                                {viewing.rc_notes && (
                                    <div className="col-span-2">
                                        <dt className="text-xs text-gray-500">Notes</dt>
                                        <dd className="text-gray-900">{viewing.rc_notes}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setViewing(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => openEditForm(viewing)}
                                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Edit
                            </button>
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
