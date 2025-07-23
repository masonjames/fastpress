import { FeatureBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { Icon } from '@/components/Icon'
import { CMSLink } from '@/components/Link'
import { PublicContextProps } from '@/utilities/publicContextProps'

/**
 * Feature 91 has exactly two USPs
 * @param param0
 * @returns
 */
const Feature91: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({
  USPs,
  publicContext,
}) => {
  if (!USPs || USPs.length !== 2) {
    return (
      <p className="text-red-500">You need to have exactly two USPs for Feature91 block to work</p>
    )
  }
  const [usp1, usp2] = USPs
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto grid max-w-screen-xl gap-y-6 lg:grid-cols-2">
          <div className="rounded-md border p-6 md:p-10 lg:rounded-l-md lg:rounded-r-none lg:border-y lg:border-l lg:border-r-0">
            {usp1.richText && (
              <RichText
                publicContext={publicContext}
                content={usp1.richText}
                overrideStyle={{
                  h2: 'mb-6 text-3xl font-semibold md:text-4xl',
                  p: 'mb-6 text-lg text-muted-foreground',
                  li: 'mb-6 text-lg text-muted-foreground',
                }}
              />
            )}
            <div className="flex flex-col gap-4">
              {usp1.links?.map((link) => (
                <CMSLink
                  publicContext={publicContext}
                  key={link.id}
                  {...link.link}
                  className="flex items-center gap-2 text-lg font-medium"
                  iconClassName="h-auto w-4"
                />
              ))}
            </div>
            <div className="mt-10">
              {usp1.USPFeatures?.map((feature) => (
                <div
                  key={feature.id}
                  className={`flex items-center gap-7 py-6 ${feature.id === usp1.USPFeatures?.[1]?.id ? 'border-y border-dashed border-primary' : ''}`}
                >
                  {feature.icon && <Icon className="h-auto w-8 shrink-0" icon={feature.icon} />}
                  {feature.richText && (
                    <RichText publicContext={publicContext} content={feature.richText} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="dark rounded-md border bg-background p-6 text-primary md:p-10 lg:rounded-l-none lg:rounded-r-md">
            {usp2.richText && (
              <RichText
                publicContext={publicContext}
                content={usp2.richText}
                overrideStyle={{
                  h2: 'mb-6 text-3xl font-semibold md:text-4xl',
                  p: 'mb-6 text-lg text-muted-foreground',
                  li: 'mb-6 text-lg text-muted-foreground',
                }}
              />
            )}
            <div className="flex flex-col gap-4">
              {usp2.links?.map((link) => (
                <CMSLink
                  publicContext={publicContext}
                  key={link.id}
                  {...link.link}
                  className="flex items-center gap-2 text-lg font-medium"
                  iconClassName="h-auto w-4"
                />
              ))}
            </div>
            <div className="mt-10">
              {usp2.USPFeatures?.map((feature) => (
                <div
                  key={feature.id}
                  className={`flex items-center gap-7 py-6 ${feature.id === usp2.USPFeatures?.[1]?.id ? 'border-y border-dashed border-primary' : ''}`}
                >
                  {feature.icon && <Icon className="h-auto w-8 shrink-0" icon={feature.icon} />}
                  {feature.richText && (
                    <RichText publicContext={publicContext} content={feature.richText} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Feature91
