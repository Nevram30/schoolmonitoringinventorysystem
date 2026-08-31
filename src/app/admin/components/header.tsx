'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import AdminNotificationBell from './notification.bell'

export default function AdminHeader() {
    const { data: session } = useSession()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/login' })
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    // The menu now contains a link, so it has to close when the admin clicks anywhere else —
    // otherwise it stays open over the page they just navigated to.
    useEffect(() => {
        if (!isDropdownOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isDropdownOpen])

    return (
        <header className="sticky top-0 z-30 bg-blue-600 border-b border-blue-700 shadow-sm px-6 py-3">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-white"></h1>
                </div>

                <div className="flex items-center space-x-2">
                    <AdminNotificationBell />

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 p-2"
                        >
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="text-left">
                                <div className="font-medium text-white">{session?.user?.name || 'Admin'}</div>
                                <div className="text-xs text-blue-100 capitalize">{session?.user?.role || 'admin'}</div>
                            </div>
                            <svg className="w-4 h-4 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                                    <div className="font-medium">{session?.user?.name || 'Admin'}</div>
                                    <div className="text-xs text-gray-500">{session?.user?.username || 'admin@school.com'}</div>
                                </div>
                                <Link
                                    href="/admin/settings"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                    <Cog6ToothIcon className="w-4 h-4 mr-2" />
                                    Settings
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
