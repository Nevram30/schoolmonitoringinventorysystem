'use client'

import PortalDashboard from '@/components/ui-components/portal.dashboard'

export default function StaffDashboard() {
  return (
    <PortalDashboard
      basePath="/staff"
      subtitle="Your borrowing, returns and fees at a glance"
    />
  )
}
