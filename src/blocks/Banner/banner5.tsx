'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { BannerBlockV2 } from '@/payload-types'
import { Icon } from '@/components/Icon'
import { CMSLink } from '@/components/Link'

const Banner5: React.FC<BannerBlockV2 & { publicContext: PublicContextProps }> = ({
  position,
  title,
  description,
  icon,
  links,
  publicContext,
  defaultVisible,
}) => {
  const [isVisible, setIsVisible] = useState(defaultVisible)

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <section
      className={
        position === 'BOTTOM'
          ? 'fixed bottom-0 left-0 right-0 mx-auto max-w-2xl mb-4 animate-fade-in z-100'
          : 'absolute top-4 right-0 left-0 mx-auto max-w-2xl animate-fade-in z-100'
      }
    >
      <div className="mx-4">
        <div className="w-full rounded-lg border bg-white p-4 shadow-md">
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-8 w-8 md:hidden"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex flex-col items-start gap-3 pt-2 md:flex-row md:items-center md:pt-0">
              {icon && <Icon icon={icon} className="size-5 shrink-0" />}
              <div className="flex flex-col gap-1 md:flex-row md:items-center">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {Array.isArray(links) &&
                links.length > 0 &&
                links.map(({ link }, i) => {
                  return (
                    <CMSLink
                      publicContext={publicContext}
                      className="w-full sm:w-auto"
                      key={i}
                      {...link}
                      size={'sm'}
                      appearance={"outline"}
                    />
                  )
                })}
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-8 w-8 md:inline-flex"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner5
