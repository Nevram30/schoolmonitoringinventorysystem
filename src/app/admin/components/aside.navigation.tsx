'use client'

import { SidebarNavigation } from '@/components/ui-components/sidebar'
import { usePendingRequests } from './pending-requests.context'

export default function AdminAsidecomponent() {
    // Same source as the header bell, so the two counts never disagree.
    const { count: pendingRequests } = usePendingRequests()

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
            href: '/admin/requests',
            label: 'Borrow Requests',
            icon: '📝',
            badge: pendingRequests
        },
        {
            href: '/admin/received-items',
            label: 'Received Items',
            icon: '🤝'
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

    return <SidebarNavigation title="Admin Panel" items={navigationItems} />
}
