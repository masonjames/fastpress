'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'

import type { CarouselApi } from '../../components/ui/carousel'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel'
import { CasestudiesBlock } 
import { Media } from '../../components/Media'

const Casestudies5: React.FC<CasestudiesBlock> = ({
  slides,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  React.useEffect(() => {
    if (!carouselApi) {
      return
    }

    const onSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap())
    }

    carouselApi.on('select', onSelect)
    return () => {
      carouselApi.off('select', onSelect)
    }
  }, [carouselApi])

  const renderGrid = (images: (typeof slides)[0]['images']) => {
    return (
      <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-3 p-3">
        {Array.from({ length: 9 }).map((_, index) => {
          const image = images.find((img) => img.position === index)
          const isImage = Boolean(image)

          return (
            <div
              key={index}
              className={`w-full overflow-hidden rounded-lg ${isImage ? '' : 'bg-muted'}`}
            >
              {isImage && image?.src && (
                <Media
                  imgClassName="aspect-square h-full w-full object-cover md:aspect-video"
                  className="aspect-square h-full w-full object-cover md:aspect-video"
                  priority
                  resource={image.src}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <section className="bg-background py-32">
      <div className="relative container">
        <div className="mx-auto w-full overflow-hidden rounded-lg md:border">
          <Carousel setApi={setCarouselApi}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative">
                <CarouselContent>
                  {slides.map((testimonial, index) => (
                    <CarouselItem key={index}>
                      <div className="relative flex items-center justify-center overflow-hidden md:h-[500px]">
                        {renderGrid(testimonial.images)}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </div>

              <div className="z-2 flex h-full items-center p-4 md:p-10">
                <div className="flex flex-col gap-y-6 md:gap-y-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.4,
                        ease: 'easeOut',
                      }}
                      className="flex h-12 items-center gap-3"
                    >
                      <Media
                        imgClassName={`w-auto ${slides[currentIndex].logoClass as string}`}
                        alt={slides[currentIndex].name}
                        priority
                        resource={slides[currentIndex].logo}
                      />
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.4,
                        ease: 'easeOut',
                        delay: 0.15,
                      }}
                      className="min-h-[100px] leading-snug tracking-tight text-muted-foreground sm:text-xl xl:mr-8"
                    >
                      {slides[currentIndex].content}
                    </motion.p>
                  </AnimatePresence>

                  <div className="flex h-12 gap-4">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                  </div>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

export { Casestudies5 }
