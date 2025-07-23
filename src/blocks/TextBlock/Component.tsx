import React from 'react'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import type { TextBlock as TextBlockProps } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const TextBlock: React.FC<TextBlockProps & { publicContext: PublicContextProps, disableContainer?: boolean }> = (props) => {
  const { content, links, publicContext, disableContainer } = props

  return (
    <div className={!disableContainer ? 'container py-32' : ''}>
      <div className="w-full">
        {content && <RichText publicContext={publicContext} content={content} />}
        <div className="flex flex-col gap-2 sm:flex-row">
          {Array.isArray(links) &&
            links.length > 0 &&
            links.map(({ link }, i) => <CMSLink publicContext={publicContext} key={i} {...link} />)}
        </div>
      </div>
    </div>
  )
}