'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Eye, EyeOff, KeyRound } from 'lucide-react'

import { trpcClient } from '@/trpc/client'
import { PASSWORD_HINT, passwordIssues } from '@/lib/password-policy'

/**
 * Shown over every page while the signed-in account still has the temporary
 * password an admin e-mailed it. It cannot be dismissed — the only way past it
 * is saving a new password, so the temporary one never stays in use.
 */
export default function ChangePasswordPrompt() {
  const { data: session, update } = useSession()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  if (!session?.user?.mustChangePassword && !done) return null

  const [issue] = password ? passwordIssues(password) : []
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const [firstIssue] = passwordIssues(password)
    if (firstIssue) {
      setError(`${firstIssue}.`)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const result = await trpcClient.users.changePassword.mutate({ password })

      if (!result.success) {
        setError(result.error)
        return
      }

      // Re-issues the session token; the server re-reads the cleared flag.
      await update()
      setDone(true)
    } catch (err) {
      console.error('Error changing password:', err)
      setError('Something went wrong while saving. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
          <h2 className="text-lg font-semibold text-gray-900">Password updated</h2>
          <p className="mt-2 text-sm text-gray-600">
            Use your new password the next time you sign in.
          </p>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="mt-5 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 p-4"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <KeyRound className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 id="change-password-title" className="text-lg font-semibold text-gray-900">
              Change your password
            </h2>
            <p className="text-sm text-gray-600">
              You signed in with a temporary password. Please set a new one to continue.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                autoComplete="new-password"
                autoFocus
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Enter new password"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className={`mt-1 text-xs ${issue ? 'text-red-600' : 'text-gray-500'}`}>
              {issue ? `${issue}.` : PASSWORD_HINT}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError('')
              }}
              autoComplete="new-password"
              required
              className={`mt-1 block w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${mismatch ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Re-enter new password"
            />
            {mismatch && <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>}
          </div>

          {error && (
            <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || !!issue || mismatch}
          className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
