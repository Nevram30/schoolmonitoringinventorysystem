/* eslint-disable react-hooks/rules-of-hooks */
// `withAuth` is a custom hook in everything but name — it is only ever called from the top level
// of a client component (the admin/staff/faculty layouts). Ported verbatim from the Sequelize app,
// where the lowercase name predates the lint rule; renaming it to `useAuth` would change the
// public API of this module, so the rule is disabled for this file instead.
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useCallback, useState, useEffect, ComponentType } from 'react'
import FullScreenLoader from '@/components/ui-components/loader.screen'

type UserRole = 'admin' | 'faculty' | 'staff' | 'student'

interface UseAuthOptions {
  role?: UserRole
  redirectTo?: string
  unauthorizedRedirect?: string
}

export function withAuth(options?: UseAuthOptions) {
  const session = useSession()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = useCallback(() => {
    setIsLoggingOut(true)
    signOut({ redirect: false })
      .then(() => router.push(options?.redirectTo || '/signin'))
      .finally(() => setIsLoggingOut(false))
  }, [router, options?.redirectTo])

  const isLoading = session.status === 'loading'
  const isAuthenticated = session.status === 'authenticated'
  const userRole = (session.data?.user as any)?.role
  const hasValidRole = options?.role ? userRole === options.role : true

  return {
    session,
    logout,
    isLoading,
    isLoggingOut,
    isAuthenticated,
    hasValidRole,
    user: session.data?.user,
  }
}

export function withAuthLayout<P extends object>(options?: UseAuthOptions) {
  return function (WrappedLayout: ComponentType<P>) {
    return function AuthLayoutWrapper(props: P) {
      const auth = withAuth(options)
      const router = useRouter()

      useEffect(() => {
        if (auth.isLoading) return

        if (!auth.isAuthenticated) {
          router.push(options?.redirectTo || '/signin')
        } else if (!auth.hasValidRole) {
          router.push(options?.unauthorizedRedirect || '/unauthorized')
        }
      }, [auth.isLoading, auth.isAuthenticated, auth.hasValidRole, router])

      if (auth.isLoading) {
        return (
          <div>
            <FullScreenLoader />
          </div>
        )
      }

      if (auth.isLoggingOut) {
        return <FullScreenLoader>Logging out...</FullScreenLoader>
      }

      if (!auth.isAuthenticated || !auth.hasValidRole) {
        return null
      }

      return <WrappedLayout {...props} />
    }
  }
}
