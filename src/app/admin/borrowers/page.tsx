'use client';

import { useState, useEffect, useCallback } from 'react';

import { PlusIcon, MagnifyingGlassIcon, XMarkIcon, PencilIcon, EyeIcon, UserMinusIcon, UserPlusIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { FileDown, Printer } from 'lucide-react';
import { escapeHtml, openPrintableReport, printColorStyles } from '@/lib/print-report';
import Layout from '../Layout';
import UserPicker, { PickableUser } from '@/components/ui-components/user.picker';
import { trpcClient } from '@/trpc/client';

interface Borrower {
    id: number;
    m_school_id: string;
    m_fname: string;
    m_lname: string;
    m_contact: string;
    m_department: string;
    m_type: number;
    m_status: number;
    /** When this borrower last borrowed an item; null if they never have. */
    lastBorrowedAt?: Date | string | null;
}

/** Borrow dates arrive as Date objects (superjson); never-borrowed reads as a dash. */
const formatBorrowedDate = (value?: Date | string | null) =>
    value ? new Date(value).toLocaleDateString() : '—';

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function BorrowersPage() {
    const [borrowers, setBorrowers] = useState<Borrower[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
    const [confirmAction, setConfirmAction] = useState<{
        borrower: Borrower;
        newStatus: number;
        actionText: string;
    } | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [formData, setFormData] = useState({
        m_fname: '',
        m_lname: '',
        m_mname: '',
        m_contact: '',
        m_address: '',
        m_type: 'Student',
        m_school_id: ''
    });
    // Name of the account the Add form was filled from, if any.
    const [filledFromUser, setFilledFromUser] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState({
        id: 0,
        m_fname: '',
        m_lname: '',
        m_mname: '',
        m_contact: '',
        m_address: '',
        m_type: 'Student'
    });

    const fetchBorrowers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await trpcClient.borrowers.list.query({
                page: pagination.page,
                limit: pagination.limit,
                search,
            });

            if (data.success) {
                setBorrowers(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching borrowers:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, search]);

    useEffect(() => {
        fetchBorrowers();
    }, [fetchBorrowers]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchBorrowers();
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Copies what a user account and a borrower record have in common. Accounts
     * hold one `name` string, so the first word becomes the first name and the
     * rest the last name — anything unusual is left for the admin to correct.
     * Contact and address have no equivalent on a user, so they are untouched.
     */
    const handleUserSelect = (user: PickableUser) => {
        const parts = user.name.trim().split(/\s+/);
        const [first, ...rest] = parts;

        setFormData(prev => ({
            ...prev,
            m_fname: first ?? '',
            m_lname: rest.join(' '),
            m_school_id: user.id_number ?? '',
            // `admin` has no borrower equivalent; those accounts are school staff.
            m_type: user.role === 'student'
                ? 'Student'
                : user.role === 'faculty'
                    ? 'Faculty'
                    : 'Staff'
        }));
        setFilledFromUser(user.name);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = await trpcClient.borrowers.create.mutate(formData);

            if (data.success) {
                setShowAddModal(false);
                setFormData({
                    m_fname: '',
                    m_lname: '',
                    m_mname: '',
                    m_contact: '',
                    m_address: '',
                    m_type: 'Student',
                    m_school_id: ''
                });
                setFilledFromUser(null);
                fetchBorrowers(); // Refresh the list
                setSuccessMessage('Borrower added successfully!');
                setShowSuccessModal(true);
            } else {
                alert('Error adding borrower: ' + data.error);
            }
        } catch (error) {
            console.error('Error adding borrower:', error);
            alert('Error adding borrower');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewProfile = (borrower: Borrower) => {
        setSelectedBorrower(borrower);
        setShowViewModal(true);
    };

    const handleEdit = (borrower: Borrower) => {
        const getTypeString = (type: number) => {
            switch (type) {
                case 1: return 'Student';
                case 2: return 'Faculty';
                case 3: return 'Staff';
                default: return 'Student';
            }
        };

        setEditFormData({
            id: borrower.id,
            m_fname: borrower.m_fname,
            m_lname: borrower.m_lname,
            m_mname: '',
            m_contact: borrower.m_contact,
            m_address: borrower.m_department,
            m_type: getTypeString(borrower.m_type)
        });
        setSelectedBorrower(borrower);
        setShowEditModal(true);
    };

    const handleToggleStatus = (borrower: Borrower) => {
        const newStatus = borrower.m_status === 1 ? 2 : 1;
        const actionText = newStatus === 1 ? 'activate' : 'deactivate';

        setConfirmAction({
            borrower,
            newStatus,
            actionText
        });
        setShowConfirmModal(true);
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) return;

        try {
            setSubmitting(true);
            const data = await trpcClient.borrowers.patch.mutate({
                id: confirmAction.borrower.id,
                data: { m_status: confirmAction.newStatus }
            });

            if (data.success) {
                fetchBorrowers(); // Refresh the list
                setSuccessMessage(`Borrower ${confirmAction.actionText}d successfully!`);
                setShowSuccessModal(true);
            } else {
                alert(`Error ${confirmAction.actionText}ing borrower: ` + data.error);
            }
        } catch (error) {
            console.error(`Error ${confirmAction.actionText}ing borrower:`, error);
            alert(`Error ${confirmAction.actionText}ing borrower`);
        } finally {
            setSubmitting(false);
            setShowConfirmModal(false);
            setConfirmAction(null);
        }
    };

    const handleCancelAction = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = await trpcClient.borrowers.update.mutate(editFormData);

            if (data.success) {
                setShowEditModal(false);
                setEditFormData({
                    id: 0,
                    m_fname: '',
                    m_lname: '',
                    m_mname: '',
                    m_contact: '',
                    m_address: '',
                    m_type: 'Student'
                });
                setSelectedBorrower(null);
                fetchBorrowers(); // Refresh the list
                setSuccessMessage('Borrower updated successfully!');
                setShowSuccessModal(true);
            } else {
                alert('Error updating borrower: ' + data.error);
            }
        } catch (error) {
            console.error('Error updating borrower:', error);
            alert('Error updating borrower');
        } finally {
            setSubmitting(false);
        }
    };

    // Export Functions — PDF and Print only; both render the rows currently in the table.
    const getTypeString = (type: number) => {
        switch (type) {
            case 1: return 'Student';
            case 2: return 'Faculty';
            case 3: return 'Staff';
            default: return 'Unknown';
        }
    };

    const buildReportHtml = (compact: boolean) => {
        const cellPadding = compact ? '6px' : '8px';
        const fontSize = compact ? '10px' : '12px';

        const tableRows = borrowers
            .map(
                borrower => `
                <tr>
                    <td>${escapeHtml(borrower.m_school_id)}</td>
                    <td>${escapeHtml(`${borrower.m_fname} ${borrower.m_lname}`)}</td>
                    <td>${escapeHtml(borrower.m_contact)}</td>
                    <td>${escapeHtml(borrower.m_department || 'N/A')}</td>
                    <td>${escapeHtml(getTypeString(borrower.m_type))}</td>
                    <td>${escapeHtml(borrower.m_status === 1 ? 'Active' : 'Inactive')}</td>
                    <td>${escapeHtml(formatBorrowedDate(borrower.lastBorrowedAt))}</td>
                </tr>`
            )
            .join('');

        const counts = borrowers.reduce(
            (acc, borrower) => {
                acc[getTypeString(borrower.m_type)] = (acc[getTypeString(borrower.m_type)] ?? 0) + 1;
                return acc;
            },
            {} as Record<string, number>
        );

        const breakdown = Object.entries(counts)
            .map(([label, count]) => `<span><strong>${escapeHtml(label)}:</strong> ${count}</span>`)
            .join('');

        return `
            <html>
                <head>
                    <title>Borrowers Report - ${new Date().toLocaleDateString()}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; ${printColorStyles} }
                        h1 { color: #333; text-align: center; margin-bottom: 4px; }
                        .meta { font-size: ${fontSize}; color: #444; margin-bottom: 12px; }
                        .meta span { margin-right: 16px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: ${fontSize}; }
                        th { background-color: #f8f9fa; border: 1px solid #ddd; padding: ${cellPadding}; font-weight: bold; text-align: left; }
                        td { border: 1px solid #ddd; padding: ${cellPadding}; }
                        tr { page-break-inside: avoid; }
                        @media print {
                            body { margin: 10px; }
                            thead { display: table-header-group; }
                        }
                    </style>
                </head>
                <body>
                    <h1>School Borrowers Report</h1>
                    <div class="meta">
                        <span><strong>Generated:</strong> ${new Date().toLocaleString()}</span>
                        <span><strong>Records:</strong> ${borrowers.length}</span>
                        ${breakdown}
                        ${search ? `<span><strong>Search:</strong> ${escapeHtml(search)}</span>` : ''}
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>School ID</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Department</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Date Borrowed</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows ||
                                '<tr><td colspan="7" style="text-align: center; color: #666;">No borrowers to report.</td></tr>'}
                        </tbody>
                    </table>
                </body>
            </html>`;
    };

    const openReport = (compact: boolean, successText: string) => {
        if (borrowers.length === 0) {
            alert('There are no borrowers in the table to export.');
            return;
        }

        openPrintableReport({
            html: buildReportHtml(compact),
            onBlocked: () => alert('Please allow pop-ups for this site and try again.'),
            onReady: () => {
                setSuccessMessage(successText);
                setShowSuccessModal(true);
            },
            onError: (error) => {
                console.error('Error building borrowers report:', error);
                alert('Failed to build the report');
            },
        });
    };

    const handleExportPDF = () =>
        openReport(true, 'Choose "Save as PDF" in the print dialog to save the report.');

    const handlePrint = () => openReport(false, 'Print dialog has been opened.');

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Borrowers</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage school borrowers including students, faculty, and staff.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                            Add Borrower
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <form onSubmit={handleSearch} className="flex space-x-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Search borrowers by name, contact, or type..."
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

                {/* Borrowers Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        {/* Export Buttons */}
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <button
                                onClick={handleExportPDF}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FileDown className="h-3 w-3 mr-1" />
                                PDF
                            </button>
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Printer className="h-3 w-3 mr-1" />
                                Print
                            </button>
                            <span className="text-xs text-gray-500">
                                {borrowers.length} {borrowers.length === 1 ? 'record' : 'records'}
                            </span>
                        </div>
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                School ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Department
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date Borrowed
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {borrowers.map((borrower) => {
                                            const getTypeString = (type: number) => {
                                                switch (type) {
                                                    case 1: return 'Student';
                                                    case 2: return 'Faculty';
                                                    case 3: return 'Staff';
                                                    default: return 'Unknown';
                                                }
                                            };

                                            const typeString = getTypeString(borrower.m_type);

                                            return (
                                                <tr key={borrower.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                        {borrower.m_school_id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {`${borrower.m_fname} ${borrower.m_lname}`}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {borrower.m_contact}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {borrower.m_department}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeString === 'Student'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : typeString === 'Faculty'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-purple-100 text-purple-800'
                                                            }`}>
                                                            {typeString}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${borrower.m_status === 1
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {borrower.m_status === 1 ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatBorrowedDate(borrower.lastBorrowedAt)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleViewProfile(borrower)}
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                                                                title="View Profile"
                                                            >
                                                                <EyeIcon className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(borrower)}
                                                                className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100"
                                                                title="Edit"
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleToggleStatus(borrower)}
                                                                className={`p-1 rounded-full ${borrower.m_status === 1
                                                                    ? 'text-red-600 hover:text-red-900 hover:bg-red-100'
                                                                    : 'text-green-600 hover:text-green-900 hover:bg-green-100'
                                                                    }`}
                                                                title={borrower.m_status === 1 ? 'Deactivate' : 'Activate'}
                                                            >
                                                                {borrower.m_status === 1 ? (
                                                                    <UserMinusIcon className="h-4 w-4" />
                                                                ) : (
                                                                    <UserPlusIcon className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {borrowers.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-sm text-gray-500">No borrowers found.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing{' '}
                                        <span className="font-medium">
                                            {(pagination.page - 1) * pagination.limit + 1}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-medium">
                                            {Math.min(pagination.page * pagination.limit, pagination.total)}
                                        </span>{' '}
                                        of{' '}
                                        <span className="font-medium">{pagination.total}</span> results
                                    </p>
                                </div>
                                <div>
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
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Borrower Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-gray-600/25 bg-opacity-20 overflow-y-auto h-full w-full z-50">
                        <div className="fixed top-0 right-0 h-full w-11/12 md:w-2/5 lg:w-1/3 p-5 shadow-lg bg-white overflow-y-auto">
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Add New Borrower</h3>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Fill from an existing user
                                        </label>
                                        <UserPicker
                                            onSelect={handleUserSelect}
                                            selectedLabel={filledFromUser ?? undefined}
                                            onClear={() => setFilledFromUser(null)}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Optional. Copies the name, ID number and type from the account —
                                            you can still edit every field below.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                                            <input
                                                type="text"
                                                name="m_fname"
                                                value={formData.m_fname}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter first name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                            <input
                                                type="text"
                                                name="m_lname"
                                                value={formData.m_lname}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter last name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                                            <input
                                                type="text"
                                                name="m_mname"
                                                value={formData.m_mname}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter middle name (optional)"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                            <input
                                                type="text"
                                                name="m_contact"
                                                value={formData.m_contact}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter contact number"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Address</label>
                                            <input
                                                type="text"
                                                name="m_address"
                                                value={formData.m_address}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter address"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Borrower Type</label>
                                            <select
                                                name="m_type"
                                                value={formData.m_type}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="Student">Student</option>
                                                <option value="Faculty">Faculty</option>
                                                <option value="Staff">Staff</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                {formData.m_type} ID
                                            </label>
                                            <input
                                                type="text"
                                                name="m_school_id"
                                                value={formData.m_school_id}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder={`Enter ${formData.m_type.toLowerCase()} ID`}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {submitting ? 'Adding...' : 'Add Borrower'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Borrower Modal */}
                {showEditModal && selectedBorrower && (
                    <div className="fixed inset-0 bg-gray-600/25 bg-opacity-20 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Edit Borrower</h3>
                                    <button
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedBorrower(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                                            <input
                                                type="text"
                                                name="m_fname"
                                                value={editFormData.m_fname}
                                                onChange={handleEditInputChange}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter first name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                            <input
                                                type="text"
                                                name="m_lname"
                                                value={editFormData.m_lname}
                                                onChange={handleEditInputChange}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter last name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                                            <input
                                                type="text"
                                                name="m_mname"
                                                value={editFormData.m_mname}
                                                onChange={handleEditInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter middle name (optional)"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                            <input
                                                type="text"
                                                name="m_contact"
                                                value={editFormData.m_contact}
                                                onChange={handleEditInputChange}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter contact number"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Address</label>
                                            <input
                                                type="text"
                                                name="m_address"
                                                value={editFormData.m_address}
                                                onChange={handleEditInputChange}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter address"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Borrower Type</label>
                                            <select
                                                name="m_type"
                                                value={editFormData.m_type}
                                                onChange={handleEditInputChange}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="Student">Student</option>
                                                <option value="Faculty">Faculty</option>
                                                <option value="Staff">Staff</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowEditModal(false);
                                                setSelectedBorrower(null);
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {submitting ? 'Updating...' : 'Update Borrower'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Profile Modal */}
                {showViewModal && selectedBorrower && (
                    <div className="fixed inset-0 bg-gray-600/25 bg-opacity-20 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Borrower Profile</h3>
                                    <button
                                        onClick={() => {
                                            setShowViewModal(false);
                                            setSelectedBorrower(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">School ID</label>
                                            <p className="text-sm text-blue-600 font-medium">{selectedBorrower.m_school_id}</p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <p className="text-sm text-gray-900 font-medium">{`${selectedBorrower.m_fname} ${selectedBorrower.m_lname}`}</p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                            <p className="text-sm text-gray-900">{selectedBorrower.m_contact}</p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                            <p className="text-sm text-gray-900">{selectedBorrower.m_department}</p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Borrower Type</label>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedBorrower.m_type === 1
                                                ? 'bg-blue-100 text-blue-800'
                                                : selectedBorrower.m_type === 2
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {selectedBorrower.m_type === 1 ? 'Student' : selectedBorrower.m_type === 2 ? 'Faculty' : 'Staff'}
                                            </span>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedBorrower.m_status === 1
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {selectedBorrower.m_status === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Borrowed</label>
                                            <p className="text-sm text-gray-900">
                                                {formatBorrowedDate(selectedBorrower.lastBorrowedAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowViewModal(false);
                                                setSelectedBorrower(null);
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowViewModal(false);
                                                handleEdit(selectedBorrower);
                                            }}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Edit Borrower
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                {showConfirmModal && confirmAction && (
                    <div className="fixed inset-0 bg-gray-600/50 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3 text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                                </div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                                    {confirmAction.actionText === 'activate' ? 'Activate Borrower' : 'Deactivate Borrower'}
                                </h3>
                                <div className="mt-2 px-7 py-3">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to {confirmAction.actionText}{' '}
                                        <span className="font-medium text-gray-900">
                                            {confirmAction.borrower.m_fname} {confirmAction.borrower.m_lname}
                                        </span>?
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        This will {confirmAction.actionText === 'activate' ? 'restore their access' : 'prevent them from borrowing items'}.
                                    </p>
                                </div>
                                <div className="flex items-center justify-center space-x-3 px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={handleCancelAction}
                                        className="px-4 py-2 bg-white text-gray-500 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleConfirmAction}
                                        className={`px-4 py-2 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${confirmAction.actionText === 'activate'
                                            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                            }`}
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                {confirmAction.actionText === 'activate' ? 'Activating...' : 'Deactivating...'}
                                            </div>
                                        ) : (
                                            `${confirmAction.actionText === 'activate' ? 'Activate' : 'Deactivate'}`
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-gray-600/50 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3 text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                                    Success!
                                </h3>
                                <div className="mt-2 px-7 py-3">
                                    <p className="text-sm text-gray-500">
                                        {successMessage}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowSuccessModal(false);
                                            setSuccessMessage('');
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
