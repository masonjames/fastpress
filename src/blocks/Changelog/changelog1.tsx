import { Zap } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Changelogblock } from '@/payload-types'
import RichText from '@/components/RichText'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { Media } from '@/components/Media'

const Changelog1: React.FC<Changelogblock & { publicContext: PublicContextProps }> = ({
  richText,
  publicContext,
  entries,
  tagline,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="text-center">
          {richText && (
            <RichText
              publicContext={publicContext}
              content={richText}
              withWrapper={false}
              overrideStyle={{
                h1: 'mb-4 text-3xl font-semibold md:text-5xl',
                p: 'mb-6 text-muted-foreground md:text-lg',
              }}
            />
          )}
          {/* <div className="mx-auto mb-9 flex w-full max-w-sm items-center space-x-2">
            <Input type="email" placeholder="abc@example.com" />
            <Button type="submit">Subscribe</Button>
          </div> */}
          {tagline && (
            <div className="mx-auto flex w-fit items-center rounded-lg border px-3 py-2.5 text-xs">
              <span className="text-muted-foreground">{tagline}</span>
              <a className="ml-2 flex items-center font-semibold hover:underline" href={`#${entries?.[0]?.id}`}>
                {entries?.[0]?.version ? `v${entries?.[0]?.version}` : ''}
                <Zap className="h-3.5" />
              </a>
            </div>
          )}
        </div>
        <div className="mx-auto mt-20 max-w-screen-lg space-y-20 md:mt-40 md:space-y-32">
          {entries &&
            entries.map((entry) => (
              <div id={entry.id as string} key={entry.id} className="relative flex flex-col gap-5 md:flex-row md:gap-20">
                <div className="top-28 flex h-min shrink-0 items-center gap-5 md:sticky">
                  <Badge variant="secondary">Version {entry.version}</Badge>
                  <span className="text-xs font-medium text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <h2 className="mb-4 text-lg font-semibold md:text-2xl md:leading-5">
                    {entry.title}
                  </h2>
                  {entry.description && (
                    <RichText
                      publicContext={publicContext}
                      content={entry.description}
                      withWrapper={false}
                      overrideStyle={{
                        p: 'text-muted-foreground mb-2 md:text-lg',
                        li: 'text-muted-foreground md:text-lg',
                        h2: 'text-xl font-semibold text-muted-foreground mb-2 mt-4',
                        h3: 'text-base font-semibold md:text-xl text-muted-foreground mb-2 mt-3',
                        h4: 'text-base font-semibold md:text-xl text-muted-foreground mb-2 mt-2',
                      }}
                    />
                  )}
                  {
                    entry.image && <Media imgClassName="mt-10 w-full rounded-lg object-cover" resource={entry.image} />
                  }
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export { Changelog1 }
