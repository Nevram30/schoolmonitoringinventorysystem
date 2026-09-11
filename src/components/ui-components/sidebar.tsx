'use client'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useState,
    type PropsWithChildren,
} from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon } from '@heroicons/react/24/outline'

/** Remembers, per browser, whether the sidebar was collapsed — across pages and visits. */
const STORAGE_KEY = 'sidebar-open'
/** Tailwind's `lg` breakpoint: from here up the sidebar sits beside the page; below, it slides over it. */
const DESKTOP_QUERY = '(min-width: 1024px)'
const SIDEBAR_ID = 'sidebar-navigation'

interface SidebarState {
    open: boolean
    isDesktop: boolean
    /** False until the saved preference has been applied; the slide animation waits for it. */
    ready: boolean
    toggle: () => void
    close: () => void
}

const SidebarContext = createContext<SidebarState | null>(null)

const readSavedOpen = () => {
    try {
        return localStorage.getItem(STORAGE_KEY) !== 'false'
    } catch {
        return true
    }
}

/** Shares the sidebar's open state between a role's layout, its sidebar and its header. */
export function SidebarProvider({ children }: PropsWithChildren) {
    const [open, setOpen] = useState(true)
    const [isDesktop, setIsDesktop] = useState(true)
    const [ready, setReady] = useState(false)

    // Applied before the first paint so a collapsed sidebar never flashes open — the admin layout
    // remounts on every page, so this runs on each navigation there. On desktop the saved choice
    // wins; phones always start hidden so the page itself is readable.
    useLayoutEffect(() => {
        const media = window.matchMedia(DESKTOP_QUERY)
        const sync = () => {
            setIsDesktop(media.matches)
            setOpen(media.matches ? readSavedOpen() : false)
        }

        sync()
        setReady(true)
        media.addEventListener('change', sync)
        return () => media.removeEventListener('change', sync)
    }, [])

    // Only the desktop choice is remembered; opening the slide-over on a phone is momentary.
    useEffect(() => {
        if (!ready || !isDesktop) return
        try {
            localStorage.setItem(STORAGE_KEY, String(open))
        } catch {
            // Storage blocked (private mode, site data off): the toggle still works on this page.
        }
    }, [open, isDesktop, ready])

    const toggle = useCallback(() => setOpen((prev) => !prev), [])
    const close = useCallback(() => setOpen(false), [])

    return (
        <SidebarContext.Provider value={{ open, isDesktop, ready, toggle, close }}>
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebar = () => {
    const context = useContext(SidebarContext)
    if (!context) throw new Error('useSidebar must be used inside <SidebarProvider>')
    return context
}

/**
 * Wraps a role's sidebar. On desktop, collapsing narrows it to an icon-only rail so the page
 * gets the room but every link stays one click away. On smaller screens the sidebar slides over
 * the page with a backdrop and closes on navigation, Escape, or a tap outside it; while slid
 * away it is `inert`, so its links cannot take focus.
 */
export function SidebarShell({ children }: PropsWithChildren) {
    const { open, isDesktop, ready, close } = useSidebar()
    const pathname = usePathname()

    // Someone who picked a page from the slide-over wants to see the page, not the menu.
    useEffect(() => {
        if (!isDesktop) close()
    }, [pathname, isDesktop, close])

    useEffect(() => {
        if (isDesktop || !open) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isDesktop, open, close])

    // No transition until the saved state is applied, so loading a page never animates it shut.
    const animation = ready
        ? `${isDesktop ? 'transition-[width]' : 'transition-transform'} duration-200 ease-in-out`
        : ''
    const placement = isDesktop
        ? `sticky top-0 h-screen shrink-0 self-start overflow-hidden ${open ? 'w-64' : 'w-20'}`
        : `fixed inset-y-0 left-0 z-50 w-64 ${open ? 'translate-x-0' : '-translate-x-full'}`

    return (
        <>
            {!isDesktop && open && (
                <div className="fixed inset-0 z-40 bg-gray-900/40" onClick={close} aria-hidden="true" />
            )}
            <div id={SIDEBAR_ID} className={`${placement} ${animation}`} inert={!isDesktop && !open}>
                {children}
            </div>
        </>
    )
}

/** The ☰ button in each header that expands and collapses the sidebar. */
export function SidebarToggleButton() {
    const { open, isDesktop, toggle } = useSidebar()
    const label = isDesktop
        ? open
            ? 'Collapse sidebar'
            : 'Expand sidebar'
        : open
            ? 'Hide navigation'
            : 'Show navigation'

    return (
        <button
            type="button"
            onClick={toggle}
            aria-controls={SIDEBAR_ID}
            aria-expanded={open}
            aria-label={label}
            title={label}
            className="rounded-md p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
        >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
    )
}

export interface SidebarNavItem {
    href: string
    label: string
    icon: string
    /** Count shown beside the label (e.g. pending requests); hidden when 0. */
    badge?: number
}

/**
 * A role's sidebar: title and links. When the desktop sidebar is collapsed it shows only the
 * icons — each link keeps its name for screen readers and as a hover tooltip — and the title
 * shrinks to its first letter. The phone slide-over always shows the full labels.
 */
export function SidebarNavigation({ title, items }: { title: string; items: SidebarNavItem[] }) {
    const pathname = usePathname()
    const { open, isDesktop } = useSidebar()
    const compact = isDesktop && !open

    return (
        <aside className="w-full h-full bg-blue-50 shadow-md flex flex-col">
            <div className={`p-6.5 bg-blue-600 border-b border-blue-700 shrink-0 ${compact ? 'px-0 text-center' : ''}`}>
                <h1 className="text-xl font-bold text-white whitespace-nowrap" title={compact ? title : undefined}>
                    {compact ? title.charAt(0) : title}
                </h1>
            </div>

            <nav className="mt-6 flex-1 overflow-y-auto overflow-x-hidden pb-6" aria-label={title}>
                <ul className={`space-y-2 ${compact ? 'px-2' : 'px-4'}`}>
                    {items.map((item) => {
                        const isActive = pathname === item.href
                        const badge = item.badge ? (item.badge > 99 ? '99+' : String(item.badge)) : null

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    title={compact ? item.label : undefined}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`relative flex items-center py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${compact ? 'justify-center' : 'px-4'} ${isActive
                                        ? 'bg-blue-200 text-blue-800 border-r-4 border-blue-700'
                                        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
                                        }`}
                                >
                                    <span className={`text-lg ${compact ? '' : 'mr-3'}`} aria-hidden="true">
                                        {item.icon}
                                    </span>
                                    <span className={compact ? 'sr-only' : 'flex-1 whitespace-nowrap'}>{item.label}</span>
                                    {badge &&
                                        (compact ? (
                                            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                                                {badge}
                                            </span>
                                        ) : (
                                            <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white">
                                                {badge}
                                            </span>
                                        ))}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    )
}
