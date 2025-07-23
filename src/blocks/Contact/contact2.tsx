import RichText from '@/components/RichText'
import { ContactBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { RenderBlocks } from '@/blocks/RenderBlocks'

const Contact2: React.FC<ContactBlock & { publicContext: PublicContextProps }> = ({
  richText,
  publicContext,
  form,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          <div className="mx-auto flex max-w-sm flex-col justify-between gap-10">
            <div className="text-center lg:text-left">
              {richText && (
                <RichText
                  publicContext={publicContext}
                  withWrapper={false}
                  content={richText}
                  overrideStyle={{
                    h1: 'mb-4 text-5xl font-semibold lg:mb-1 lg:text-6xl',
                    h2: 'mb-4 text-5xl font-semibold lg:mb-1 lg:text-6xl',
                    h3: 'mb-2 text-3xl font-semibold lg:mb-1 lg:text-4xl',
                    h4: 'mb-2 text-xl font-semibold lg:mb-1 lg:text-2xl',
                    p: 'text-muted-foreground',
                  }}
                />
              )}
            </div>
          </div>
          <div className="mx-auto flex max-w-screen-md flex-col gap-6 rounded-lg border p-10">
            {form && form[0].form && (
              <RenderBlocks blocks={form} publicContext={publicContext} disableContainer />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact2
