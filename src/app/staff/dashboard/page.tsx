'use client'

import PortalDashboard from '@/components/ui-components/portal.dashboard'

export default function StaffDashboard() {
  return (
    <PortalDashboard
      basePath="/staff"
      subtitle="Borrowing, returns and fees at a glance"
    />
  )
}
