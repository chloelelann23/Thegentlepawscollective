'use client'

import Image from 'next/image'
import { useState } from 'react'

interface DriveImageProps {
  fileId?: string | null
  drivePath?: string | null
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  fallbackSrc?: string
  sizes?: string
}

export default function DriveImage({
  fileId,
  drivePath,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  fallbackSrc,
  sizes,
}: DriveImageProps) {
  const [error, setError] = useState(false)
  const [src, setSrc] = useState(() => getInitialSrc(fileId, drivePath))

  function getInitialSrc(id?: string | null, path?: string | null): string {
    if (id) {
      return `https://lh3.googleusercontent.com/d/${id}=s1200`
    }
    return fallbackSrc ?? '/placeholder.jpg'
  }

  const handleError = () => {
    if (!error) {
      setError(true)
      setSrc(fallbackSrc ?? '/placeholder.jpg')
    }
  }

  const imageProps = {
    src,
    alt,
    className,
    priority,
    onError: handleError,
    sizes: sizes ?? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  }

  if (fill) {
    return <Image {...imageProps} fill style={{ objectFit: 'cover' }} />
  }

  return (
    <Image
      {...imageProps}
      width={width ?? 800}
      height={height ?? 600}
    />
  )
}
