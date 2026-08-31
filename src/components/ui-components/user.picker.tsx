'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { trpcClient } from '@/trpc/client'

/** The user fields the picker reads. `users.list` returns all of them. */
export interface PickableUser {
    id: number
    name: string
    username: string
    email: string | null
    id_number: string | null
    role: 'admin' | 'faculty' | 'staff' | 'student'
    status: number
}

interface UserPickerProps {
    /** Called with the account the admin picked, so the caller can fill its form. */
    onSelect: (user: PickableUser) => void
    /** Name of the account currently filling the form, shown on the closed field. */
    selectedLabel?: string
    /** Clears the caller's "filled from" state. Hidden when omitted. */
    onClear?: () => void
    placeholder?: string
}

const ROLE_BADGES: Record<PickableUser['role'], string> = {
    admin: 'bg-red-100 text-red-800',
    faculty: 'bg-blue-100 text-blue-800',
    student: 'bg-amber-100 text-amber-800',
    staff: 'bg-gray-100 text-gray-800',
}

/**
 * Type-ahead over the user accounts. Searching runs on the server (`users.list`
 * matches name, username, ID number and email) because the list is paginated —
 * filtering only the current page would hide most matches.
 */
export default function UserPicker({
    onSelect,
    selectedLabel,
    onClear,
    placeholder = 'Search for a user...',
}: UserPickerProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState<PickableUser[]>([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Debounced so typing does not fire a query per keystroke.
    useEffect(() => {
        if (!open) return

        let cancelled = false
        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const data = await trpcClient.users.list.query({
                    page: 1,
                    limit: 8,
                    search,
                })
                if (!cancelled && data.success) setUsers(data.data)
            } catch (error) {
                console.error('Error searching users:', error)
                if (!cancelled) setUsers([])
            } finally {
                if (!cancelled) setLoading(false)
            }
        }, 250)

        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [open, search])

    // Close when clicking anywhere outside the field.
    useEffect(() => {
        if (!open) return

        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
        }
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [open])

    const handlePick = (user: PickableUser) => {
        onSelect(user)
        setSearch('')
        setOpen(false)
    }

    return (
        <div className="relative" ref={containerRef}>
            <div className="mt-1 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    className="flex w-full items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                    <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-gray-400" />
                    <span
                        className={`flex-1 truncate text-sm ${selectedLabel ? 'text-gray-900' : 'text-gray-500'}`}
                    >
                        {selectedLabel || placeholder}
                    </span>
                    <ChevronDownIcon className="h-5 w-5 shrink-0 text-gray-400" />
                </button>

                {selectedLabel && onClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        title="Clear"
                        className="shrink-0 rounded-md border border-gray-300 p-2 text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>
                )}
            </div>

            {open && (
                <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-200 p-2">
                        <input
                            type="text"
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, username, ID number or email..."
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="max-h-72 overflow-y-auto py-1">
                        {loading ? (
                            <p className="py-6 text-center text-sm text-gray-500">Searching...</p>
                        ) : users.length === 0 ? (
                            <p className="py-6 text-center text-sm text-gray-500">No users found.</p>
                        ) : (
                            users.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => handlePick(user)}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-blue-50"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-medium text-gray-900">
                                            {user.name}
                                        </span>
                                        <span className="block truncate text-xs text-gray-500">
                                            {user.id_number || user.username}
                                            {user.email && ` · ${user.email}`}
                                        </span>
                                    </span>
                                    <span
                                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${ROLE_BADGES[user.role]}`}
                                    >
                                        {user.role}
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
