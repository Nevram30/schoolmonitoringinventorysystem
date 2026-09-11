'use client'

import { useEffect } from 'react'

/**
 * Registers the service worker that makes the app installable and gives it an offline page.
 * Production builds only: under `next dev` a worker caching /_next/static would serve stale code.
 */
export default function ServiceWorkerRegistration() {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return

        navigator.serviceWorker
            .register('/sw.js')
            .catch((error) => console.error('Service worker registration failed:', error))
    }, [])

    return null
}
