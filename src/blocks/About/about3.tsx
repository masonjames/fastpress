import { CMSLink } from '@/components/Link';
import { Media } from '@/components/Media';
import RichText from '@/components/RichText';
import type { AboutBlock, Media as MediaType } from '@/payload-types';
import { PublicContextProps } from '@/utilities/publicContextProps'

const About3: React.FC<AboutBlock & { publicContext: PublicContextProps }> = ({ headline, text1, text2, text3, counter, images, link, logos, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:text-left">
          {headline && <RichText publicContext={publicContext}
            content={headline}
            withWrapper={false}
            overrideStyle={{
              h1: 'text-5xl font-semibold',
              h2: 'text-3xl font-semibold',
              h3: 'text-2xl font-semibold',
              p: 'text-xl font-medium text-muted-foreground',
            }}
          />}
        </div>
        <div className="grid gap-7 lg:grid-cols-3">
          {typeof images?.[0] === 'object' && <Media key={images[0].id} imgClassName="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2" resource={images[0]} />}
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="flex flex-col justify-between gap-6 rounded-xl bg-muted p-7 md:w-1/2 lg:w-auto">
              {typeof images?.[1] === 'object' && <Media key={images[1].id} imgClassName="mr-auto h-12" resource={images[1]} />}
              <div>
                {text1 && <RichText publicContext={publicContext}
                  content={text1}
                  withWrapper={false}
                  overrideStyle={{
                    h2: 'mb-2 text-2xl font-semibold',
                    h3: 'mb-2 text-xl font-semibold',
                    h4: 'mb-2 text-lg font-semibold',
                    p: 'text-muted-foreground',
                  }}
                />}
              </div>
              {link && <CMSLink publicContext={publicContext} className="mr-auto" {...link} />}
            </div>
            {typeof images?.[2] === 'object' && <Media key={images[2].id} imgClassName="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto" resource={images[2]} />}
          </div>
        </div>
        <div className="py-32">
          <p className="text-center">Valued by clients worldwide</p>
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            {Array.isArray(logos) && logos.map((logo: MediaType) => (
              <div key={logo.id} className="flex items-center gap-3">
                <Media key={logo.id} imgClassName="h-8 w-auto md:h-12" resource={logo} />
                {logo.caption && <RichText publicContext={publicContext}
                  content={logo.caption}
                  withWrapper={false}
                  overrideStyle={{
                    p: 'text-xl font-semibold md:text-2xl',
                  }}
                />}
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-muted p-10 md:p-16">
          <div className="flex flex-col gap-4 text-center md:text-left">
            {text2 && <RichText publicContext={publicContext}
              content={text2}
              withWrapper={false}
              overrideStyle={{
                h2: 'text-4xl font-semibold',
                h3: 'text-2xl font-semibold',
                h4: 'text-xl font-semibold',
                p: /*Tailwind*/ 'max-w-screen-sm text-muted-foreground',
              }}
            />}
          </div>
          <div className="mt-10 flex flex-wrap justify-between gap-10 text-center">
            {Array.isArray(counter) && counter.map((c) => (
              <div key={c.id} className="flex flex-col gap-4">
                <p>{c.title}</p>
                <span className="text-4xl font-semibold md:text-5xl">{c.value}</span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute -top-1 right-1 z-10 hidden size-full bg-[linear-gradient(to_right,hsl(from_var(--muted-foreground)_h_s_l)_1px,transparent_1px),linear-gradient(to_bottom,hsl(from_var(--muted-foreground)_h_s_l)_1px,transparent_1px)] bg-size-[80px_80px] opacity-15 mask-[linear-gradient(to_bottom_right,#000,transparent,transparent)] md:block"></div>
        </div>
      </div>
    </section>
  );
};

export default About3;
