'use client'

import { SidebarNavigation, type SidebarNavItem } from '@/components/ui-components/sidebar'
import { usePendingRequests } from './pending-requests.context'

export default function AdminAsidecomponent() {
    // Same source as the header bell, so the two counts never disagree.
    const { count: pendingRequests } = usePendingRequests()

    const navigationItems: SidebarNavItem[] = [
        {
            href: '/admin/dashboard',
            label: 'Dashboard',
            icon: '📊'
        },
        {
            href: '/admin/users',
            label: 'Users',
            icon: '👥',
            children: [
                { href: '/admin/borrowers', label: 'Borrowers', icon: '👨‍🎓' }
            ]
        },
        {
            href: '/admin/items',
            label: 'Items',
            icon: '📦',
            children: [
                { href: '/admin/inventory', label: 'Inventory', icon: '📋' },
                { href: '/admin/rooms', label: 'Offices', icon: '🏢' }
            ]
        },
        {
            label: 'Transactions',
            icon: '🔄',
            children: [
                { href: '/admin/borrowing', label: 'Borrowing', icon: '📤' },
                { href: '/admin/requests', label: 'Requests', icon: '📝', badge: pendingRequests },
                { href: '/admin/received-items', label: 'Received', icon: '🤝' },
                { href: '/admin/overdue-items', label: 'Overdue', icon: '⏰' },
                { href: '/admin/returned-items', label: 'Returns', icon: '✅' }
            ]
        },
        {
            href: '/admin/reports',
            label: 'Reports',
            icon: '📈'
        }
    ]

    return <SidebarNavigation title="Admin Panel" items={navigationItems} />
}
