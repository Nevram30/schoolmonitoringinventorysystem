'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowPathIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { trpcClient } from '@/trpc/client'
import { peso } from '@/lib/print-report'
import Calendar from '@/components/ui-components/calendar'

interface ConditionRow {
  condition: string
  count: number
  quantity: number
  damageFee: number
}

interface ItemConditionRow {
  status: number
  label: string
  count: number
}

interface RecentReturn {
  id: number
  r_date_returned: Date
  r_condition: string | null
  r_quantity: number
  r_late_fee: number
  r_damage_fee: number
  Item: { i_model: string; i_deviceID: string; i_brand: string }
  Member: { m_fname: string; m_lname: string }
  Room: { r_name: string } | null
}

interface OverdueRow {
  id: number
  b_due_date: Date
  b_quantity: number
  Item: { i_model: string; i_deviceID: string }
  Member: { m_fname: string; m_lname: string }
}

interface DashboardData {
  borrowed: {
    total: number
    active: number
    overdue: number
    returned: number
    quantityOut: number
    pendingRequests: number
  }
  returns: { total: number; thisMonth: number }
  fees: {
    lateFees: number
    damageFees: number
    total: number
    lateFeesThisMonth: number
    damageFeesThisMonth: number
  }
  conditions: ConditionRow[]
  itemConditions: ItemConditionRow[]
  recentReturns: RecentReturn[]
  overdueItems: OverdueRow[]
}

/** Periods the header filter offers, resolved to the range the report query takes. */
type Period = 'all' | 'month' | 'days30' | 'year'

const periodOptions: { value: Period; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'month', label: 'This month' },
  { value: 'days30', label: 'Last 30 days' },
  { value: 'year', label: 'This year' },
]

const rangeFor = (period: Period) => {
  const now = new Date()

  switch (period) {
    case 'month':
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        endDate: now.toISOString(),
      }
    case 'days30':
      return {
        startDate: new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        endDate: now.toISOString(),
      }
    case 'year':
      return {
        startDate: new Date(now.getFullYear(), 0, 1).toISOString(),
        endDate: now.toISOString(),
      }
    default:
      return {}
  }
}

/** Colour a returned condition by how much it costs the school. */
const conditionStyles = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'good':
      return { bar: 'bg-green-500', badge: 'bg-green-100 text-green-800' }
    case 'fair':
      return { bar: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800' }
    case 'damaged':
      return { bar: 'bg-orange-500', badge: 'bg-orange-100 text-orange-800' }
    case 'lost':
      return { bar: 'bg-red-500', badge: 'bg-red-100 text-red-800' }
    default:
      return { bar: 'bg-gray-400', badge: 'bg-gray-100 text-gray-800' }
  }
}

const itemConditionStyles: Record<number, string> = {
  1: 'bg-green-50 text-green-700',
  2: 'bg-blue-50 text-blue-700',
  3: 'bg-yellow-50 text-yellow-700',
  4: 'bg-red-50 text-red-700',
}

const formatDate = (value: Date | string) =>
  new Date(value).toLocaleDateString()

const daysOverdue = (dueDate: Date | string) =>
  Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  )

interface PortalDashboardProps {
  /** Portal the cards link into, e.g. `/student`. */
  basePath: string
  /** Line under the heading naming whose portal this is. */
  subtitle: string
}

/**
 * Borrowing report shared by the student, staff and faculty dashboards. All three portals list
 * every borrow and return rather than only the signed-in account's, so these totals are
 * portal-wide too and match what their Borrowed Items / Returned Items screens show.
 */
export default function PortalDashboard({
  basePath,
  subtitle,
}: PortalDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState<Period>('all')

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      const result = await trpcClient.reports.portalDashboard.query(
        rangeFor(period)
      )

      if (result.success) {
        setData(result.data)
        setError('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('Error fetching dashboard report:', err)
      setError('Failed to load dashboard report')
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const statCards = data
    ? [
        {
          name: 'Borrowed Items',
          value: data.borrowed.active,
          note: `${data.borrowed.quantityOut} unit${
            data.borrowed.quantityOut === 1 ? '' : 's'
          } out`,
          icon: ClipboardDocumentListIcon,
          color: 'bg-blue-500',
          href: `${basePath}/borrowed-items`,
        },
        {
          name: 'Overdue Items',
          value: data.borrowed.overdue,
          note: data.borrowed.overdue > 0 ? 'Needs attention' : 'None past due',
          icon: ExclamationTriangleIcon,
          color: 'bg-red-500',
          href: `${basePath}/borrowed-items`,
        },
        {
          name: 'Returned Items',
          value: data.returns.total,
          note: `${data.returns.thisMonth} this month`,
          icon: CheckCircleIcon,
          color: 'bg-emerald-500',
          href: `${basePath}/returned-items`,
        },
        {
          name: 'Total Fines & Fees',
          value: peso(data.fees.total),
          note: `${peso(data.fees.lateFees)} late · ${peso(
            data.fees.damageFees
          )} damage`,
          icon: BanknotesIcon,
          color: 'bg-purple-500',
          href: `${basePath}/returned-items`,
        },
      ]
    : []

  const totalConditionCount = data
    ? data.conditions.reduce((sum, row) => sum + row.count, 0)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !data ? (
        <div className="rounded-lg bg-white py-16 text-center shadow">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="mt-2 text-sm text-gray-500">Loading report...</p>
        </div>
      ) : data ? (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <Link
                key={card.name}
                href={card.href}
                className="relative block overflow-hidden rounded-lg bg-white px-4 pt-5 pb-5 shadow transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-6 sm:pt-6"
              >
                <div className={`absolute ${card.color} rounded-md p-3`}>
                  <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {card.name}
                </p>
                <p className="ml-16 text-2xl font-semibold text-gray-900">
                  {card.value}
                </p>
                <p
                  className={`ml-16 mt-1 text-xs ${
                    card.name === 'Overdue Items' && data.borrowed.overdue > 0
                      ? 'font-medium text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {card.note}
                </p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Fines, fees and damage fees */}
            <div className="rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Fines &amp; Fees
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Charged on returned items
                </p>

                <dl className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-3">
                    <dt className="flex items-center text-sm font-medium text-gray-700">
                      <ClockIcon className="mr-2 h-5 w-5 text-amber-600" />
                      Late fees (overdue fines)
                    </dt>
                    <dd className="text-lg font-semibold text-amber-700">
                      {peso(data.fees.lateFees)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-orange-50 px-4 py-3">
                    <dt className="flex items-center text-sm font-medium text-gray-700">
                      <WrenchScrewdriverIcon className="mr-2 h-5 w-5 text-orange-600" />
                      Damage fees
                    </dt>
                    <dd className="text-lg font-semibold text-orange-700">
                      {peso(data.fees.damageFees)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-purple-50 px-4 py-3">
                    <dt className="flex items-center text-sm font-medium text-gray-700">
                      <BanknotesIcon className="mr-2 h-5 w-5 text-purple-600" />
                      Total charges
                    </dt>
                    <dd className="text-lg font-semibold text-purple-700">
                      {peso(data.fees.total)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-xs text-gray-500">Late fees this month</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {peso(data.fees.lateFeesThisMonth)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      Damage fees this month
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {peso(data.fees.damageFeesThisMonth)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Condition of returned items */}
            <div className="rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Condition of Returned Items
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {totalConditionCount} return
                  {totalConditionCount === 1 ? '' : 's'} recorded
                </p>

                {data.conditions.length > 0 ? (
                  <ul className="mt-5 space-y-4">
                    {data.conditions.map((row) => {
                      const styles = conditionStyles(row.condition)
                      const share = totalConditionCount
                        ? Math.round((row.count / totalConditionCount) * 100)
                        : 0

                      return (
                        <li key={row.condition}>
                          <div className="flex items-center justify-between text-sm">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${styles.badge}`}
                            >
                              {row.condition}
                            </span>
                            <span className="text-gray-600">
                              {row.count} ({share}%)
                              {row.damageFee > 0 && (
                                <span className="ml-2 text-orange-600">
                                  {peso(row.damageFee)}
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100">
                            <div
                              className={`h-2 rounded-full ${styles.bar}`}
                              style={{ width: `${share}%` }}
                            />
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="mt-8 text-center text-sm text-gray-500">
                    No returns recorded for this period.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Inventory condition */}
          <div className="rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Condition of Items in Inventory
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {data.itemConditions.map((row) => (
                  <div
                    key={row.status}
                    className={`rounded-lg p-4 ${
                      itemConditionStyles[row.status] ?? 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="text-2xl font-bold">{row.count}</div>
                    <div className="text-xs font-medium">{row.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent returns */}
            <div className="rounded-lg bg-white shadow">
              <div className="flex items-center justify-between px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Recent Returns
                </h3>
                <Link
                  href={`${basePath}/returned-items`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View all
                </Link>
              </div>
              {data.recentReturns.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Item
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Condition
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                          Fees
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                          Returned
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {data.recentReturns.map((row) => {
                        const styles = conditionStyles(row.r_condition ?? '')
                        const fees = row.r_late_fee + row.r_damage_fee

                        return (
                          <tr key={row.id}>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">
                                {row.Item.i_model}
                              </div>
                              <div className="text-xs text-gray-500">
                                {row.Item.i_deviceID} ·{' '}
                                {row.Member.m_fname} {row.Member.m_lname}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${styles.badge}`}
                              >
                                {row.r_condition ?? 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-900">
                              {fees > 0 ? (
                                <span className="font-medium text-orange-600">
                                  {peso(fees)}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-500">
                              {formatDate(row.r_date_returned)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="px-4 pb-8 pt-2 text-center text-sm text-gray-500">
                  No returns yet.
                </p>
              )}
            </div>

            {/* Overdue items */}
            <div className="rounded-lg bg-white shadow">
              <div className="flex items-center justify-between px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Overdue Items
                </h3>
                <Link
                  href={`${basePath}/borrowed-items`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View all
                </Link>
              </div>
              {data.overdueItems.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {data.overdueItems.map((row) => {
                    const late = daysOverdue(row.b_due_date)

                    return (
                      <li
                        key={row.id}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {row.Item.i_model}
                          </p>
                          <p className="text-xs text-gray-500">
                            {row.Item.i_deviceID} · {row.Member.m_fname}{' '}
                            {row.Member.m_lname}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-red-600">
                            {late} day{late === 1 ? '' : 's'} late
                          </p>
                          <p className="text-xs text-gray-500">
                            Due {formatDate(row.b_due_date)}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="px-4 pb-8 pt-2 text-center text-sm text-gray-500">
                  Nothing is past due.
                </p>
              )}
            </div>
          </div>
        </>
      ) : null}

      <Calendar />
    </div>
  )
}
