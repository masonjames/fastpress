'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { GalleryBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { Icon } from '@/components/Icon'

// Default icons to use as fallbacks if no icon is specified
const defaultIcons = ['CheckSquare', 'Clock', 'Users', 'Target', 'Focus']

const Gallery5: React.FC<GalleryBlock & { publicContext: PublicContextProps }> = ({
  richText,
  tagline,
  elements,
  publicContext,
}) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [selection, setSelection] = useState(0)

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
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
      setSelection(carouselApi.selectedScrollSnap())
    }
    updateSelection()
    carouselApi.on('select', updateSelection)
    return () => {
      carouselApi.off('select', updateSelection)
    }
  }, [carouselApi])

  return (
    <section className="py-32">
      <div className="container mb-14 flex flex-col gap-16 lg:mb-16 lg:px-16">
        <div className="lg:max-w-lg">
          {richText && (
            <RichText
              publicContext={publicContext}
              content={richText}
              withWrapper={true}
              overrideStyle={{
                h2: 'mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6',
                p: 'text-muted-foreground lg:text-lg',
              }}
            />
          )}
        </div>
        <div className="flex shrink-0 gap-2 md:hidden">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              carouselApi?.scrollPrev()
            }}
            disabled={!canScrollPrev}
            className="disabled:pointer-events-auto"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              carouselApi?.scrollNext()
            }}
            disabled={!canScrollNext}
            className="disabled:pointer-events-auto"
          >
            <ArrowRight className="size-5" />
          </Button>
        </div>
        {elements && elements.length > 0 && (
          <div className="hidden space-y-4 space-x-4 text-center md:flex md:flex-wrap">
            <ToggleGroup
              type="single"
              variant="outline"
              size="lg"
              className="flex-wrap"
              value={elements[selection]?.id || ''}
              onValueChange={(newValue) => {
                if (newValue) {
                  setSelection(elements.findIndex((item) => item.id === newValue))
                }
              }}
            >
              {elements.map((item, index) => {
                // Get the icon from the item or use a default icon
                const iconName = item.icon || defaultIcons[index % defaultIcons.length]

                return (
                  <ToggleGroupItem
                    key={item.id || `item-${index}`}
                    value={item.id || `item-${index}`}
                    className="flex flex-col items-center p-4 text-center"
                  >
                    <Icon icon={iconName} className="size-4" />
                  </ToggleGroupItem>
                )
              })}
            </ToggleGroup>
          </div>
        )}
      </div>
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              '(max-width: 768px)': {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-[calc(theme(container.padding)-40px)] mr-[calc(theme(container.padding))] lg:mr-[200px] lg:ml-[calc(200px-40px)] 2xl:mr-[calc(50vw-700px+200px)] 2xl:ml-[calc(50vw-700px+200px-40px)]">
            {elements &&
              elements.map((item, index) => {
                // Get the icon from the item or use a default icon
                const iconName = item.icon || defaultIcons[index % defaultIcons.length]

                return (
                  <CarouselItem key={item.id || `item-${index}`} className="pl-[40px]">
                    <a
                      href={item.link?.url || '#'}
                      className="group rounded-xl"
                      target={item.link?.newTab ? '_blank' : '_self'}
                    >
                      <div className="flex flex-col overflow-clip rounded-xl border border-border md:col-span-2 md:grid md:grid-cols-2 md:gap-6 lg:gap-8">
                        <div className="md:min-h-96 lg:min-h-112 xl:min-h-128">
                          {item.image && (
                            <Media
                              resource={item.image}
                              className="aspect-video h-full w-full object-cover object-center"
                              imgClassName="aspect-video h-full w-full object-cover object-center"
                            />
                          )}
                        </div>
                        <div className="flex flex-col justify-center px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
                          <Icon icon={iconName} className="mb-4 size-6" />
                          {item.richText ? (
                            <RichText
                              publicContext={publicContext}
                              content={item.richText}
                              overrideStyle={{
                                h3: 'mb-3 text-lg font-semibold md:mb-4 md:text-2xl lg:mb-6',
                                h4: 'mb-3 text-lg font-semibold md:mb-4 md:text-2xl lg:mb-6',
                                p: 'text-muted-foreground lg:text-lg',
                              }}
                            />
                          ) : (
                            <>
                              <h3 className="mb-3 text-lg font-semibold md:mb-4 md:text-2xl lg:mb-6">
                                Feature Item
                              </h3>
                              <p className="text-muted-foreground lg:text-lg">
                                This is a placeholder description for the feature item.
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </a>
                  </CarouselItem>
                )
              })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

export default Gallery5
