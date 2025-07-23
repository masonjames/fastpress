import type { StaticImageData } from 'next/image'
import type { ElementType, Ref } from 'react'

import type { Media as MediaType } from '@/payload-types'

export interface Props {
  alt?: string | null
  className?: string
  fill?: boolean // for NextImage only
  htmlElement?: ElementType | null
  /**
   * This class name will be passed to the NextImage component.
   */
  imgClassName?: string
  onClick?: () => void
  onLoad?: () => void
  priority?: boolean // for NextImage only
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  loading?: 'eager' | 'lazy'
  /**
   * for Payload media
   */
  resource?: MediaType | string | number 
  size?: string // for NextImage only
  src?: StaticImageData // for static media
  videoClassName?: string
}
