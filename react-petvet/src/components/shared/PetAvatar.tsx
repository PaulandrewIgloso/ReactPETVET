import { useEffect, useState } from "react"
import { petsService } from "@/services/pets/pets.service"

interface PetAvatarProps {
  petID: number
  hasPhoto: boolean
  colorClassName: string
  className?: string
}

export function PetAvatar({ petID, hasPhoto, colorClassName, className }: PetAvatarProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!hasPhoto) {
      setObjectUrl(null)
      return
    }
    let cancelled = false
    let currentUrl: string | null = null

    petsService
      .getPhotoBlob(petID)
      .then((blob) => {
        if (cancelled) return
        currentUrl = URL.createObjectURL(blob)
        setObjectUrl(currentUrl)
      })
      .catch(() => {
        if (!cancelled) setObjectUrl(null)
      })

    return () => {
      cancelled = true
      if (currentUrl) URL.revokeObjectURL(currentUrl)
    }
  }, [petID, hasPhoto])

  if (objectUrl) {
    return (
      <img
        src={objectUrl}
        alt=""
        className={className ?? "h-10 w-10 shrink-0 rounded-full object-cover"}
      />
    )
  }

  return <div className={className ?? `h-10 w-10 shrink-0 rounded-full ${colorClassName}`} />
}