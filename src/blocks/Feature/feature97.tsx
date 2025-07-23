import { BarChart, Heart, Monitor, Plus, TrendingUp } from 'lucide-react';

import { FeatureBlock } from '@/payload-types';
import RichText from '@/components/RichText';
import { CMSLink } from '@/components/Link';
import { Icon } from '@/components/Icon'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Feature97: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({ richText, image, links, icon, tagline, USPs, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-xl flex-col gap-6 text-center">
          {richText && <RichText publicContext={publicContext} content={richText} withWrapper={false} overrideStyle={{ h2: "text-4xl font-semibold", p: "text-lg" }} />}
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            {Array.isArray(links) && links.length > 0 && links.map(({ link }, i) => (
              <CMSLink publicContext={publicContext} key={i} {...link} size={'lg'} />
            ))}
          </div>
        </div>
        <div className="mx-auto mt-20 grid max-w-screen-lg gap-20 md:grid-cols-2">
          {USPs?.map(({ richText, uspIcon }, index) => (
            <div key={index} className="text-center">
              {uspIcon && <Icon icon={uspIcon} className="mx-auto h-auto w-7" />}
              {richText && (
                <RichText publicContext={publicContext}
                  content={richText}
                  withWrapper={false}
                  overrideStyle={{
                    h3: "mb-2 mt-4 text-xl font-semibold",
                    p: "text-muted-foreground"
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature97;
