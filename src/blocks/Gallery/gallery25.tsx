'use client'

import React from 'react'
import { motion } from 'framer-motion'

import { GalleryBlock } from '@/payload-types'
import { Media } from '@/components/Media'

interface GalleryColumnProps {
  images: GalleryBlock['elements']
  initialY: number
}

const splitIntoFourSubArrays = (arr: GalleryBlock['elements']): GalleryBlock['elements'][] => {
  if (!Array.isArray(arr)) return []

  const result: GalleryBlock['elements'][] = [[], [], [], []]
  const baseSize = Math.floor(arr.length / 4)
  const extraItems = arr.length % 4

  let index = 0

  for (let i = 0; i < 4; i++) {
    const subArraySize = baseSize + (i < extraItems ? 1 : 0)
    result[i] = arr.slice(index, index + subArraySize)
    index += subArraySize
  }

  return result
}

function GalleryColumn({ images, initialY }: GalleryColumnProps) {
  if (!images) return null
  return (
    <div className="grid gap-4">
      {images.map((image, index: number) => (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            y: initialY,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
          }}
          key={index}
          className="w-full overflow-hidden rounded-2xl bg-muted"
          style={{ height: image.imageHeight as string }}
        >
          <Media
            resource={image.image}
            fill
            imgClassName={`h-full w-full rounded-2xl object-cover !static`}
            htmlElement={null}
          />
        </motion.div>
      ))}
    </div>
  )
}

const Gallery25: React.FC<GalleryBlock> = ({ elements }) => {
  if (!elements) return null

  const columns = splitIntoFourSubArrays(elements)

  return (
    <section className="py-32">
      <div className="relative container">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <GalleryColumn images={columns[0]} initialY={50} />
          <GalleryColumn images={columns[1]} initialY={-50} />
          <GalleryColumn images={columns[2]} initialY={50} />
          <GalleryColumn images={columns[3]} initialY={-50} />
        </div>
      </div>
    </section>
  )
}

export { Gallery25 }
