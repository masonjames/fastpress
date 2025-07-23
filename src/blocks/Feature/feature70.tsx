'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { CarouselApi } from '@/components/ui/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { FeatureBlock } from '@/payload-types';
import RichText from '@/components/RichText';
import { splitRichText } from '@/utilities/richtext';
import { CMSLink } from '@/components/Link';
import { Media } from '@/components/Media';

import { PublicContextProps } from '@/utilities/publicContextProps'

const Feature70: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({ USPs, richText, publicContext }) => {
  const [selection, setSelection] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    carouselApi.scrollTo(selection);
  }, [carouselApi, selection]);
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setSelection(carouselApi.selectedScrollSnap());
    };
    carouselApi.on('select', updateSelection);
    return () => {
      carouselApi.off('select', updateSelection);
    };
  }, [carouselApi]);
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="aspect-5/6 text-clip rounded-3xl bg-accent">
            <Carousel
              setApi={setCarouselApi}
              className="size-full [&>div]:h-full"
            >
              <CarouselContent className="mx-0 size-full">
                {USPs && USPs?.map((usp) => {
                  if (!usp.image) {
                    return (
                      <CarouselItem key={usp.id} className="px-0 text-red-500">
                        USPs need to have a image set.
                      </CarouselItem>
                    )
                  }
                  return (
                    <CarouselItem key={usp.id} className="px-0">
                      <Media resource={usp.image} imgClassName="rounded-3xl size-full object-cover object-center" className="size-full rounded-3xl" />
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="flex shrink-0 flex-col md:w-1/2 md:pr-8 lg:pl-24 lg:text-left 2xl:pl-32">
            {richText && (
              <RichText publicContext={publicContext}
                withWrapper={false}
                content={richText}
                overrideStyle={{
                  h1: 'mb-6 text-pretty text-3xl font-bold lg:text-5xl',
                  h2: 'mb-6 text-pretty text-3xl font-bold lg:text-5xl',
                  h3: 'mb-6 text-pretty text-2xl font-bold lg:text-4xl',
                  h4: 'mb-6 text-pretty text-xl font-bold lg:text-3xl',
                  p: 'mb-16 text-muted-foreground lg:text-xl',
                }}
              />
            )}
            <ul className="space-y-2">
              {USPs && USPs?.map((usp, i) => {
                if (!usp.richText) {
                  return <div key={usp.id} className="text-red-500">USPs need to have richText set</div>;
                }
                const { firstNode, rest } = splitRichText(usp.richText, {
                  splitOn: ['h2', 'h3', 'h4'],
                  takeFirst: true
                });
                if (!firstNode || !rest) {
                  return <div key={usp.id} className="text-red-500">USPs need to have richText with a heading and text set</div>;
                }
                return (
                  <li
                    key={usp.id}
                    className="group relative w-full cursor-pointer px-6 py-3 transition data-open:bg-accent"
                    data-open={selection === i ? 'true' : undefined}
                    onClick={() => setSelection(i)}
                  >
                    <div className="flex items-center justify-between gap-x-2">
                      <div className="text-sm font-semibold text-accent-foreground">
                        {firstNode.root.children?.[0]?.children?.[0]?.text}
                      </div>
                      <div className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground group-data-open:bg-primary group-data-open:text-primary-foreground">
                        <ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-data-open:rotate-180" />
                      </div>
                    </div>
                    <div className="hidden text-sm font-medium group-data-open:block">
                      <RichText publicContext={publicContext}
                        withWrapper={false}
                        content={rest}
                        overrideStyle={{
                          p: "my-4 text-muted-foreground lg:my-6"
                        }}
                      />
                      {usp.links?.map((link) => (
                        <CMSLink
                          publicContext={publicContext}
                          key={link.id}
                          {...link.link}
                          className="group/link flex items-center pb-3 text-sm text-accent-foreground"
                          iconClassName="ml-2 size-4 transition-transform group-hover/link:translate-x-1"
                        />
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature70;
