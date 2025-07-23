'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '../../utilities/cn'
import { PublicContextProps } from '../../utilities/publicContextProps'
import { TimelineBlock } 
import { Media } from '../../components/Media'
import RichText from '../../components/RichText'

const Timeline2: React.FC<TimelineBlock & { publicContext: PublicContextProps }> = ({
  heading,
  sections,
  publicContext,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight
      const viewportCenter = viewportHeight / 2

      let closestSection = 0
      let closestDistance = Infinity

      sectionRefs.current.forEach((section, index) => {
        if (section) {
          const rect = section.getBoundingClientRect()
          const sectionCenter = rect.top + rect.height / 2
          const distance = Math.abs(sectionCenter - viewportCenter)

          if (distance < closestDistance) {
            closestDistance = distance
            closestSection = index
          }
        }
      })

      setActiveIndex(closestSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!sections) return null

  return (
    <section className="py-32">
      <div className="container max-w-7xl">
        <h1 className="mb-14 max-w-2xl text-4xl font-semibold text-balance md:text-5xl">
          {heading}
        </h1>
        <div className="flex justify-between gap-20">
          <div className="flex flex-col gap-16 md:w-1/2">
            {sections?.map((section, index) => (
              <div
                key={index}
                ref={(el) => {
                  sectionRefs.current[index] = el
                }}
                className="flex flex-col gap-4 md:h-[50vh]"
              >
                <div className="block rounded-2xl border bg-muted p-4 md:hidden">
                  {section.image && (
                    <Media
                      imgClassName="h-full max-h-full w-full max-w-full rounded-2xl object-cover"
                      className="h-full max-h-full w-full max-w-full rounded-2xl object-cover"
                      alt={section.tagline}
                      priority
                      resource={section.image}
                    />
                  )}
                </div>
                <p className="text-sm font-semibold text-muted-foreground md:text-base">
                  {section.tagline}
                </p>
                {section.richText && (
                  <RichText
                    publicContext={publicContext}
                    withWrapper={false}
                    overrideStyle={{
                      h2: 'text-2xl font-semibold md:text-4xl',
                      h3: 'text-2xl font-semibold md:text-4xl',
                      p: 'text-muted-foreground',
                      li: 'text-muted-foreground',
                    }}
                    content={section.richText}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="sticky top-56 right-0 hidden h-fit w-full items-center justify-center md:flex">
            {sections?.[sections?.length - 1]?.image && (
              <Media
                imgClassName="invisible h-full max-h-[550px] w-full max-w-full object-cover"
                className="invisible h-full max-h-[550px] w-full max-w-full object-cover"
                alt={sections?.[sections?.length - 1]?.tagline}
                priority
                resource={sections?.[sections?.length - 1]?.image || ''}
              />
            )}

            {sections?.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'absolute inset-0 flex h-full items-center justify-center rounded-2xl border bg-muted p-4 transition-opacity duration-200',
                  index === activeIndex ? 'opacity-100' : 'opacity-0',
                )}
              >
                {item.image && (
                  <Media
                    imgClassName="h-full max-h-full w-full max-w-full rounded-2xl border object-cover"
                    className="h-full max-h-full w-full max-w-full rounded-2xl border object-cover"
                    alt={item.tagline}
                    priority
                    resource={item.image}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Timeline2
