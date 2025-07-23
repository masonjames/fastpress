import { FeatureBlock } 
import RichText from '../../components/RichText'
import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'
import { PublicContextProps } from '../../utilities/publicContextProps'

const Feature72: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({ richText, links, USPs, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container flex flex-col gap-16 lg:px-16">
        <div className="lg:max-w-sm">
          {richText && (
            <RichText publicContext={publicContext}
              content={richText}
              overrideStyle={{
                h2: 'mb-3 text-xl font-semibold md:mb-4 md:text-4xl lg:mb-6',
                p: 'mb-8 text-muted-foreground lg:text-lg',
              }}
            />
          )}
          {Array.isArray(links) &&
            links.length > 0 &&
            links.map(({ link }, i) => (
              <CMSLink
                publicContext={publicContext}
                key={i}
                {...link}
                className="group flex items-center text-xs font-medium md:text-base lg:text-lg"
                iconClassName="ml-2 size-4 transition-transform group-hover:translate-x-1"
              />
            ))}
        </div>
        {USPs && USPs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {USPs.map((usp, index) => (
              <div key={index} className="flex flex-col text-clip rounded-xl border border-border">
                <div>
                  {usp.image && (
                    <Media
                      resource={usp.image}
                      imgClassName="aspect-video size-full object-cover object-center"
                    />
                  )}
                </div>
                <div className="px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
                  {usp.richText && (
                    <RichText publicContext={publicContext}
                      content={usp.richText}
                      overrideStyle={{
                        h3: 'mb-3 text-lg font-semibold md:mb-4 md:text-2xl lg:mb-6',
                        p: 'text-muted-foreground lg:text-lg',
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Feature72
