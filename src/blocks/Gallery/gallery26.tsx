'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GalleryBlock } from '@/payload-types'
import { Media } from '@/components/Media'

const gridClasses = [
  'col-span-2 h-82 hover:rounded-[2.5rem]',
  'col-span-3 h-82 hover:rounded-[2.5rem]',
  'col-span-5 h-100 hover:rounded-[2.5rem]',
  'col-span-2 h-82 hover:rounded-[2.5rem]',
  'col-span-3 h-82 hover:rounded-[2.5rem]',
  'col-span-3 h-82 hover:rounded-[2.5rem]',
  'col-span-2 h-82 hover:rounded-[2.5rem]',
  'col-span-5 h-100 hover:rounded-[2.5rem]',
  'col-span-2 h-82 hover:rounded-[2.5rem]',
  'col-span-3 h-82 hover:rounded-[2.5rem]',
]

const Gallery26: React.FC<GalleryBlock> = ({ elements }) => {
  if (!elements) return null

  return (
    <section className="py-32">
      <div className="relative container">
        <div className="grid grid-cols-5 gap-4">
          {elements.slice(0, 10).map((element, idx) => (
            <BlurVignette
              key={idx}
              radius="24px"
              inset="10px"
              transitionLength="100px"
              blur="15px"
              className={gridClasses[idx]}
            >
              <Media
                resource={element.image}
                fill
                imgClassName={`size-full rounded-[2.5rem] object-cover${idx === 9 ? ' transition-all ease-in-out' : ''} !static`}
                size="200px"
                htmlElement={null}
              />
            </BlurVignette>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Gallery26 }

interface BlurVignetteProps {
  children: React.ReactNode
  className?: string
  radius?: string
  inset?: string
  transitionLength?: string
  blur?: string
}

const BlurVignette = ({
  children,
  className = '',
  radius = '24px',
  inset = '16px',
  transitionLength = '32px',
  blur = '21px',
}: BlurVignetteProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        y: -50,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      viewport={{ once: true, amount: 0.2 }}
      className={`group relative cursor-pointer overflow-hidden ${className}`}
    >
      <style>
        {`
          .blur-vignette {
            --radius: ${radius};
            --inset: ${inset};
            --transition-length: ${transitionLength};
            --blur: ${blur};
            position: absolute;
            inset: 0;
            -webkit-backdrop-filter: blur(var(--blur));
            backdrop-filter: blur(var(--blur));
            --r: max(var(--transition-length), calc(var(--radius) - var(--inset)));
            --corner-size: calc(var(--r) + var(--inset)) calc(var(--r) + var(--inset));
            --corner-gradient: transparent 0px,
              transparent calc(var(--r) - var(--transition-length)), 
              black var(--r);
            --fill-gradient: black, 
              black var(--inset),
              transparent calc(var(--inset) + var(--transition-length)),
              transparent calc(100% - var(--transition-length) - var(--inset)),
              black calc(100% - var(--inset));
            --fill-narrow-size: calc(100% - (var(--inset) + var(--r)) * 2);
            --fill-farther-position: calc(var(--inset) + var(--r));
            -webkit-mask-image: linear-gradient(to right, var(--fill-gradient)),
              linear-gradient(to bottom, var(--fill-gradient)),
              radial-gradient(at bottom right, var(--corner-gradient)),
              radial-gradient(at bottom left, var(--corner-gradient)),
              radial-gradient(at top left, var(--corner-gradient)),
              radial-gradient(at top right, var(--corner-gradient));
            -webkit-mask-size: 100% var(--fill-narrow-size), 
              var(--fill-narrow-size) 100%,
              var(--corner-size), 
              var(--corner-size), 
              var(--corner-size),
              var(--corner-size);
            -webkit-mask-position: 0 var(--fill-farther-position), 
              var(--fill-farther-position) 0,
              0 0, 
              100% 0, 
              100% 100%, 
              0 100%;
            -webkit-mask-repeat: no-repeat;
            opacity: 0;
            transition: opacity 0.3s ease;    
        }

        .blur-vignette.active {
        opacity: 1;
        }

        .group:hover .blur-vignette {
        opacity: 0;
        }
        `}
      </style>
      <div className="blur-vignette active }" />
      {children}
    </motion.div>
  )
}
