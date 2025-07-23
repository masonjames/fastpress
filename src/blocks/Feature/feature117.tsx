import { Icon } from '../../components/Icon'
import { Media } from '../../components/Media'
import RichText from '../../components/RichText'
import { FeatureBlock } 
import { ChevronRight, Zap } from 'lucide-react'
import { PublicContextProps } from '../../utilities/publicContextProps';

const Feature117: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({ richText, USPs, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        {richText && (
          <RichText publicContext={publicContext}
            withWrapper={false}
            overrideStyle={{
              h1: 'mb-4 text-center text-4xl font-semibold',
              h2: 'mb-4 text-center text-3xl font-semibold',
              p: 'text-center text-muted-foreground',
            }}
            content={richText}
          />
        )}
        <div className="grid gap-5 pt-14 xl:grid-cols-3">
          {USPs?.map(({ richText, image, uspIcon, link, tagline }, index) => (
            <a
              href={link?.url || '#'}
              className="group relative overflow-hidden rounded-xl"
              key={index}
            >
              {image && (
                <Media
                  resource={image}
                  className="h-full max-h-[450px] w-full rounded-xl object-cover object-center"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 top-0 translate-y-20 rounded-xl bg-linear-to-t from-primary to-transparent transition-transform duration-300 group-hover:translate-y-0"></div>
              <div className="absolute top-0 flex h-full w-full flex-col justify-between p-7">
                <span className="ml-auto flex w-fit items-center gap-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-background">
                  {uspIcon && <Icon icon={uspIcon} className="h-auto w-6 fill-background" />}
                  {tagline}
                </span>
                <div className="flex flex-col gap-5 text-background">
                  {richText && (
                    <RichText publicContext={publicContext}
                      withWrapper={false}
                      overrideStyle={{
                        h4: 'text-2xl font-semibold lg:text-3xl',
                        p: 'flex items-center gap-1 font-medium',
                      }}
                      content={richText}
                    />
                  )}
                  <p className="flex items-center gap-1 font-medium">
                    {link?.label}
                    <ChevronRight className="h-auto w-4" />
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Feature117
