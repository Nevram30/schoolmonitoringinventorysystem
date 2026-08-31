'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminAsidecomponent() {
    const pathname = usePathname()

    const navigationItems = [
        {
            href: '/admin/dashboard',
            label: 'Dashboard',
            icon: '📊'
        },
        {
            href: '/admin/users',
            label: 'Users',
            icon: '👥'
        },
        {
            href: '/admin/items',
            label: 'Items',
            icon: '📦'
        },
        {
            href: '/admin/inventory',
            label: 'Inventory',
            icon: '📋'
        },
        {
            href: '/admin/borrowing',
            label: 'Transactions',
            icon: '📋'
        },
        {
            href: '/admin/overdue-items',
            label: 'Overdue Items',
            icon: '⏰'
        },
        {
            href: '/admin/returned-items',
            label: 'Returned Items',
            icon: '✅'
        },
        {
            href: '/admin/rooms',
            label: 'Room',
            icon: '🏢'
        },
        {
            href: '/admin/borrowers',
            label: 'Borrowers',
            icon: '👨‍🎓'
        },
        {
            href: '/admin/reports',
            label: 'Reports',
            icon: '📈'
        }
    ]

    return (
        <aside className="w-64 h-screen sticky top-0 self-start bg-blue-50 shadow-md flex flex-col">
            <div className="p-6 bg-blue-600 border-b border-blue-700 shrink-0">
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>

            <nav className="mt-6 flex-1 overflow-y-auto pb-6">
                <ul className="space-y-2 px-4">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                        ? 'bg-blue-200 text-blue-800 border-r-4 border-blue-700'
                                        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
                                        }`}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    )
}
