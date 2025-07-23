import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FeatureBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { PublicContextProps } from '@/utilities/publicContextProps'

/**
 * A repeating pattern of three feature cards
 * @param param0
 * @returns
 */
const Feature50: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({ richText, links, USPs, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-screen-md flex-col items-center gap-6">
          {richText && (
            <RichText publicContext={publicContext}
              content={richText}
              withWrapper={false}
              overrideStyle={{
                h2: 'mb-2 text-balance text-center text-3xl font-semibold lg:text-5xl',
                h3: 'mb-2 text-balance text-center text-2xl font-semibold lg:text-3xl',
                p: 'text-center text-muted-foreground lg:text-lg',
              }}
            />
          )}
          {Array.isArray(links) &&
            links.length > 0 &&
            links.map(({ link }, i) => <CMSLink publicContext={publicContext} key={i} {...link} size={'lg'} />)}
        </div>
        <div className="mx-auto mt-20 flex max-w-screen-lg grid-cols-1 flex-col gap-6 lg:grid lg:grid-cols-7">
          {USPs?.map(({ richText, link, image, tagline }, index) => {
            // Use modulo to create repeating pattern
            const styleIndex = index % 3

            if (styleIndex === 0) {
              return (
                <a
                  key={index}
                  href={link?.url || '#'}
                  className="col-span-7 grid overflow-hidden rounded-lg bg-muted sm:grid-cols-2"
                >
                  <div className="flex flex-col justify-between p-8 lg:p-12">
                    <div>
                      {tagline && (
                        <div className="mb-4 text-xs text-muted-foreground">{tagline}</div>
                      )}
                      {richText && (
                        <RichText publicContext={publicContext}
                          content={richText}
                          withWrapper={false}
                          overrideStyle={{
                            h3: 'mb-2 text-xl font-medium lg:text-2xl',
                            p: 'text-sm text-muted-foreground lg:text-base',
                          }}
                        />
                      )}
                    </div>
                    {link && (
                      <div className="mt-6 sm:mt-8">
                        <CMSLink
                          publicContext={publicContext}
                          {...link}
                          iconClassName='ml-1 h-4'
                          className="mt-6 sm:mt-8"
                          appearance={'outline'}
                          withAnchor={false}
                        />
                      </div>
                    )}
                  </div>
                  {image && (
                    <div className="order-first relative h-72 sm:order-last sm:h-full">
                      <Media
                        resource={image}
                        imgClassName="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  )}
                </a>
              )
            } else if (styleIndex === 1) {
              return (
                <a
                  key={index}
                  href={link?.url || '#'}
                  className="group relative rounded-lg bg-muted lg:col-span-3"
                >
                  {image && (
                    <div className="relative h-72">
                      <Media
                        resource={image}
                        imgClassName="absolute inset-0 h-full w-full rounded-lg border-b object-cover"
                      />
                    </div>
                  )}
                  <div className="relative z-10 p-8 lg:p-12">
                    {tagline && <div className="mb-4 text-xs text-muted-foreground">{tagline}</div>}
                    {richText && (
                      <RichText publicContext={publicContext}
                        content={richText}
                        withWrapper={false}
                        overrideStyle={{
                          h3: 'mb-2 text-xl font-medium lg:text-2xl',
                        }}
                      />
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-10 top-7 z-20 transition-all duration-200 lg:translate-y-2 lg:opacity-0 group-hover:opacity-100 lg:group-hover:translate-y-0"
                  >
                    <ChevronRight className="h-4" />
                  </Button>
                </a>
              )
            } else {
              return (
                <a
                  key={index}
                  href={link?.url || '#'}
                  className="grid rounded-lg bg-muted sm:grid-cols-2 lg:col-span-4"
                >
                  {image && (
                    <div className="relative h-96 sm:h-full">
                      <Media
                        resource={image}
                        imgClassName="absolute inset-0 h-full w-full rounded-lg border-b object-cover sm:rounded-none lg:border-b-0 lg:border-r"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-between p-8 lg:p-12">
                    <div>
                      {tagline && (
                        <div className="mb-4 text-xs text-muted-foreground">{tagline}</div>
                      )}
                      {richText && (
                        <RichText publicContext={publicContext}
                          content={richText}
                          withWrapper={false}
                          overrideStyle={{
                            h3: 'mb-2 text-xl font-medium lg:text-2xl',
                          }}
                        />
                      )}
                    </div>
                    {link && (
                      <CMSLink
                        publicContext={publicContext}
                        {...link}
                        iconClassName='ml-1 h-4'
                        className="mt-6 sm:mt-8"
                        appearance={'outline'}
                        withAnchor={false}
                      />
                    )}
                  </div>
                </a>
              )
            }
          })}
        </div>
      </div>
    </section>
  )
}

export default Feature50
