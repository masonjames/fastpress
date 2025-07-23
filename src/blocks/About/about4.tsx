import { CMSLink } from '@/components/Link';
import { Media } from '@/components/Media';
import RichText from '@/components/RichText';
import type { AboutBlock, Media as MediaType } from '@/payload-types';
import { PublicContextProps } from '@/utilities/publicContextProps'

const About4: React.FC<AboutBlock & { publicContext: PublicContextProps }> = ({ headline, text1, text2, text3, counter, images, link, logos, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-screen-md flex-col gap-8 pb-28 text-center">
          {headline && <RichText publicContext={publicContext}
            content={headline}
            withWrapper={false}
            overrideStyle={{
              h1: 'text-4xl font-semibold md:text-7xl',
              h2: 'text-4xl font-semibold md:text-5xl',
              h3: 'text-4xl font-semibold md:text-3xl',
              p: 'text-xl font-medium text-muted-foreground',
            }}
          />}
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(images) && images.map((image: MediaType) => (
            <Media key={image.id} imgClassName="max-h-80 w-full object-cover" resource={image} />
          ))}
        </div>
        <div className="mx-auto grid max-w-screen-lg gap-28 py-28 md:grid-cols-2">
          <div>
            {text1 && <RichText publicContext={publicContext}
              content={text1}
              withWrapper={false}
              overrideStyle={{
                h2: 'mb-5 text-4xl font-semibold',
                h3: 'mb-5 text-2xl font-semibold',
                h4: 'mb-5 text-xl font-semibold',
                p: 'text-xl font-medium leading-8 text-muted-foreground',
              }}
            />}
          </div>
          <div>
            {text2 && <RichText publicContext={publicContext}
              content={text2}
              withWrapper={false}
              overrideStyle={{
                h2: 'mb-5 text-4xl font-semibold',
                h3: 'mb-5 text-2xl font-semibold',
                h4: 'mb-5 text-xl font-semibold',
                p: 'text-xl font-medium leading-8 text-muted-foreground',
              }}
            />}
          </div>
        </div>
        <div className="mx-auto flex max-w-screen-lg flex-col items-center justify-between gap-8 rounded-2xl bg-muted/50 p-14 text-center md:flex-row md:text-left">
          {text3 && <RichText publicContext={publicContext}
            content={text3}
            withWrapper={false}
            overrideStyle={{
              h3: 'text-3xl font-semibold',
              h4: 'text-2xl font-semibold',
              p: 'text-xl font-medium leading-8 text-muted-foreground',
            }}
          />}
          {link && <CMSLink publicContext={publicContext} className="w-full md:w-fit" {...link} />}
        </div>
      </div>
    </section>
  );
};

export default About4;
