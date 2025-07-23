import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CtaBlock } from '@/payload-types';
import { Icon } from '@/components/Icon';
import RichText from '@/components/RichText';
import { splitRichText } from '@/utilities/richtext';
import { Media } from '@/components/Media';
import { PublicContextProps } from '@/utilities/publicContextProps';

const Cta1: React.FC<CtaBlock & { publicContext: PublicContextProps }> = ({ icon, richText, image, publicContext }) => {
  const { firstNode, rest } = splitRichText(richText, {
    splitOn: ['h2', 'h3', 'h4'],
    takeFirst: true
  });

  return (
    <section className="py-32">
      <div className="container max-w-5xl">
        <Card className="flex flex-col justify-between md:flex-row">
          <div className="p-6 md:max-w-96">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-muted">
                {icon && <Icon icon={icon} className="size-4" strokeWidth={1.5} />}
              </span>
              {firstNode && (
                <div className="[&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-2xl [&_h3]:font-bold [&_h4]:text-2xl [&_h4]:font-bold">
                  <RichText publicContext={publicContext} content={firstNode} withWrapper={false} />
                </div>
              )}
            </div>
            {rest && (
              <div className="[&_p]:text-muted-foreground">
                <RichText publicContext={publicContext} content={rest} withWrapper={false} />
              </div>
            )}
            <Button className="mt-8">
              Get Started <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          {image && (
            <Media
              resource={image}
              htmlElement={null}
              className="aspect-video object-cover md:max-w-96"
              imgClassName="aspect-video object-cover md:max-w-96"
            />
          )}
        </Card>
      </div>
    </section>
  );
};

export default Cta1;
