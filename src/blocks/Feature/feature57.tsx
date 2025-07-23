'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@/components/Icon'
import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import type { CarouselApi } from '@/components/ui/carousel'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { FeatureBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'

const Feature57: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({
  richText,
  badge,
  USPs,
  publicContext,
}) => {
  const [selection, setSelection] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  const handleSelection = (index: number) => {
    setSelection(index)
    const mobileCarousel = document.querySelector('.snap-x.snap-mandatory')
    if (mobileCarousel) {
      const slides = Array.from(mobileCarousel.children)
      if (slides[index]) {
        slides[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }
  }

  useEffect(() => {
    if (!carouselApi) {
      return
    }
    carouselApi.scrollTo(selection)
  }, [carouselApi, selection])

  useEffect(() => {
    if (!carouselApi) {
      return
    }
    const updateSelection = () => {
      setSelection(carouselApi.selectedScrollSnap())
    }
    carouselApi.on('select', updateSelection)
    return () => {
      carouselApi.off('select', updateSelection)
    }
  }, [carouselApi])

  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:mb-12">
          <Badge variant="outline" className="mb-3">
            {badge}
          </Badge>
          {richText && (
            <RichText
              publicContext={publicContext}
              withWrapper={false}
              overrideStyle={{
                h1: 'text-3xl leading-tight font-bold md:text-4xl lg:text-5xl',
                h2: 'text-3xl leading-tight font-bold md:text-4xl lg:text-5xl',
                h3: 'text-2xl leading-tight font-bold md:text-3xl lg:text-4xl',
                p: 'mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:mt-4 md:text-base',
              }}
              content={richText}
            />
          )}
        </div>

        <div className="overflow-visible">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:gap-8 lg:gap-16">
            {/* Mobile Image Carousel - Moved to top for mobile */}
            <div className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto [-ms-overflow-style:'none'] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
              {USPs?.map(({ image, uspIcon, tagline, richText }, i) => (
                <div
                  key={i}
                  className="relative h-[min(30rem,65vh)] w-[min(100%,100vw)] shrink-0 cursor-pointer snap-center overflow-hidden rounded-xl border border-border"
                  onClick={() => handleSelection(i)}
                >
                  {image && (
                    <Media
                      resource={image}
                      className="h-full w-full object-cover object-center"
                      imgClassName="h-full w-full object-cover object-center"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/95 via-background/70 to-transparent px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary p-2 text-primary-foreground">
                        {uspIcon && <Icon icon={uspIcon} className="size-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{tagline}</h3>
                        {richText && (
                          <RichText
                            publicContext={publicContext}
                            content={richText}
                            overrideStyle={{
                              p: 'mt-1 line-clamp-2 text-xs text-muted-foreground',
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Indicators */}
            <div className="mb-4 flex justify-center gap-2 md:hidden">
              {USPs?.map((_, index: number) => (
                <button
                  key={index}
                  className={`size-2 rounded-full transition-all ${
                    selection === index ? 'w-6 bg-primary' : 'bg-muted hover:bg-muted-foreground/50'
                  }`}
                  onClick={() => handleSelection(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Feature List */}
            <div className="md:w-1/2 lg:w-2/5">
              <ul className="grid grid-cols-1 gap-3 md:flex md:flex-col md:gap-2">
                {USPs?.map(({ richText, uspIcon, tagline }, index: number) => {
                  const isSelected = selection === index
                  return (
                    <li
                      key={index}
                      className={`group relative flex cursor-pointer rounded-xl border px-4 py-3 transition-all duration-300 md:px-5 md:py-4 ${
                        isSelected
                          ? 'border-border bg-accent shadow-sm'
                          : 'border-transparent hover:border-border hover:bg-accent/30'
                      }`}
                      data-open={isSelected ? 'true' : undefined}
                      onClick={() => handleSelection(index)}
                    >
                      <div className="flex w-full items-start gap-3 md:gap-4">
                        <div
                          className={`flex aspect-square w-9 shrink-0 items-center justify-center rounded-lg transition-colors md:w-10 ${
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {uspIcon && <Icon icon={uspIcon} className="size-4 md:size-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`mb-1 text-sm font-semibold transition-colors md:text-base lg:text-lg ${
                              isSelected ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {tagline}
                          </h3>
                          {richText && (
                            <RichText
                              publicContext={publicContext}
                              content={richText}
                              overrideStyle={{
                                p: 'line-clamp-2 text-xs text-muted-foreground transition-all md:text-sm md:group-data-open:opacity-100 lg:text-sm"',
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Desktop Image Carousel */}
            <div className="relative hidden md:block md:w-1/2 lg:w-3/5">
              <div className="overflow-hidden rounded-xl border border-border shadow-sm">
                <Carousel
                  setApi={setCarouselApi}
                  className="aspect-4/5 max-h-[500px] w-full md:aspect-3/4 lg:aspect-4/5 [&>div]:h-full"
                  opts={{
                    loop: true,
                  }}
                >
                  <CarouselContent className="mx-0 h-full w-full">
                    {USPs?.map(({ image, uspIcon, tagline }, index) => (
                      <CarouselItem key={index} className="px-0">
                        <div className="relative h-full w-full overflow-hidden">
                          {image && (
                            <Media
                              resource={image}
                              className="h-full w-full object-cover object-center transition-transform duration-500 max-h-[500px]"
                              imgClassName="h-full w-full object-cover object-center transition-transform duration-500 max-h-[500px]"
                            />
                          )}
                          <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-background/80 via-background/40 to-transparent p-6">
                            <div className="flex items-center gap-3">
                              <div className="flex aspect-square w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                {uspIcon && <Icon icon={uspIcon} className="size-5" />}
                              </div>
                              <h3 className="text-xl font-semibold text-foreground">{tagline}</h3>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>

              {/* Carousel indicators */}
              <div className="mt-4 flex justify-center gap-2">
                {USPs?.map((_, index: number) => (
                  <button
                    key={index}
                    className={`size-2 rounded-full transition-all ${
                      selection === index
                        ? 'w-6 bg-primary'
                        : 'bg-muted hover:bg-muted-foreground/50'
                    }`}
                    onClick={() => handleSelection(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Feature57
