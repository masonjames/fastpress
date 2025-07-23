'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Button } from '../../components/ui/button'
import type { CarouselApi } from '../../components/ui/carousel'
import { Carousel, CarouselContent, CarouselItem } from '../../components/ui/carousel'
import { GalleryBlock } 
import RichText from '../../components/RichText'
import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'
import { splitRichText } from '../../utilities/richtext'

import { PublicContextProps } from '../../utilities/publicContextProps'

const Gallery6: React.FC<GalleryBlock & { publicContext: PublicContextProps }> = ({ richText, tagline, link, elements, publicContext }) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  useEffect(() => {
    if (!carouselApi) {
      return
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }
    updateSelection()
    carouselApi.on('select', updateSelection)
    return () => {
      carouselApi.off('select', updateSelection)
    }
  }, [carouselApi])
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
          <div>
            <p className="mb-6 text-xs font-medium uppercase tracking-wider">{tagline}</p>

            {richText && (
              <RichText publicContext={publicContext}
                content={richText}
                overrideStyle={{
                  h2: 'mb-3 text-xl font-semibold md:mb-4 md:text-4xl lg:mb-6',
                  h3: 'mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6',
                }}
                withWrapper={false}
              />
            )}

            {link && (
              <CMSLink
                publicContext={publicContext}
                className="group flex items-center text-xs font-medium md:text-base lg:text-lg"
                {...link}
                iconClassName="ml-2 size-4 transition-transform group-hover:translate-x-1"
              />
            )}
          </div>
          <div className="mt-8 flex shrink-0 items-center justify-center gap-2">
            <Button
              size="icon"
              variant="outline"
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
              variant="outline"
              onClick={() => {
                carouselApi?.scrollNext()
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
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
          <CarouselContent className="ml-[calc(theme(container.padding)-20px)] mr-[calc(theme(container.padding))] 2xl:ml-[calc(50vw-700px+theme(container.padding)-20px)] 2xl:mr-[calc(50vw-700px+theme(container.padding))]">
            {elements &&
              elements.map((item) => {
                /**
                 * We split the rich text into two parts:
                 * - the first part is the title
                 * - the rest is the summary
                 */
                const { firstNode, rest } = splitRichText(item.richText, {
                  splitOn: ['h2', 'h3', 'h4'],
                  takeFirst: true,
                })
                return (
                  <CarouselItem key={item.id} className="pl-[20px] md:max-w-[452px]">
                    <a href={item.link?.url || '#'} className="group flex flex-col justify-between">
                      <div>
                        <div className="flex aspect-3/2 text-clip rounded-xl">
                          <div className="flex-1">
                            <div className="relative size-full origin-bottom transition duration-300 group-hover:scale-105">
                              {item.image && (
                                <Media
                                  resource={item.image}
                                  imgClassName="size-full object-cover object-center"
                                  htmlElement={null}
                                />
                              )}

                            </div>
                          </div>
                        </div>
                      </div>
                      {firstNode && (
                        <RichText publicContext={publicContext}
                          content={firstNode}
                          overrideStyle={{
                            h2: 'mb-2 line-clamp-3 break-words pt-4 text-lg font-medium md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl',
                            h3: 'mb-2 line-clamp-3 break-words pt-4 text-lg font-medium md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl',
                            h4: 'mb-2 line-clamp-3 break-words pt-4 text-lg font-medium md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl',
                            p: 'mb-8 line-clamp-2 text-sm text-muted-foreground md:mb-12 md:text-base lg:mb-9',
                          }}
                          withWrapper={false}
                        />
                      )}
                      {rest && (
                        <RichText publicContext={publicContext}
                          content={rest}
                          overrideStyle={{
                            p: 'mb-8 line-clamp-2 text-sm text-muted-foreground md:mb-12 md:text-base lg:mb-9',
                          }}
                          withWrapper={false}
                        />
                      )}
                      <div className="flex items-center text-sm">
                        Read more{' '}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
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

export default Gallery6
