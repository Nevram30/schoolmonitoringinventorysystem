'use client'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from 'react'
import { trpcClient } from '@/trpc/client'

/**
 * The count of borrow requests waiting for an admin, shared by everything that displays it.
 *
 * The header bell and the sidebar badge both show this number, and the approvals page needs it to
 * drop the moment a request is decided. Polling in each of them would triple the queries and let
 * the two badges disagree for up to a poll interval, so one provider fetches and they all read it.
 */

const POLL_INTERVAL_MS = 30_000

export interface PendingRequest {
    id: number
    br_quantity: number
    createdAt: Date | string
    Item?: { i_model: string; i_deviceID: string } | null
    Member?: { m_fname: string; m_lname: string } | null
    Requester?: { name: string; role: string } | null
}

interface PendingRequestsValue {
    count: number
    requests: PendingRequest[]
    /** Re-fetch now — used after an approve/reject so the badges update immediately. */
    refresh: () => void
}

// Falling back to an empty value keeps the nav and header renderable outside the provider
// (a Storybook-style render, or a page that forgets to wrap) instead of throwing.
const PendingRequestsContext = createContext<PendingRequestsValue>({
    count: 0,
    requests: [],
    refresh: () => undefined,
})

export const usePendingRequests = () => useContext(PendingRequestsContext)

export function PendingRequestsProvider({ children }: PropsWithChildren) {
    const [count, setCount] = useState(0)
    const [requests, setRequests] = useState<PendingRequest[]>([])

    const refresh = useCallback(async () => {
        try {
            const data = await trpcClient.borrowRequests.pending.query({ limit: 5 })
            if (data.success) {
                setCount(data.count)
                setRequests(data.data as PendingRequest[])
            }
        } catch (error) {
            // A failed poll is not worth interrupting the admin over; the next one will retry.
            console.error('Error fetching pending borrow requests:', error)
        }
    }, [])

    useEffect(() => {
        refresh()

        const timer = setInterval(refresh, POLL_INTERVAL_MS)
        // A tab left open in the background goes stale; refresh when the admin comes back to it.
        const onFocus = () => refresh()
        window.addEventListener('focus', onFocus)

        return () => {
            clearInterval(timer)
            window.removeEventListener('focus', onFocus)
        }
    }, [refresh])

    const value = useMemo(
        () => ({ count, requests, refresh }),
        [count, requests, refresh]
    )

    return (
        <PendingRequestsContext.Provider value={value}>
            {children}
        </PendingRequestsContext.Provider>
    )
}
