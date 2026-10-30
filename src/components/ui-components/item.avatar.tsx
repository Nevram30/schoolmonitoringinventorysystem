'use client'

import { useState } from 'react'

interface ItemAvatarProps {
  /**
   * Stored photo. New items hold an `/api/files` path; older rows still hold
   * an UploadThing URL or a filename served from `/uploads/items`. `default.jpg`
   * (or empty) means "no photo was uploaded".
   */
  photo?: string | null
  /** The letter shown when there is no photo comes from the first character of this. */
  brand?: string | null
  alt?: string
  /** Size / shape classes for the avatar box. */
  className?: string
  /** Font size class for the letter. */
  textClassName?: string
}

// Static class strings so Tailwind's scanner keeps them in the build.
const PALETTE = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-cyan-600',
  'bg-orange-500',
  'bg-teal-600',
]

/** Uploads are stored as a path or full URL; legacy rows only stored the filename. */
export const photoSrc = (photo: string) =>
  /^(https?:\/\/|\/)/.test(photo) ? photo : `/uploads/items/${photo}`

const letterFor = (brand?: string | null) => {
  const first = (brand ?? '').trim().charAt(0)
  return first ? first.toUpperCase() : '?'
}

/** Same brand always gets the same colour, so an item looks stable across screens. */
const colorFor = (brand?: string | null) => {
  const key = (brand ?? '').trim().toUpperCase()
  if (!key) return 'bg-gray-400'

  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return PALETTE[hash % PALETTE.length]
}

export default function ItemAvatar({
  photo,
  brand,
  alt = '',
  className = 'h-20 w-20',
  textClassName = 'text-2xl',
}: ItemAvatarProps) {
  const [failed, setFailed] = useState(false)

  const hasPhoto = Boolean(photo) && photo !== 'default.jpg'

  if (hasPhoto && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoSrc(photo!)}
        alt={alt}
        className={`${className} rounded-md object-cover border border-gray-300`}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <div
      className={`${className} ${colorFor(brand)} rounded-md border border-gray-300 flex items-center justify-center select-none`}
      title={alt}
      aria-label={alt}
    >
      <span className={`font-semibold text-white ${textClassName}`}>
        {letterFor(brand)}
      </span>
    </div>
  )
}
