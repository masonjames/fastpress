import RichText from '../../components/RichText';
import type { LogosBlock, Media as MediaType } ;
import { Media } from '../../components/Media';
import { CMSLink } from '../../components/Link';
import { PublicContextProps } from '../../utilities/publicContextProps'

const Logos2: React.FC<LogosBlock & { publicContext: PublicContextProps }> = ({ richText, link, logos, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid overflow-hidden rounded-xl border border-border md:grid-cols-2">
          <div className="my-auto px-6 py-10 sm:px-10 sm:py-12 lg:p-16">
            <div className="w-full md:max-w-md">
              {richText && <RichText publicContext={publicContext}
                content={richText}
                withWrapper={false}
                overrideStyle={{
                  h2: 'mb-4 text-2xl font-semibold lg:text-3xl',
                  h3: 'mb-4 text-2xl font-semibold lg:text-2xl',
                  h4: 'mb-4 text-2xl font-semibold lg:text-xl',
                  p: 'mb-6 text-lg',
                }}
              />
              }
              {link && <CMSLink publicContext={publicContext} className="w-full md:w-fit" {...link} />}
            </div>
          </div>
          <div className="grid grid-cols-3 border-t border-border md:border-l md:border-t-0">
            {Array.isArray(logos) && logos.map((logo: MediaType) => (
              <div
                key={logo.id}
                className="-mb-px flex items-center justify-center border-b border-r border-border p-5 sm:p-6 nth-[3n]:border-r-0"
              >
                <Media imgClassName="size-12 object-contain object-center sm:size-16 lg:size-24" priority resource={logo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Logos2;
