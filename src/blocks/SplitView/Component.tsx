import { cn } from 'src/utilities/cn'
import React from 'react'
import type { SplitViewBlock as SplitViewBlockProps } from '@/payload-types'
import { RenderBlocks } from '../RenderBlocks'
import { PublicContextProps } from '@/utilities/publicContextProps'

type Props = {
  columns: SplitViewBlockProps['columns']
  publicContext: PublicContextProps
}

const colsSpanClasses = {
  half: 'lg:col-span-6',
  oneThird: 'lg:col-span-4',
  twoThirds: 'lg:col-span-8',
}

/**
 * Enable columns for a split view with subcomponent blocks
 */
export const SplitViewBlock: React.FC<Props> = (props) => {
  const { columns, publicContext } = props

  if (!columns?.length) return null

  return (
    <section className="w-full py-16 overflow-x-hidden">
      <div className="container">
        <div className="grid grid-cols-12 gap-4 md:gap-8">
          {columns.map((column, index) => {
            /**
             * This is just a small typescript hack, as do enhance all block types by the "size" property
             * using the appendSizeFieldToBlock function
             */
            const size = (column as any)?.size || 'half'
            return (
              <div key={index} className={cn('col-span-12', colsSpanClasses[size], 'flex items-center')}>
                <RenderBlocks blocks={[column]} publicContext={publicContext} disableContainer={true} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
