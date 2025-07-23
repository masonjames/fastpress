import { ArrowRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { FeatureBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { PublicContextProps } from '@/utilities/publicContextProps'

/**
 * https://www.shadcnblocks.com/block/feature103/
 * @returns
 */
const Feature103: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({ tagline, USPs, richText, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col gap-3">
          {tagline && (
            <Badge variant="outline" className="w-fit">
              {tagline}
            </Badge>
          )}
          {richText && (
            <RichText publicContext={publicContext}
              content={richText}
              withWrapper={false}
              overrideStyle={{ h2: 'text-2xl md:text-4xl' }}
            />
          )}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {USPs?.map((usp, index) => (
            <a
              key={index}
              href={usp.link?.url || '#'}
              className="flex flex-col rounded-xl border p-6 hover:border-primary relative"
            >
              {usp.richText && (
                <RichText publicContext={publicContext}
                  content={usp.richText}
                  withWrapper={false}
                  overrideStyle={{
                    h3: 'text-lg font-medium mb-4 pr-12',
                    p: 'text-muted-foreground',
                  }}
                />
              )}
              <span className="absolute right-6 top-6 flex size-8 shrink-0 items-center justify-center rounded-full border">
                <ArrowRight className="h-auto w-4" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Feature103
