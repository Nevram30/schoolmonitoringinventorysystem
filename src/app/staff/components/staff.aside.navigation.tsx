'use client'

import { SidebarNavigation } from '@/components/ui-components/sidebar'

export default function StaffAsideNavigation() {
    const navigationItems = [
        {
            href: '/staff/dashboard',
            label: 'Dashboard',
            icon: '📊'
        },
        {
            href: '/staff/transaction',
            label: 'Transaction',
            icon: '💳'
        },
        {
            href: '/staff/borrowed-items',
            label: 'Borrowed Items',
            icon: '📤'
        },
        {
            href: '/staff/returned-items',
            label: 'Returned Items',
            icon: '✅'
        }
    ]

    return <SidebarNavigation title="SPMS" items={navigationItems} />
}
