import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { CtaBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const CTA10: React.FC<CtaBlock & { publicContext: PublicContextProps }> = ({ richText, links, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex w-full flex-col gap-16 overflow-hidden rounded-lg bg-accent p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-16">
          <div className="flex-1">
            {richText && (
              <RichText publicContext={publicContext}
                content={richText}
                withWrapper={false}
                overrideStyle={{
                  h3: 'mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6',
                  p: 'text-muted-foreground lg:text-lg',
                }}
              />
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {Array.isArray(links) && links.length > 0 && (
              <>
                {links.map(({ link }, i) => {
                  return <CMSLink publicContext={publicContext} className="w-full sm:w-auto" key={i} {...link} />
                })}
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA10
