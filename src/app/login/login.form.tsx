'use client'
import React, { useId, useState } from 'react'
import { IdCard, Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react'
import { signIn } from 'next-auth/react'

// Faculty, staff, students and the admin all sign in with their school ID
// number — the account's username is never typed here.
type SignInFormData = {
  id_number: string
  password: string
}

type AuthError = Partial<SignInFormData> & { general?: string }

/**
 * `authorize` reports failures as a JSON string, so a malformed or unexpected
 * value must still produce something readable rather than blanking the alert.
 */
const parseAuthError = (raw: string): AuthError => {
  try {
    const parsed = JSON.parse(raw)
    const error = parsed?.error

    if (typeof error === 'string') {
      return { general: error }
    }

    if (error && typeof error === 'object') {
      return {
        id_number: error.id_number,
        password: error.password,
        general: error.general,
      }
    }
  } catch {
    // Not our envelope — fall through to the generic message below.
  }

  return { general: 'Unable to sign in. Please try again.' }
}

const SignInForm: React.FC = () => {
  const ids: SignInFormData = {
    password: useId(),
    id_number: useId(),
  }

  const [formData, setFormData] = useState<SignInFormData>({
    id_number: '',
    password: '',
  })

  const [formError, setFormError] = useState<Partial<SignInFormData>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loginError, setLoginError] = useState<boolean>(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (formError[name as keyof SignInFormData]) {
      setFormError((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const OnSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await signIn('credentials', {
        redirect: false,
        ...formData,
      })

      if ((response as any).error) {
        // `error` is the `{ success, error }` envelope thrown by `authorize`:
        // field messages for a failed validation, `general` for everything else.
        const { id_number, password, general } = parseAuthError(
          (response as any).error
        )

        setFormError({ id_number, password })

        if (general) {
          setErrorMessage(general)
          setLoginError(true)
        } else {
          setLoginError(false)
        }

        return
      }

      setFormError({})
      setLoginError(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={OnSubmit}>
      <div>
        <label
          htmlFor={ids.id_number}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          ID Number
        </label>
        <div className="relative">
          <IdCard className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            id={ids.id_number}
            type="text"
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="Enter your ID number"
            name="id_number"
            autoComplete="username"
            value={formData.id_number}
            onChange={handleInputChange}
          />
        </div>
        {formError.id_number && (
          <p className="mt-1.5 text-sm text-red-600">{formError.id_number}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={ids.password}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            id={ids.password}
            type={showPassword ? 'text' : 'password'}
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-11 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="••••••••"
            name="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {formError.password && (
          <p className="mt-1.5 text-sm text-red-600">{formError.password}</p>
        )}
      </div>

      {loginError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Sign in
          </>
        )}
      </button>
    </form>
  )
}

export default SignInForm
