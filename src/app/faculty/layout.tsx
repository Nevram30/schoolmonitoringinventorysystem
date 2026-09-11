'use client'
import React, { PropsWithChildren } from 'react'
import { withAuth, withAuthLayout } from '@/server/withAuth'
import FullScreenLoader from '@/components/ui-components/loader.screen'
import { SidebarProvider, SidebarShell } from '@/components/ui-components/sidebar'
import FacultyAsideNavigation from './components/faculty.aside.navigation'
import FacultyHeader from './components/header'

const ProtectedLayout: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren) => {
  const { isLoading, isAuthenticated, logout } = withAuth({
    role: 'faculty',
    redirectTo: '/login',
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FullScreenLoader />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">
            {!isAuthenticated ? 'Yo have no account' : ' Invalid role'}
          </div>
          <button
            onClick={logout}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    // The sidebar provider lets the header's toggle show and hide the nav.
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <SidebarShell>
          <FacultyAsideNavigation />
        </SidebarShell>
        {/* min-w-0: a wide table scrolls inside its own box instead of widening the whole page. */}
        <div className="flex-1 flex flex-col min-w-0">
          <FacultyHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default withAuthLayout({
  role: 'faculty',
  redirectTo: '/login',
  unauthorizedRedirect: '/staff/forbidden',
})(ProtectedLayout)
