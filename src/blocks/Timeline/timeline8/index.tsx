import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { TimelineBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import styles from './index.module.css'

const Timeline8: React.FC<TimelineBlock & { publicContext: PublicContextProps }> = ({
  heading,
  sections,
  publicContext,
}) => {
  const formatDateToReadable = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (!sections) return null

  return (
    <section className="bg-background py-32">
      <div className="container">
        <h1 className="mb-10 text-center text-3xl font-bold tracking-tighter text-foreground lg:text-6xl">
          {heading}
        </h1>
        <div className="relative mx-auto max-w-4xl">
          <Separator orientation="vertical" className="absolute top-4 left-2 bg-muted" />
          {sections?.map((entry, index: number) => (
            <div key={index} className="relative mb-10 pl-8">
              <div className="absolute top-2 left-0 flex size-5 items-center justify-center rounded-full bg-foreground">
                <div className="size-3 rounded-full bg-white" />
              </div>
              <Badge variant="secondary" className="mb-4 rounded-xl px-3 py-2 text-sm">
                {entry?.date && formatDateToReadable(entry.date)}
              </Badge>

              <Card className="my-5 border-none bg-transparent shadow-none">
                <CardContent className="px-2">
                  {entry.richText && (
                    <RichText
                      className={styles.richtextList}
                      publicContext={publicContext}
                      withWrapper={false}
                      overrideStyle={{
                        p: 'text-md leading-relaxed text-foreground',
                        li: 'text-md leading-relaxed text-foreground',
                      }}
                      content={entry?.richText}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Timeline8
