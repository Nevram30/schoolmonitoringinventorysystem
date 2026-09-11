'use client'

import { SidebarNavigation } from '@/components/ui-components/sidebar'

export default function FacultyAsideNavigation() {
    const navigationItems = [
        {
            href: '/faculty/dashboard',
            label: 'Dashboard',
            icon: '📊'
        },
        {
            href: '/faculty/transaction',
            label: 'Transaction',
            icon: '💳'
        },
        {
            href: '/faculty/borrowed-items',
            label: 'Borrowed Items',
            icon: '📤'
        },
        {
            href: '/faculty/returned-items',
            label: 'Returned Items',
            icon: '✅'
        }
    ]

    return <SidebarNavigation title="SPMS" items={navigationItems} />
}
