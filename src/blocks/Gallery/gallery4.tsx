'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Button } from '../../components/ui/button'
import type { CarouselApi } from '../../components/ui/carousel'
import { Carousel, CarouselContent, CarouselItem } from '../../components/ui/carousel'
import { GalleryBlock } 
import { Media } from '../../components/Media'
import RichText from '../../components/RichText'
import { CMSLink } from '../../components/Link'

import { PublicContextProps } from '../../utilities/publicContextProps'

const Gallery4: React.FC<GalleryBlock & { publicContext: PublicContextProps }> = ({ richText, elements, publicContext }) => {
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
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
          {richText && <RichText publicContext={publicContext}
            content={richText}
            withWrapper={true}
            overrideStyle={{
              h2: 'text-3xl font-medium md:text-4xl lg:text-5xl lg:mb-6 md:mb-4',
              p: 'text-muted-foreground',
            }}
          />
          }
          <div className="hidden shrink-0 gap-2 md:flex">
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
              elements.map((item) => (
                <CarouselItem key={item.id} className="max-w-[320px] pl-[20px] lg:max-w-[360px]">
                  <a href={item.link?.url || '#'} className="group rounded-xl" target={item?.link?.newTab ? '_blank' : '_self'}>
                    <div className="group relative h-full min-h-108 max-w-full overflow-hidden rounded-xl bg-red-200 md:aspect-5/4 lg:aspect-video">
                      {item.image && (
                        <Media
                          resource={item.image}
                          className="absolute size-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                          imgClassName="absolute size-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                          fill
                        />
                      )}
                      <div className="absolute inset-0 h-full bg-[linear-gradient(hsl(from_var(--primary)_h_s_l/0.2),hsl(from_var(--primary)_h_s_l/0.8)_100%)] mix-blend-multiply" />
                      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-primary-foreground md:p-8">
                        {item.richText && (
                          <RichText publicContext={publicContext}
                            content={item.richText}
                            overrideStyle={{
                              h3: 'mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4',
                              h4: 'mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4',
                              p: 'mb-8 line-clamp-2 md:mb-12 lg:mb-9',
                            }}
                          />
                        )}
                        {item.link && (
                          <CMSLink
                            publicContext={publicContext}
                            appearance="inline"
                            withAnchor={false}
                            {...item.link}
                            iconClassName="ml-2 size-5 transition-transform group-hover:translate-x-1"
                          />
                        )}
                      </div>
                    </div>
                  </a>
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

export default Gallery4
