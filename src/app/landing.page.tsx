'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Boxes,
  Building2,
  CheckCircle2,
  ClipboardList,
  Users,
} from 'lucide-react'
import { features, roles } from './app.overview'

const steps = [
  {
    number: '01',
    title: 'Register & label the asset',
    description:
      'The administrator adds the item with its details and photo, then prints its barcode label.',
  },
  {
    number: '02',
    title: 'Request the item',
    description:
      'A faculty member, staff member, or student picks the item, the return date, and the purpose.',
  },
  {
    number: '03',
    title: 'Approve & hand over',
    description:
      'The administrator approves the request and records who received the item, with a photo.',
  },
  {
    number: '04',
    title: 'Return & settle',
    description:
      'The item comes back, its condition is noted, any late or damage fee is applied, and stock is restored.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Boxes className="h-6 w-6" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-gray-900 sm:text-base">
                Asset Borrowing &amp; Management
              </p>
              <p className="hidden text-xs text-gray-500 sm:block">
                School Property Monitoring System
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <a
              href="#features"
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-blue-700 md:block"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-blue-700 md:block"
            >
              How It Works
            </a>
            <a
              href="#roles"
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-blue-700 md:block"
            >
              Users
            </a>
            <Link
              href="/login"
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-blue-50 via-white to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
              <CheckCircle2 className="h-4 w-4" />
              School Property Monitoring
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
              Simplified Asset Borrowing and{' '}
              <span className="text-blue-600">Management System</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              A single place to record school equipment, release it to faculty
              and students, and confirm every item makes its way back. No more
              logbooks, no more guessing where the projector went.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Go to Login
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                Learn More
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Access is granted by the school administrator. Sign in with the
              account issued to you.
            </p>
          </div>

          {/* Illustrative panel */}
          <div className="relative">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Inventory Overview
                  </p>
                  <p className="text-xs text-gray-500">Live from your records</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Monitored
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-5">
                {[
                  { label: 'Total Items', icon: Boxes, tone: 'text-blue-600' },
                  {
                    label: 'Active Borrows',
                    icon: ClipboardList,
                    tone: 'text-indigo-600',
                  },
                  { label: 'Borrowers', icon: Users, tone: 'text-teal-600' },
                  { label: 'Rooms', icon: Building2, tone: 'text-amber-600' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <stat.icon className={`h-5 w-5 ${stat.tone}`} />
                    <p className="mt-3 text-sm font-medium text-gray-700">
                      {stat.label}
                    </p>
                    <div className="mt-2 h-2 w-3/4 rounded-full bg-gray-200" />
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                {[
                  'Borrow request approved for Faculty',
                  'Projector handed over with receipt',
                  'Laptop set returned on time',
                  'Lab kit assigned to Room 204',
                ].map((activity) => (
                  <div key={activity} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                    <p className="text-sm text-gray-600">{activity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything the property custodian needs
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Built around how schools actually hand out and recover equipment.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Four steps, start to finish
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              The full borrowing cycle, from the stockroom shelf and back again.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
              >
                <span className="text-4xl font-bold text-blue-100">
                  {step.number}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              One system, four types of users
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Each account only sees the screens that belong to its role.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <div
                key={role.name}
                className="rounded-xl border border-gray-200 bg-linear-to-b from-white to-gray-50 p-8 shadow-sm"
              >
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
                    <role.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    {role.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {role.description}
                  </p>
                </div>
                <ul className="mt-5 space-y-2 border-t border-gray-100 pt-5">
                  {role.capabilities.map((capability) => (
                    <li key={capability} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      <span className="text-sm text-gray-700">
                        {capability}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-blue-600 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to check your inventory?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Sign in to your account to manage items, transactions, and reports.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-lg transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
          >
            Login to Your Account
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center sm:px-6 md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Boxes className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-gray-900">
              Simplified Asset Borrowing and Management System
            </p>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} School Property Monitoring System.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
