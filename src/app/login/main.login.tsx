import { redirect } from 'next/navigation'
import LogInForm from './login.form'

type MainContentProps = {
  status: 'authenticated' | 'unauthenticated' | 'loading'
  role: string
  isLoading?: boolean
}

const MainContent: React.FC<MainContentProps> = ({
  status,
  role,
  isLoading,
}) => {
  // The loader sits inside the login card, so it uses a compact spinner rather
  // than the full-screen one.
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-72 w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }

  const page =
    role === 'admin'
      ? 'admin'
      : role === 'faculty'
        ? 'faculty'
        : role === 'student'
          ? 'student'
          : 'staff'

  if (status === 'authenticated') {
    redirect(`/${page}/dashboard`)
  }

  return <LogInForm />
}

export default MainContent
