import { Button } from '@/components/ui/button'
import RichText from '@/components/RichText'
import { FeatureBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { Icon } from '@/components/Icon'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Feature1: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({ richText, image, links, icon, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent">
              {icon && <Icon icon={icon} className="size-6" />}
            </span>
            {richText && (
              <RichText publicContext={publicContext}
                withWrapper={false}
                overrideStyle={{
                  h1: 'my-6 text-pretty text-3xl font-bold lg:text-4xl',
                  p: 'mb-8 max-w-xl text-muted-foreground lg:text-lg',
                }}
                content={richText}
              />
            )}

            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {Array.isArray(links) && links.length > 0 && (
                <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                  {links.map(({ link }, i) => {
                    return <CMSLink publicContext={publicContext} className="w-full sm:w-auto" key={i} {...link} size={'lg'} />
                  })}
                </div>
              )}
            </div>
          </div>
          {image && <Media resource={image} className="max-h-96 w-full rounded-md object-cover" />}
        </div>
      </div>
    </section>
  )
}

export default Feature1
