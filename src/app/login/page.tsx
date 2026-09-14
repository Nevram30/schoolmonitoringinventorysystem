'use client'
import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Boxes, ShieldCheck } from 'lucide-react'
import MainLogin from './main.login'
import { features, roles } from '../app.overview'

const SignIn = () => {
  const session = useSession()
  const users = session.data?.user as any

  return (
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-2">
      {/* Branding panel */}
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700 p-12 text-white lg:flex lg:flex-col lg:justify-between lg:gap-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl"
        />

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
              <Boxes className="h-6 w-6" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-blue-100">
              School Property Monitoring System
            </span>
          </Link>
        </div>

        <div className="relative max-w-xl">
          <h1 className="text-3xl font-bold leading-tight xl:text-4xl">
            Simplified Asset Borrowing and Management System
          </h1>
          <p className="mt-4 text-base leading-relaxed text-blue-100">
            Sign in to manage school equipment, borrowing transactions, and
            inventory records in one place.
          </p>

          <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-blue-200">
            Features
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3">
            {features.map((feature) => (
              <li
                key={feature.title}
                title={feature.description}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/15 backdrop-blur">
                  <feature.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{feature.title}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-blue-200">
            Who can sign in
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {roles.map((role) => (
              <span
                key={role.name}
                title={role.description}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur"
              >
                <role.icon className="h-4 w-4" />
                {role.name}
              </span>
            ))}
          </div>
        </div>

        <p className="relative text-sm text-blue-200">
          &copy; {new Date().getFullYear()} School Property Monitoring System.
        </p>
      </aside>

      {/* Login panel */}
      <main className="flex min-h-screen flex-col justify-center px-4 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {/* Compact branding for small screens */}
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Boxes className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold text-gray-500">
                School Property Monitoring System
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              Simplified Asset Borrowing and Management System
            </h1>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="mt-1 text-sm text-gray-500">
                Enter your ID number and password to access your account.
              </p>
            </div>

            <MainLogin status={session.status} role={users?.role} />
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <p className="text-sm text-blue-800">
              Accounts are issued by the school administrator. Contact your
              administrator if you cannot sign in.
            </p>
          </div>

          {/* Features and users for small screens, where the branding panel is hidden */}
          <div className="mt-10 lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Who can sign in
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {roles.map((role) => (
                <span
                  key={role.name}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-800"
                >
                  <role.icon className="h-4 w-4" />
                  {role.name}
                </span>
              ))}
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Features
            </p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <li key={feature.title} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {feature.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignIn
