'use client'

import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'

import { departmentLabel } from '@/lib/departments'
import { trpcClient } from '@/trpc/client'

type ChartsResult = Awaited<ReturnType<typeof trpcClient.reports.dashboardCharts.query>>
type ChartData = Extract<ChartsResult, { success: true }>['data']
type MonthPoint = ChartData['months'][number]

/*
 * Colors come from the validated default data-viz palette: categorical slots in their fixed
 * order (checked for colorblind separation as adjacent pairs, so stacks are drawn in slot
 * order), a gray for "Other", and recessive chrome. Text always uses ink tokens — never a
 * series color.
 */
const SERIES = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4']
const OTHER_COLOR = '#898781'
const INK_PRIMARY = '#0b0b0b'
const INK_SECONDARY = '#52514e'
const INK_MUTED = '#898781'
const GRIDLINE = '#e1e0d9'
const BASELINE = '#c3c2b7'
const SURFACE = '#ffffff'

const RANGES = [
    { months: 6, label: 'Last 6 months' },
    { months: 12, label: 'Last 12 months' },
]

/** Departments shown by name; the rest fold into one "Other" row. */
const TOP_DEPARTMENTS = 7

const monthDate = (key: string) => {
    const [year = 1970, month = 1] = key.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, 1))
}

const shortMonth = (key: string) =>
    monthDate(key).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })

const monthYear = (key: string) =>
    monthDate(key).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })

/** Whole-number axis ticks on a 1 / 2 / 5 step, topping out at or just above `max`. */
const niceScale = (max: number, target = 4) => {
    const raw = Math.max(max, 1) / target
    const magnitude = 10 ** Math.floor(Math.log10(raw))
    const step = Math.max(1, [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? magnitude * 10)
    const top = Math.max(step, Math.ceil(max / step) * step)

    const ticks: number[] = []
    for (let tick = 0; tick <= top; tick += step) ticks.push(tick)
    return { top, ticks }
}

/**
 * Item id -> palette slot. Items that stay in the top five keep their slot when the range
 * changes (color follows the item, not its rank); newcomers take the free slots.
 */
const assignSlots = (ids: number[], previous: Map<number, number>) => {
    const next = new Map<number, number>()
    for (const id of ids) {
        const slot = previous.get(id)
        if (slot !== undefined) next.set(id, slot)
    }

    const used = new Set(next.values())
    for (const id of ids) {
        if (next.has(id)) continue
        const free = SERIES.findIndex((_, slot) => !used.has(slot))
        next.set(id, free)
        used.add(free)
    }
    return next
}

/** Column path with 4px-rounded top corners and a square base. */
const roundedTopRect = (x: number, y: number, w: number, h: number, r: number) =>
    `M${x},${y + h}V${y + r}A${r},${r} 0 0 1 ${x + r},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${y + r}V${y + h}Z`

const nearestIndex = (event: PointerEvent<SVGSVGElement>, count: number, xOf: (index: number) => number) => {
    const pointerX = event.clientX - event.currentTarget.getBoundingClientRect().left
    let best = 0
    for (let index = 1; index < count; index++) {
        if (Math.abs(xOf(index) - pointerX) < Math.abs(xOf(best) - pointerX)) best = index
    }
    return best
}

/** Arrow-key stepping through months, so the charts can be read without a pointer. */
const stepIndex = (key: string, current: number | null, count: number) => {
    if (key === 'ArrowRight') return Math.min(count - 1, (current ?? -1) + 1)
    if (key === 'ArrowLeft') return Math.max(0, (current ?? count) - 1)
    if (key === 'Home') return 0
    if (key === 'End') return count - 1
    return null
}

function useElementWidth<T extends HTMLElement>() {
    const ref = useRef<T>(null)
    const [width, setWidth] = useState(0)

    // Measured before the first paint so the chart never flashes empty; the observer's first
    // report only arrives after a rendering frame, and it then keeps the width in step.
    useLayoutEffect(() => {
        const element = ref.current
        if (!element) return

        setWidth(element.getBoundingClientRect().width)
        const observer = new ResizeObserver(([entry]) => {
            if (entry) setWidth(entry.contentRect.width)
        })
        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    return [ref, width] as const
}

function ChartCard({
    title,
    subtitle,
    legend,
    table,
    dimmed,
    children,
}: {
    title: string
    subtitle: string
    legend?: ReactNode
    table: ReactNode
    dimmed: boolean
    children: ReactNode
}) {
    const [showTable, setShowTable] = useState(false)

    return (
        // min-w-0 lets a grid column shrink below the chart's current pixel width, so the chart
        // can re-measure and redraw narrower when the window shrinks.
        <div className="min-w-0 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowTable((prev) => !prev)}
                        className="shrink-0 rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {showTable ? 'Show chart' : 'Show table'}
                    </button>
                </div>
                {legend && !showTable && <div className="mt-4">{legend}</div>}
                {/* While a new range loads, the previous render stays up, faded. */}
                <div className={`mt-4 transition-opacity ${dimmed ? 'opacity-50' : ''}`}>
                    {showTable ? table : children}
                </div>
            </div>
        </div>
    )
}

function Legend({
    entries,
}: {
    entries: { key: string; label: string; detail?: string; color: string; shape: 'line' | 'rect' }[]
}) {
    return (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            {entries.map((entry) => (
                <li key={entry.key} className="flex items-center gap-1.5">
                    <span
                        className={entry.shape === 'line' ? 'h-0.5 w-3.5 rounded-full' : 'h-2.5 w-2.5 rounded-sm'}
                        style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.label}</span>
                    {entry.detail && <span className="text-gray-500">{entry.detail}</span>}
                </li>
            ))}
        </ul>
    )
}

function ChartTooltip({ x, containerWidth, top = 0, children }: {
    x: number
    containerWidth: number
    top?: number
    children: ReactNode
}) {
    // On the right half the tooltip sits left of the cursor so it never runs off the card. It is
    // anchored by its right edge there: positioning by `left` and shifting with a transform would
    // size it to the sliver between the cursor and the card edge and wrap every label.
    const flip = x > containerWidth / 2

    return (
        <div
            role="status"
            className="pointer-events-none absolute z-10 w-max min-w-40 max-w-64 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg"
            style={flip ? { right: containerWidth - x + 12, top } : { left: x + 12, top }}
        >
            {children}
        </div>
    )
}

/** Value first (what the reader is after), series name second, keyed by a short line. */
function TooltipRow({ color, value, label }: { color: string; value: ReactNode; label: string }) {
    return (
        <div className="mt-1 flex items-center gap-2">
            <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-semibold text-gray-900 tabular-nums">{value}</span>
            <span className="wrap-break-word text-gray-500">{label}</span>
        </div>
    )
}

function DataTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        {head.map((cell, index) => (
                            <th
                                key={index}
                                scope="col"
                                className={`px-3 py-2 text-xs font-medium uppercase tracking-wider text-gray-500 ${index ? 'text-right' : 'text-left'}`}
                            >
                                {cell}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, index) => (
                                <td
                                    key={index}
                                    className={`px-3 py-2 ${index ? 'text-right tabular-nums text-gray-900' : 'text-gray-700'}`}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function EmptyChart({ message }: { message: string }) {
    return (
        <div className="flex h-48 items-center justify-center rounded-md border-2 border-dashed border-gray-200">
            <p className="text-sm text-gray-500">{message}</p>
        </div>
    )
}

/** Gridlines, y ticks and month labels shared by the two month charts. */
function MonthAxes({ keys, ticks, x, y, left, right, bottom }: {
    keys: string[]
    ticks: number[]
    x: (index: number) => number
    y: (value: number) => number
    left: number
    right: number
    bottom: number
}) {
    // Thin the month labels when they would crowd; count back from the latest month so it is always shown.
    const every = keys.length > 1 && (right - left) / keys.length < 40 ? 2 : 1
    const firstShown = (keys.length - 1) % every

    return (
        <g fontSize={11} fill={INK_MUTED}>
            {ticks.map((tick) => (
                <g key={tick}>
                    <line
                        x1={left}
                        x2={right}
                        y1={y(tick)}
                        y2={y(tick)}
                        stroke={tick === 0 ? BASELINE : GRIDLINE}
                        strokeWidth={1}
                        shapeRendering="crispEdges"
                    />
                    <text x={left - 8} y={y(tick)} dy="0.32em" textAnchor="end" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {tick}
                    </text>
                </g>
            ))}
            {keys.map((key, index) => {
                if ((keys.length - 1 - index) % every !== 0) return null
                // The year rides on the first label shown and on every January.
                const showYear = index === firstShown || key.endsWith('-01')

                return (
                    <text key={key} x={x(index)} y={bottom + 16} textAnchor="middle">
                        {shortMonth(key)}
                        {showYear && (
                            <tspan x={x(index)} dy={13}>
                                {key.slice(0, 4)}
                            </tspan>
                        )}
                    </text>
                )
            })}
        </g>
    )
}

const LINE_HEIGHT = 240
const LINE_MARGIN = { top: 12, right: 92, bottom: 40, left: 36 }

function ActivityChart({ months }: { months: MonthPoint[] }) {
    const [containerRef, width] = useElementWidth<HTMLDivElement>()
    const [active, setActive] = useState<number | null>(null)

    const series = [
        { name: 'Borrowed', color: SERIES[0]!, values: months.map((month) => month.borrowed) },
        { name: 'Returned', color: SERIES[1]!, values: months.map((month) => month.returned) },
    ]

    const { top, ticks } = niceScale(Math.max(0, ...series.flatMap((s) => s.values)))
    const left = LINE_MARGIN.left
    const right = Math.max(left + 1, width - LINE_MARGIN.right)
    const bottom = LINE_HEIGHT - LINE_MARGIN.bottom
    const last = months.length - 1

    const x = (index: number) => (last === 0 ? (left + right) / 2 : left + (index / last) * (right - left))
    const y = (value: number) => bottom - (value / top) * (bottom - LINE_MARGIN.top)
    const linePath = (values: number[]) =>
        values.map((value, index) => `${index === 0 ? 'M' : 'L'}${x(index)},${y(value)}`).join('')

    // End labels only when they would not overlap; the legend and tooltip cover the rest.
    const [endA = 0, endB = 0] = series.map((s) => y(s.values[last] ?? 0))
    const endLabelsFit = Math.abs(endA - endB) >= 16
    const dotIndex = active ?? last
    const activeMonth = active !== null ? months[active] : undefined

    return (
        // The svg is absolutely positioned inside a fixed-height box so its pixel width never
        // counts toward the page's minimum width — otherwise the admin layout's flex column
        // could not shrink past it, and the chart would never re-measure narrower.
        <div ref={containerRef} className="relative" style={{ height: LINE_HEIGHT }}>
            {width > 0 && (
                <svg
                    width={width}
                    height={LINE_HEIGHT}
                    tabIndex={0}
                    role="img"
                    aria-label="Line chart of items borrowed and returned per month. Use the left and right arrow keys to read each month."
                    className="absolute inset-0 block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    onPointerMove={(event) => setActive(nearestIndex(event, months.length, x))}
                    onPointerLeave={() => setActive(null)}
                    onFocus={() => setActive(last)}
                    onBlur={() => setActive(null)}
                    onKeyDown={(event) => {
                        const next = stepIndex(event.key, active, months.length)
                        if (next === null) return
                        event.preventDefault()
                        setActive(next)
                    }}
                >
                    <MonthAxes
                        keys={months.map((month) => month.key)}
                        ticks={ticks}
                        x={x}
                        y={y}
                        left={left}
                        right={right}
                        bottom={bottom}
                    />
                    {active !== null && (
                        <line
                            x1={x(active)}
                            x2={x(active)}
                            y1={LINE_MARGIN.top}
                            y2={bottom}
                            stroke={BASELINE}
                            strokeWidth={1}
                            shapeRendering="crispEdges"
                        />
                    )}
                    {series.map((s) => (
                        <path
                            key={s.name}
                            d={linePath(s.values)}
                            fill="none"
                            stroke={s.color}
                            strokeWidth={2}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    ))}
                    {series.map((s) => (
                        <circle
                            key={s.name}
                            cx={x(dotIndex)}
                            cy={y(s.values[dotIndex] ?? 0)}
                            r={4}
                            fill={s.color}
                            stroke={SURFACE}
                            strokeWidth={2}
                        />
                    ))}
                    {endLabelsFit &&
                        series.map((s) => (
                            <text key={s.name} x={right + 10} y={y(s.values[last] ?? 0)} dy="0.32em" fontSize={12} fill={INK_SECONDARY}>
                                <tspan fontWeight={600} fill={INK_PRIMARY}>
                                    {s.values[last] ?? 0}
                                </tspan>
                                {' '}
                                {s.name}
                            </text>
                        ))}
                </svg>
            )}
            {active !== null && activeMonth && (
                <ChartTooltip x={x(active)} containerWidth={width}>
                    <p className="font-medium text-gray-700">{monthYear(activeMonth.key)}</p>
                    {series.map((s) => (
                        <TooltipRow key={s.name} color={s.color} value={s.values[active] ?? 0} label={s.name} />
                    ))}
                </ChartTooltip>
            )}
        </div>
    )
}

interface StackSeries {
    key: string
    label: string
    detail?: string
    color: string
    values: number[]
}

const BAR_HEIGHT = 260
const BAR_MARGIN = { top: 20, right: 8, bottom: 40, left: 36 }

function ItemsByMonthChart({ keys, series }: { keys: string[]; series: StackSeries[] }) {
    const [containerRef, width] = useElementWidth<HTMLDivElement>()
    const [active, setActive] = useState<number | null>(null)

    const totals = keys.map((_, index) => series.reduce((sum, s) => sum + (s.values[index] ?? 0), 0))
    const { top, ticks } = niceScale(Math.max(0, ...totals))
    const left = BAR_MARGIN.left
    const right = Math.max(left + 1, width - BAR_MARGIN.right)
    const bottom = BAR_HEIGHT - BAR_MARGIN.bottom
    const band = (right - left) / keys.length
    // Thin columns: capped at 24px, the rest of the band is air.
    const barWidth = Math.min(24, band * 0.6)

    const center = (index: number) => left + band * index + band / 2
    const y = (value: number) => bottom - (value / top) * (bottom - BAR_MARGIN.top)
    const peak = totals.indexOf(Math.max(...totals))
    const activeKey = active !== null ? keys[active] : undefined

    return (
        // Absolutely positioned for the same reason as the activity chart: see there.
        <div ref={containerRef} className="relative" style={{ height: BAR_HEIGHT }}>
            {width > 0 && (
                <svg
                    width={width}
                    height={BAR_HEIGHT}
                    tabIndex={0}
                    role="img"
                    aria-label="Stacked column chart of the most borrowed items per month. Use the left and right arrow keys to read each month."
                    className="absolute inset-0 block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    onPointerMove={(event) => setActive(nearestIndex(event, keys.length, center))}
                    onPointerLeave={() => setActive(null)}
                    onFocus={() => setActive(keys.length - 1)}
                    onBlur={() => setActive(null)}
                    onKeyDown={(event) => {
                        const next = stepIndex(event.key, active, keys.length)
                        if (next === null) return
                        event.preventDefault()
                        setActive(next)
                    }}
                >
                    <MonthAxes keys={keys} ticks={ticks} x={center} y={y} left={left} right={right} bottom={bottom} />
                    {keys.map((key, index) => {
                        const x0 = center(index) - barWidth / 2
                        const visible = series.filter((s) => (s.values[index] ?? 0) > 0)
                        let cumulative = 0

                        return (
                            <g key={key} opacity={active === null || active === index ? 1 : 0.45}>
                                {visible.map((s, position) => {
                                    const value = s.values[index] ?? 0
                                    const yTop = y(cumulative + value)
                                    const yBottom = y(cumulative)
                                    cumulative += value

                                    // A 2px surface gap separates each segment from the one below it.
                                    const gap = position === 0 ? 0 : 2
                                    const height = Math.max(1, yBottom - yTop - gap)

                                    return position === visible.length - 1 ? (
                                        <path
                                            key={s.key}
                                            d={roundedTopRect(x0, yTop, barWidth, height, Math.min(4, height, barWidth / 2))}
                                            fill={s.color}
                                        />
                                    ) : (
                                        <rect key={s.key} x={x0} y={yTop} width={barWidth} height={height} fill={s.color} />
                                    )
                                })}
                            </g>
                        )
                    })}
                    {/* Only the busiest month gets a cap label; the axis and tooltip carry the rest. */}
                    {(totals[peak] ?? 0) > 0 && (
                        <text
                            x={center(peak)}
                            y={y(totals[peak] ?? 0) - 6}
                            textAnchor="middle"
                            fontSize={11}
                            fontWeight={600}
                            fill={INK_SECONDARY}
                        >
                            {totals[peak]}
                        </text>
                    )}
                </svg>
            )}
            {active !== null && activeKey && (
                <ChartTooltip x={center(active)} containerWidth={width}>
                    <p className="font-medium text-gray-700">{monthYear(activeKey)}</p>
                    <p className="text-gray-500">
                        <span className="font-semibold text-gray-900 tabular-nums">{totals[active]}</span> borrows
                    </p>
                    {series
                        .filter((s) => (s.values[active] ?? 0) > 0)
                        .map((s) => (
                            <TooltipRow key={s.key} color={s.color} value={s.values[active] ?? 0} label={s.label} />
                        ))}
                </ChartTooltip>
            )}
        </div>
    )
}

interface DepartmentRow {
    key: string
    label: string
    full: string
    count: number
    borrowers: number
    color: string
}

function DepartmentChart({ rows }: { rows: DepartmentRow[] }) {
    const [active, setActive] = useState<{ index: number; top: number } | null>(null)
    const max = Math.max(1, ...rows.map((row) => row.count))
    const total = rows.reduce((sum, row) => sum + row.count, 0)
    const activeRow = active ? rows[active.index] : undefined

    return (
        <div className="relative">
            <ul className="space-y-1" aria-label="Borrows by department">
                {rows.map((row, index) => (
                    <li
                        key={row.key}
                        tabIndex={0}
                        aria-label={`${row.full}: ${row.count} borrows by ${row.borrowers} borrowers`}
                        onPointerEnter={(event) => setActive({ index, top: event.currentTarget.offsetTop })}
                        onPointerLeave={() => setActive(null)}
                        onFocus={(event) => setActive({ index, top: event.currentTarget.offsetTop })}
                        onBlur={() => setActive(null)}
                        className={`grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)] items-center gap-3 rounded py-1.5 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] ${active && active.index !== index ? 'opacity-50' : ''}`}
                    >
                        <span className="wrap-break-word text-xs text-gray-600">{row.label}</span>
                        <span className="flex items-center gap-2">
                            {/* Square at the baseline, 4px-rounded at the tip, value right after it. */}
                            <span
                                className="h-4 rounded-r"
                                style={{
                                    width: `calc((100% - 2.5rem) * ${row.count / max})`,
                                    minWidth: 2,
                                    backgroundColor: row.color,
                                }}
                            />
                            <span className="text-xs font-semibold text-gray-900 tabular-nums">{row.count}</span>
                        </span>
                    </li>
                ))}
            </ul>
            {active && activeRow && (
                <div
                    role="status"
                    className="pointer-events-none absolute right-0 z-10 max-w-64 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg"
                    style={{ top: active.top + 30 }}
                >
                    <p className="font-medium text-gray-700">{activeRow.full}</p>
                    <TooltipRow color={activeRow.color} value={activeRow.count} label="borrows" />
                    <p className="mt-1 text-gray-500">
                        {activeRow.borrowers} {activeRow.borrowers === 1 ? 'borrower' : 'borrowers'} ·{' '}
                        {Math.round((activeRow.count / Math.max(total, 1)) * 100)}% of all borrows
                    </p>
                </div>
            )}
        </div>
    )
}

/**
 * Borrowing analytics for the admin dashboard: a monthly activity line, the most borrowed
 * items per month, and the departments that borrow the most — all scoped by one range filter.
 */
export default function DashboardCharts() {
    const [months, setMonths] = useState(RANGES[0]!.months)
    const [data, setData] = useState<ChartData | null>(null)
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)
    const [itemSlots, setItemSlots] = useState<Map<number, number>>(() => new Map())

    useEffect(() => {
        let cancelled = false
        setLoading(true)

        trpcClient.reports.dashboardCharts
            .query({ months, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
            .then((result) => {
                if (cancelled) return
                if (result.success) {
                    setData(result.data)
                    setItemSlots((prev) => assignSlots(result.data.topItems.map((item) => item.id), prev))
                    setFailed(false)
                } else {
                    setFailed(true)
                }
            })
            .catch((error) => {
                console.error('Error fetching dashboard charts:', error)
                if (!cancelled) setFailed(true)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [months])

    const keys = data?.months.map((month) => month.key) ?? []
    const totalBorrows = data?.months.reduce((sum, month) => sum + month.borrowed, 0) ?? 0

    // Stacked bottom-up in palette-slot order — the order the colors were validated in.
    const stackSeries: StackSeries[] = data
        ? [
              ...data.topItems
                  .map((item, rank) => ({
                      key: String(item.id),
                      label: item.i_model,
                      detail: item.i_deviceID,
                      slot: itemSlots.get(item.id) ?? rank,
                      values: data.itemsByMonth.map((month) => month.counts[rank] ?? 0),
                  }))
                  .sort((a, b) => a.slot - b.slot)
                  .map(({ slot, ...rest }) => ({ ...rest, color: SERIES[slot] ?? OTHER_COLOR })),
              ...(data.itemsByMonth.some((month) => month.other > 0)
                  ? [
                        {
                            key: 'other',
                            label: 'Other items',
                            color: OTHER_COLOR,
                            values: data.itemsByMonth.map((month) => month.other),
                        },
                    ]
                  : []),
          ]
        : []

    const departments = data?.departments ?? []
    const shownDepartments = departments.length > TOP_DEPARTMENTS + 1 ? departments.slice(0, TOP_DEPARTMENTS) : departments
    const foldedDepartments = departments.slice(shownDepartments.length)
    const departmentRows: DepartmentRow[] = [
        ...shownDepartments.map((row) => ({
            key: row.department,
            label: departmentLabel(row.department),
            full: row.department,
            count: row.count,
            borrowers: row.borrowers,
            color: SERIES[0]!,
        })),
        ...(foldedDepartments.length > 0
            ? [
                  {
                      key: 'other',
                      label: `Other (${foldedDepartments.length})`,
                      full: `${foldedDepartments.length} other departments`,
                      count: foldedDepartments.reduce((sum, row) => sum + row.count, 0),
                      borrowers: foldedDepartments.reduce((sum, row) => sum + row.borrowers, 0),
                      color: OTHER_COLOR,
                  },
              ]
            : []),
    ]

    return (
        <section aria-labelledby="borrowing-analytics-heading" className="space-y-4">
            <div>
                <h2 id="borrowing-analytics-heading" className="text-lg font-medium text-gray-900">
                    Borrowing Analytics
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Date range">
                    {RANGES.map((range) => (
                        <button
                            key={range.months}
                            type="button"
                            aria-pressed={months === range.months}
                            onClick={() => setMonths(range.months)}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                months === range.months
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {range.label}
                        </button>
                    ))}
                    {loading && data && <span className="text-xs text-gray-500">Updating…</span>}
                    {failed && data && <span className="text-xs text-red-600">Could not refresh — showing the last result.</span>}
                </div>
            </div>

            {!data ? (
                <div className="flex h-48 items-center justify-center rounded-lg bg-white shadow">
                    {failed ? (
                        <p className="text-sm text-red-600">Failed to load charts.</p>
                    ) : (
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    )}
                </div>
            ) : (
                <>
                    <ChartCard
                        title="Borrowing activity"
                        subtitle="Items borrowed and returned each month"
                        dimmed={loading}
                        legend={
                            <Legend
                                entries={[
                                    { key: 'borrowed', label: 'Borrowed', color: SERIES[0]!, shape: 'line' },
                                    { key: 'returned', label: 'Returned', color: SERIES[1]!, shape: 'line' },
                                ]}
                            />
                        }
                        table={
                            <DataTable
                                head={['Month', 'Borrowed', 'Returned']}
                                rows={data.months.map((month) => [monthYear(month.key), month.borrowed, month.returned])}
                            />
                        }
                    >
                        <ActivityChart months={data.months} />
                    </ChartCard>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <ChartCard
                            title="Most borrowed items per month"
                            subtitle={
                                data.topItems.length > 0
                                    ? `Top ${data.topItems.length} items in this period; the rest are grouped as Other`
                                    : 'Top items in this period'
                            }
                            dimmed={loading}
                            legend={
                                totalBorrows > 0 && (
                                    <Legend
                                        entries={stackSeries.map((s) => ({
                                            key: s.key,
                                            label: s.label,
                                            detail: s.detail,
                                            color: s.color,
                                            shape: 'rect' as const,
                                        }))}
                                    />
                                )
                            }
                            table={
                                <DataTable
                                    head={[
                                        'Month',
                                        ...stackSeries.map((s) => (s.detail ? `${s.label} (${s.detail})` : s.label)),
                                        'Total',
                                    ]}
                                    rows={keys.map((key, index) => [
                                        monthYear(key),
                                        ...stackSeries.map((s) => s.values[index] ?? 0),
                                        stackSeries.reduce((sum, s) => sum + (s.values[index] ?? 0), 0),
                                    ])}
                                />
                            }
                        >
                            {totalBorrows === 0 ? (
                                <EmptyChart message="No borrows in this period." />
                            ) : (
                                <ItemsByMonthChart keys={keys} series={stackSeries} />
                            )}
                        </ChartCard>

                        <ChartCard
                            title="Top borrower departments"
                            subtitle="Borrows in this period by the borrower's department"
                            dimmed={loading}
                            table={
                                <DataTable
                                    head={['Department', 'Borrows', 'Borrowers', 'Share']}
                                    rows={departments.map((row) => [
                                        row.department,
                                        row.count,
                                        row.borrowers,
                                        `${Math.round((row.count / Math.max(totalBorrows, 1)) * 100)}%`,
                                    ])}
                                />
                            }
                        >
                            {departmentRows.length === 0 ? (
                                <EmptyChart message="No borrows in this period." />
                            ) : (
                                <DepartmentChart rows={departmentRows} />
                            )}
                        </ChartCard>
                    </div>
                </>
            )}
        </section>
    )
}
