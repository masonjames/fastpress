import React, { Fragment } from 'react'

import { SimpleTextBlock } from './SimpleTextBlock/Component'

// FastPress block type definition
interface Block {
  blockType: string
  id?: string
  backgroundColor?: string
  [key: string]: any
}

const blockComponents: Partial<Record<string, React.FC<any>>> = {
  text: SimpleTextBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Block[]
  disableContainer?: boolean
}> = (props) => {
  const { blocks, disableContainer } = props


  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            let className = ''
            if ('backgroundColor' in block) {
              // HACK: this enumeration is needed because otherwise tailwind compiler does not include the bg-* class in the output
              switch (block.backgroundColor) {
                case 'primary':
                  className = 'bg-primary'
                  break
                case 'primary-foreground':
                  className = 'bg-primary-foreground'
                  break
                case 'secondary':
                  className = 'bg-secondary'
                  break
                case 'secondary-foreground':
                  className = 'bg-secondary-foreground'
                  break
                case 'accent':
                  className = 'bg-accent'
                  break
                case 'accent-foreground':
                  className = 'bg-accent-foreground'
                  break
                case 'background':
                  className = 'bg-background'
                  break
                case 'foreground':
                  className = 'bg-foreground'
                  break
                case 'muted':
                  className = 'bg-muted'
                  break
                case 'muted-foreground':
                  className = 'bg-muted-foreground'
                  break
                case 'muted2':
                  className = 'bg-muted2'
                  break
                case 'muted2-foreground':
                  className = 'bg-muted2-foreground'
                  break
                case 'card':
                  className = 'bg-card'
                  break
                case 'card-foreground':
                  className = 'bg-card-foreground'
                  break
                case 'popover':
                  className = 'bg-popover'
                  break
                case 'popover-foreground':
                  className = 'bg-popover-foreground'
                  break
                case 'destructive':
                  className = 'bg-destructive'
                  break
                case 'destructive-foreground':
                  className = 'bg-destructive-foreground'
                  break
                case 'border':
                  className = 'bg-border'
                  break
                case 'input':
                  className = 'bg-input'
                  break
                case 'ring-3':
                  className = 'bg-ring'
                  break
                case 'success':
                  className = 'bg-success'
                  break
                case 'warning':
                  className = 'bg-warning'
                  break
                case 'error':
                  className = 'bg-error'
                  break
                case 'chart-1':
                  className = 'bg-chart-1'
                  break
                case 'chart-2':
                  className = 'bg-chart-2'
                  break
                case 'chart-3':
                  className = 'bg-chart-3'
                  break
                case 'chart-4':
                  className = 'bg-chart-4'
                  break
                case 'chart-5':
                  className = 'bg-chart-5'
                  break
                case 'transparent':
                default:
                  className = ''
              }
            }

            if (Block) {
              return (
                <div key={index} className={className} id={block.id || undefined}>
                  <Block
                    {...block}
                    disableContainer={disableContainer}
                  />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}