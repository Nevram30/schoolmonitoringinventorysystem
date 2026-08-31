'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { usePendingRequests } from './pending-requests.context'

/**
 * Pending-approval notifications in the admin header.
 *
 * Faculty, staff and student borrows now arrive as requests, and nothing is released until an
 * admin acts on one — so the count has to be visible from every admin screen, not just the
 * approvals page. The number itself comes from `PendingRequestsProvider`, which is also what the
 * sidebar badge reads, so the two can never show different totals.
 */
export default function AdminNotificationBell() {
    const { count, requests, refresh } = usePendingRequests()
    const [isOpen, setIsOpen] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

    // The dropdown holds links, so it has to close when the admin clicks anywhere else.
    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    return (
        <div className="relative" ref={panelRef}>
            <button
                type="button"
                onClick={() => {
                    // Opening is the moment the admin actually wants the current number.
                    if (!isOpen) refresh()
                    setIsOpen(!isOpen)
                }}
                aria-label={
                    count > 0
                        ? `${count} borrow request${count === 1 ? '' : 's'} awaiting approval`
                        : 'No borrow requests awaiting approval'
                }
                className="relative p-2 rounded-full text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
                <BellIcon className="h-6 w-6" />
                {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white ring-2 ring-blue-600">
                        {count > 99 ? '99+' : count}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">Borrow Requests</div>
                        <div className="text-xs text-gray-500">
                            {count === 0
                                ? 'Nothing is waiting for approval.'
                                : `${count} awaiting your approval`}
                        </div>
                    </div>

                    {requests.length > 0 && (
                        <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                            {requests.map((request) => (
                                <li key={request.id}>
                                    <Link
                                        href="/admin/requests"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 hover:bg-gray-50"
                                    >
                                        <div className="text-sm font-medium text-gray-900">
                                            {request.Item?.i_model ?? 'Item'}
                                            {request.br_quantity > 1 && ` ×${request.br_quantity}`}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            For{' '}
                                            {request.Member
                                                ? `${request.Member.m_fname} ${request.Member.m_lname}`
                                                : 'a borrower'}
                                            {request.Requester?.name && ` · sent by ${request.Requester.name}`}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    <Link
                        href="/admin/requests"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50 border-t border-gray-100"
                    >
                        Review all requests
                    </Link>
                </div>
            )}
        </div>
    )
}
