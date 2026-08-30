'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Layout from '../Layout';
import { trpcClient } from '@/trpc/client';

interface User {
  id: number;
  name: string;
  username: string;
  email: string | null;
  id_number: string | null;
  role: 'admin' | 'staff' | 'faculty' | 'student';
  status: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const MIN_PASSWORD_LENGTH = 8;

/**
 * Rough password strength, scored out of 4: one point each for a decent
 * length, a long length, mixed case, a digit and a symbol (capped at 4).
 * Guidance for whoever is filling the form — the only hard rules are the
 * minimum length and the confirmation matching.
 */
const scorePassword = (password: string) => {
  if (!password) return null;

  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  score = Math.min(score, 4);

  const levels = [
    { label: 'Very weak', bar: 'bg-red-500', text: 'text-red-600' },
    { label: 'Weak', bar: 'bg-orange-500', text: 'text-orange-600' },
    { label: 'Fair', bar: 'bg-yellow-500', text: 'text-yellow-700' },
    { label: 'Strong', bar: 'bg-lime-500', text: 'text-lime-700' },
    { label: 'Very strong', bar: 'bg-green-600', text: 'text-green-700' }
  ];

  return { score, ...levels[score] };
};

/** The ID field is labelled after whichever role is selected. */
const ID_LABELS: Record<'admin' | 'staff' | 'faculty' | 'student', string> = {
  admin: 'Admin ID',
  staff: 'Staff ID',
  faculty: 'Faculty ID',
  student: 'Student ID'
};

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    id_number: '',
    password: '',
    confirmPassword: '',
    role: 'staff' as 'admin' | 'staff' | 'faculty' | 'student'
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    username: '',
    email: '',
    id_number: '',
    password: '',
    confirmPassword: '',
    role: 'staff' as 'admin' | 'staff' | 'faculty' | 'student',
    status: '1'
  });

  const passwordStrength = scorePassword(formData.password);
  const passwordTooShort =
    formData.password.length > 0 && formData.password.length < MIN_PASSWORD_LENGTH;
  const passwordsMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  // The edit form's password is optional, so it is only checked once typed in.
  const editPasswordStrength = scorePassword(editFormData.password);
  const editPasswordTooShort =
    editFormData.password.length > 0 &&
    editFormData.password.length < MIN_PASSWORD_LENGTH;
  const editPasswordsMismatch =
    editFormData.password !== editFormData.confirmPassword;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await trpcClient.users.list.query({
        page: pagination.page,
        limit: pagination.limit,
        search,
      });

      if (data.success) {
        setUsers(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchUsers();
  }, [session, status, router, fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      alert(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      // `confirmPassword` never leaves the browser.
      const { confirmPassword, ...payload } = formData;
      const data = await trpcClient.users.create.mutate(payload);

      if (data.success) {
        setShowAddModal(false);
        setFormData({
          name: '',
          username: '',
          email: '',
          id_number: '',
          password: '',
          confirmPassword: '',
          role: 'staff'
        });
        fetchUsers(); // Refresh the list
        alert('User created successfully!');
      } else {
        alert('Error creating user: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      username: user.username,
      email: user.email ?? '',
      id_number: user.id_number ?? '',
      // Blank means "keep the current password".
      password: '',
      confirmPassword: '',
      role: user.role,
      status: String(user.status)
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (editFormData.password && editFormData.password.length < MIN_PASSWORD_LENGTH) {
      alert(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      return;
    }

    if (editFormData.password !== editFormData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const data = await trpcClient.users.update.mutate({
        id: editingUser.id,
        name: editFormData.name,
        username: editFormData.username,
        email: editFormData.email,
        id_number: editFormData.id_number,
        role: editFormData.role,
        status: parseInt(editFormData.status),
        ...(editFormData.password ? { password: editFormData.password } : {})
      });

      if (data.success) {
        setShowEditModal(false);
        setEditingUser(null);
        fetchUsers(); // Refresh the list
        alert('User updated successfully!');
      } else {
        alert('Error updating user: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(userId);

    try {
      const data = await trpcClient.users.delete.mutate({ id: userId });

      if (data.success) {
        fetchUsers(); // Refresh the list
        alert('User deleted successfully!');
      } else {
        alert('Error deleting user: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    } finally {
      setDeleting(null);
    }
  };


  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage system users and their access levels.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add User
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
                    placeholder="Search users by name, username, ID number or email..."
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

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.id_number || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : user.role === 'faculty'
                              ? 'bg-blue-100 text-blue-800'
                              : user.role === 'student'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {user.status === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => openEditModal(user)}
                          className="mr-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <PencilIcon className="h-3 w-3" />
                          <span className="ml-1">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={deleting === user.id || parseInt(session?.user?.role || '') === user.id}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleting === user.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                          ) : (
                            <TrashIcon className="h-3 w-3" />
                          )}
                          <span className="ml-1">
                            {parseInt(session?.user?.role || '') === user.id ? 'You' : 'Delete'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">No users found.</p>
                </div>
              )}
            </div>
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

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop: clicking outside the panel closes it. */}
            <div
              className="absolute inset-0 bg-gray-600/25"
              onClick={() => setShowAddModal(false)}
            />
            {/* Slide-over panel anchored to the right edge. */}
            <div className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="staff">Staff</option>
                      <option value="faculty">Faculty</option>
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {ID_LABELS[formData.role]}
                    </label>
                    <input
                      type="text"
                      name="id_number"
                      value={formData.id_number}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Enter ${ID_LABELS[formData.role]} number`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={MIN_PASSWORD_LENGTH}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter password"
                    />

                    {passwordStrength && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((segment) => (
                            <div
                              key={segment}
                              className={`h-1.5 flex-1 rounded-full ${segment < passwordStrength.score
                                ? passwordStrength.bar
                                : 'bg-gray-200'
                                }`}
                            />
                          ))}
                        </div>
                        <p className={`mt-1 text-xs font-medium ${passwordStrength.text}`}>
                          {passwordStrength.label}
                        </p>
                      </div>
                    )}

                    <p className={`mt-1 text-xs ${passwordTooShort ? 'text-red-600' : 'text-gray-500'}`}>
                      {passwordTooShort
                        ? `At least ${MIN_PASSWORD_LENGTH} characters required.`
                        : `Use ${MIN_PASSWORD_LENGTH}+ characters with upper and lower case, a number and a symbol.`}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${passwordsMismatch ? 'border-red-400' : 'border-gray-300'
                        }`}
                      placeholder="Re-enter password"
                    />
                    {passwordsMismatch && (
                      <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
                    )}
                  </div>

                </div>

                <div className="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || passwordTooShort || passwordsMismatch}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop: clicking outside the panel closes it. */}
            <div
              className="absolute inset-0 bg-gray-600/25"
              onClick={() => setShowEditModal(false)}
            />
            {/* Slide-over panel anchored to the right edge. */}
            <div className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={editFormData.username}
                      onChange={handleEditInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={handleEditInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="staff">Staff</option>
                      <option value="faculty">Faculty</option>
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {ID_LABELS[editFormData.role]}
                    </label>
                    <input
                      type="text"
                      name="id_number"
                      value={editFormData.id_number}
                      onChange={handleEditInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="1">Active</option>
                      <option value="2">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      name="password"
                      value={editFormData.password}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Leave blank to keep the current password"
                    />

                    {editPasswordStrength && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((segment) => (
                            <div
                              key={segment}
                              className={`h-1.5 flex-1 rounded-full ${segment < editPasswordStrength.score
                                ? editPasswordStrength.bar
                                : 'bg-gray-200'
                                }`}
                            />
                          ))}
                        </div>
                        <p className={`mt-1 text-xs font-medium ${editPasswordStrength.text}`}>
                          {editPasswordStrength.label}
                        </p>
                      </div>
                    )}

                    {editPasswordTooShort && (
                      <p className="mt-1 text-xs text-red-600">
                        At least {MIN_PASSWORD_LENGTH} characters required.
                      </p>
                    )}
                  </div>

                  {editFormData.password && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={editFormData.confirmPassword}
                        onChange={handleEditInputChange}
                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${editPasswordsMismatch ? 'border-red-400' : 'border-gray-300'
                          }`}
                        placeholder="Re-enter new password"
                      />
                      {editPasswordsMismatch && (
                        <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || editPasswordTooShort || editPasswordsMismatch}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Update User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
