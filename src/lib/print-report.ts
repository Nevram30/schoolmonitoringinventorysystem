import { photoSrc } from '@/components/ui-components/item.avatar'

/** Values come from the database, so they cannot go into report markup raw. */
export const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export const peso = (value: number) =>
  `₱${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

/**
 * A report opens in a blank window, which has no base URL, so a relative `/api/files/...` or
 * legacy `/uploads/items/...` path has to be made absolute or the image silently 404s.
 */
const absolutePhotoSrc = (photo: string) => {
  const src = photoSrc(photo)
  return /^https?:\/\//.test(src) ? src : `${window.location.origin}${src}`
}

/**
 * Photo cell for a printed table: the picture when there is one, otherwise the item's brand
 * initial in a grey box — the print equivalent of the ItemAvatar fallback.
 */
export const photoCellHtml = (
  photo?: string | null,
  brand?: string | null,
  alt?: string | null,
  size = 44
) => {
  const hasPhoto = Boolean(photo) && photo !== 'default.jpg'

  if (hasPhoto) {
    return `<img src="${escapeHtml(absolutePhotoSrc(photo!))}" alt="${escapeHtml(alt)}"
      style="width:${size}px;height:${size}px;object-fit:cover;border:1px solid #ddd;border-radius:4px;" />`
  }

  const letter = (brand ?? '').trim().charAt(0).toUpperCase() || '?'
  return `<div style="width:${size}px;height:${size}px;border:1px solid #ddd;border-radius:4px;
    background:#eee;color:#666;display:flex;align-items:center;justify-content:center;
    font-weight:600;font-size:${Math.round(size / 2.5)}px;">${escapeHtml(letter)}</div>`
}

/** Shared print styles so photos and shaded headers survive the print dialog. */
export const printColorStyles = `
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
`

interface OpenReportOptions {
  html: string
  onBlocked: () => void
  onReady: () => void
  onError: (error: unknown) => void
  /** How long to wait for photos before printing anyway. */
  imageTimeoutMs?: number
}

/**
 * Opens the report in a new window and waits for its images to finish loading before calling
 * print() — without this, photos are still in flight when the print dialog snapshots the page
 * and the report comes out with empty boxes.
 */
export const openPrintableReport = ({
  html,
  onBlocked,
  onReady,
  onError,
  imageTimeoutMs = 5000,
}: OpenReportOptions) => {
  try {
    const reportWindow = window.open('', '_blank')
    if (!reportWindow) {
      onBlocked()
      return
    }

    reportWindow.document.write(html)
    reportWindow.document.close()
    reportWindow.focus()

    const images = Array.from(reportWindow.document.images)
    const pending = images
      .filter((image) => !image.complete)
      .map(
        (image) =>
          new Promise<void>((resolve) => {
            image.addEventListener('load', () => resolve(), { once: true })
            // A broken photo must not hold the report hostage.
            image.addEventListener('error', () => resolve(), { once: true })
          })
      )

    const timeout = new Promise<void>((resolve) =>
      setTimeout(resolve, imageTimeoutMs)
    )

    void Promise.race([Promise.all(pending), timeout]).then(() => {
      if (reportWindow.closed) return
      reportWindow.print()
      onReady()
    })
  } catch (error) {
    onError(error)
  }
}
