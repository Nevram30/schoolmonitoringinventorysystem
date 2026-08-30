'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function StudentHeader() {
    const { data: session } = useSession()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/login' })
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    return (
        <header className="sticky top-0 z-30 bg-blue-600 shadow-sm border-b border-blue-700 px-6 py-3">
            <div className="flex justify-between items-center">
                <div></div>
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 p-2"
                    >
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-semibold">
                            {session?.user?.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div className="text-left">
                            <div className="font-medium text-white">{session?.user?.name || 'Student'}</div>
                            <div className="text-xs text-blue-100 capitalize">{session?.user?.role || 'student'}</div>
                        </div>
                        <svg className="w-4 h-4 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                                <div className="font-medium">{session?.user?.name || 'Student'}</div>
                                <div className="text-xs text-gray-500">{session?.user?.username || 'student@school.com'}</div>
                            </div>
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
        </header>
    )
}
