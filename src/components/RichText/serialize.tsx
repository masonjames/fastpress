import { BannerBlock } from '../../blocks/LexicalBlocks/Banner/Component'
import { CodeBlock, CodeBlockProps } from '../../blocks/Code/Component'
import { MediaBlock } from '../../blocks/MediaBlock/Component'
import React, { Fragment, JSX } from 'react'
import { CMSLink } from '../../components/Link'
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { BannerBlock as BannerBlockProps, Media as MediaType } from '../../payload-types'
import Image from 'next/image'

import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './nodeFormat'
import type { Page } from '../../payload-types'
import { cn } from '../../utilities/cn'
import { PublicContextProps } from '../../utilities/publicContextProps'
import { getHeadlineId } from '../../utilities/richtext'

export type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | Extract<Page['layout'][0], { blockType: 'cta' }>
      | Extract<Page['layout'][0], { blockType: 'mediaBlock' }>
      | BannerBlockProps
      | CodeBlockProps
    >

export type OverrideStyle = Partial<
  Record<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'li', string>
>

type Props = {
  nodes: NodeTypes[]
  overrideStyle?: OverrideStyle
}

export function serializeLexical({
  nodes,
  overrideStyle,
  publicContext,
}: Props & { publicContext: PublicContextProps }): JSX.Element {
  const defaultStyles: OverrideStyle = {
    h1: 'mb-4 text-4xl font-semibold md:text-5xl',
    h2: 'mb-4 text-3xl font-semibold',
    h3: 'mb-3 text-2xl font-semibold',
    h4: 'mb-2 text-xl font-semibold',
    p: 'text-lg mb-3',
    li: 'text-lg',
  }

  const mergedStyles = { ...defaultStyles, ...overrideStyle }

  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
        if (node == null) {
          return null
        }
        if (node.type === 'text') {
          let text = <React.Fragment key={index}>{node.text}</React.Fragment>
          if (node.format & IS_BOLD) {
            text = <strong key={index}>{text}</strong>
          }
          if (node.format & IS_ITALIC) {
            text = <em key={index}>{text}</em>
          }
          if (node.format & IS_STRIKETHROUGH) {
            text = (
              <span key={index} style={{ textDecoration: 'line-through' }}>
                {text}
              </span>
            )
          }
          if (node.format & IS_UNDERLINE) {
            text = (
              <span key={index} style={{ textDecoration: 'underline' }}>
                {text}
              </span>
            )
          }
          if (node.format & IS_CODE) {
            text = <code key={index}>{node.text}</code>
          }
          if (node.format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>
          }
          if (node.format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>
          }

          return text
        }

        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        const serializedChildrenFn = (node: NodeTypes): JSX.Element | null => {
          if (node.children == null) {
            return null
          } else {
            if (node?.type === 'list' && node?.listType === 'check') {
              for (const item of node.children) {
                if ('checked' in item) {
                  if (!item?.checked) {
                    item.checked = false
                  }
                }
              }
            }
            return serializeLexical({
              nodes: node.children as NodeTypes[],
              overrideStyle: mergedStyles,
              publicContext,
            })
          }
        }

        const serializedChildren = 'children' in node ? serializedChildrenFn(node) : ''

        if (node.type === 'block') {
          const block = node.fields

          const blockType = block?.blockType

          if (!block || !blockType) {
            return null
          }

          switch (blockType) {
            // case 'cta':
            //   return <CallToActionBlock key={index} {...block} />
            case 'mediaBlock':
              return (
                <MediaBlock
                disableContainer
                  key={index}
                  {...block}
                  captionClassName="mx-auto max-w-3xl"
                />
              )
            case 'banner':
              return (
                <BannerBlock
                  className="col-start-2 mb-4"
                  key={index}
                  {...block}
                  publicContext={publicContext}
                />
              )
            case 'code':
              return <CodeBlock className="col-start-2" key={index} {...block} />
            default:
              return null
          }
        } else {
          switch (node.type) {
            case 'linebreak': {
              return <br className="col-start-2" key={index} />
            }
            case 'paragraph': {
              let className = 'col-start-2'
              if (mergedStyles?.p) {
                className = cn(className, mergedStyles?.p)
              }
              if (node.format === 'center') {
                className = cn(className, 'text-center')
              } else if (node.format === 'right') {
                className = cn(className, 'text-right')
              }
              // Handle empty paragraphs for newlines
              const children =
                node.children && node.children.length > 0 ? serializedChildrenFn(node) : <br />

              return (
                <p className={className} key={index}>
                  {children}
                </p>
              )
            }
            case 'heading': {
              const Tag = node?.tag
              let className = 'col-start-2'
              if (mergedStyles?.[Tag]) {
                className = cn(className, mergedStyles?.[Tag])
              }
              if (node.format === 'center') {
                className = cn(className, 'text-center')
              } else if (node.format === 'right') {
                className = cn(className, 'text-right')
              }
              return (
                /**
                 * Set a unique headline id for side menu navigation and general anchor links
                 */
                <Tag className={className} key={index} id={getHeadlineId(node, index.toString())}>
                  {serializedChildren}
                </Tag>
              )
            }
            case 'list': {
              const Tag = node?.tag
              return (
                <Tag
                  className={cn(
                    'col-start-2 ps-7 mb-2 mt-4 space-y-3', 
                    // Add specific styling based on list type
                    node.listType === 'bullet' ? 'list-disc' : 'list-decimal',
                  )}
                  key={index}
                >
                  {serializedChildren}
                </Tag>
              )
            }
            case 'listitem': {
              let className = ''
              if (mergedStyles?.li) {
                className = cn(className, mergedStyles?.li)
              }
              if (node?.checked != null) {
                return (
                  <li
                    aria-checked={node.checked ? 'true' : 'false'}
                    className={className}
                    key={index}
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                    role="checkbox"
                    tabIndex={-1}
                    value={node?.value}
                  >
                    {serializedChildren}
                  </li>
                )
              } else {
                return (
                  <li key={index} className={className} value={node?.value}>
                    {serializedChildren}
                  </li>
                )
              }
            }
            case 'quote': {
              return (
                <blockquote className="col-start-2" key={index}>
                  {serializedChildren}
                </blockquote>
              )
            }
            case 'link': {
              const fields = node.fields

              return (
                <CMSLink
                  publicContext={publicContext}
                  key={index}
                  newTab={Boolean(fields?.newTab)}
                  reference={fields.doc as any}
                  type={fields.linkType === 'internal' ? 'reference' : 'custom'}
                  url={fields.url}
                  appearance="inline"
                  className="text-muted-foreground hover:underline transition-colors"
                >
                  {serializedChildren}
                </CMSLink>
              )
            }
            
            case 'upload': {
              const media = node.value as MediaType
              
              if (!media) return null
              
              const { filename, width, height, alt } = media
              const url = media.url || `/media/${filename}`
              
              return (
                <div className="col-start-2 my-4" key={index}>
                  <figure className="relative w-full">
                    <Image 
                      src={url}
                      alt={alt || ''}
                      width={width || 800}
                      height={height || 600}
                      className="w-full h-auto rounded-md"
                    />
                    {media.caption && (
                      <figcaption className="text-sm text-muted-foreground mt-2">
                        {typeof media.caption === 'string' ? media.caption : (
                          serializeLexical({
                            nodes: media.caption as any,
                            overrideStyle: {
                              p: 'text-sm text-muted-foreground mt-0 mb-0'
                            },
                            publicContext
                          })
                        )}
                      </figcaption>
                    )}
                  </figure>
                </div>
              )
            }

            default:
              return null
          }
        }
      })}
    </Fragment>
  )
}
