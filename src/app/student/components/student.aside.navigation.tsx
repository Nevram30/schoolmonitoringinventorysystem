'use client'

import { SidebarNavigation } from '@/components/ui-components/sidebar'

export default function StudentAsideNavigation() {
    const navigationItems = [
        {
            href: '/student/dashboard',
            label: 'Dashboard',
            icon: '📊'
        },
        {
            href: '/student/transaction',
            label: 'Transaction',
            icon: '💳'
        },
        {
            href: '/student/borrowed-items',
            label: 'Borrowed Items',
            icon: '📤'
        },
        {
            href: '/student/returned-items',
            label: 'Returned Items',
            icon: '✅'
        }
    ]

    return <SidebarNavigation title="SPMS" items={navigationItems} />
}
