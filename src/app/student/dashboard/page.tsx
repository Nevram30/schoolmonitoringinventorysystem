'use client'

import PortalDashboard from '@/components/ui-components/portal.dashboard'

export default function StudentDashboard() {
  return (
    <PortalDashboard
      basePath="/student"
      subtitle="Borrowing, returns and fees at a glance"
    />
  )
}
