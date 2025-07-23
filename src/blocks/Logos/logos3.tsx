// This template requires the Embla Auto Scroll plugin to be installed:
//
// npm install embla-carousel-auto-scroll

'use client';

import AutoScroll from 'embla-carousel-auto-scroll';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import type { LogosBlock, Media as MediaType } from '@/payload-types';
import RichText from '@/components/RichText';
import { Media } from '@/components/Media';
import { PublicContextProps } from '@/utilities/publicContextProps';

const Logos3: React.FC<LogosBlock & { publicContext: PublicContextProps }> = ({ richText, logos, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container flex flex-col items-center text-center">
        {richText && <RichText publicContext={publicContext}
          content={richText}
          withWrapper={false}
          overrideStyle={{
            h2: 'my-6 text-pretty text-2xl font-bold lg:text-4xl',
            h3: 'my-6 text-pretty text-2xl font-bold lg:text-3xl',
            h4: 'my-6 text-pretty text-2xl font-bold lg:text-2xl',
            p: 'mb-6 text-lg',
          }}
        />
        }
      </div>
      <div className="pt-10 md:pt-16 lg:pt-20">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ playOnInit: true })]}
          >
            <CarouselContent className="ml-0">
              {logos?.map((logo: MediaType) => (
                <CarouselItem
                  key={logo.id}
                  className="basis-1/3 pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="mx-10 flex shrink-0 items-center justify-center">
                    <Media imgClassName="h-7 w-auto object-contain" priority resource={logo} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-12 bg-linear-to-r from-background to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-linear-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Logos3;
