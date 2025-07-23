'use client';

import { useEffect, useState } from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import type { CarouselApi } from '@/components/ui/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { cn } from '@/utilities/cn';
import { TestimonialBlock } from '@/payload-types';
import RichText from '@/components/RichText';
import { PublicContextProps } from '@/utilities/publicContextProps';

const Testimonial17: React.FC<TestimonialBlock & { publicContext: PublicContextProps }> = ({ headline, link, tagline, testimonial, publicContext }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col gap-14 lg:grid lg:grid-cols-3 lg:gap-0">
          {headline && <RichText publicContext={publicContext}
            content={headline}
            withWrapper={false}
            overrideStyle={{
              h2: 'text-center text-3xl font-bold lg:text-left lg:text-4xl',
              h3: 'text-center text-2xl font-bold lg:text-left lg:text-3xl',
              h4: 'text-center text-xl font-bold lg:text-left lg:text-2xl',
              p: 'text-muted-foreground lg:text-lg'
            }}
          />}
          <Carousel setApi={setApi} className="w-full lg:hidden">
            <CarouselContent>
              <CarouselItem>
                <div className="select-none rounded-2xl border p-8">
                  <img
                    src="https://www.shadcnblocks.com/images/block/logos/shadcn-ui.svg"
                    alt="logo"
                    className="mb-6 h-6 lg:h-8"
                  />
                  <p className="mb-10 text-xl font-semibold">
                    Our team has seen an incredible boost in productivity since
                    adopting this platform. It&apos;s a game-changer.
                  </p>
                  <div className="mb-3 flex gap-4">
                    <Avatar className="size-12 rounded-full ring-1 ring-input">
                      <AvatarImage
                        src="https://www.shadcnblocks.com/images/block/avatar-1.webp"
                        alt="avatar"
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium">Sarah Williams</p>
                      <p className="text-muted-foreground">
                        Head of Product, @company
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="select-none rounded-2xl border p-8">
                  <img
                    src="https://www.shadcnblocks.com/images/block/logos/nextjs.svg"
                    alt="logo"
                    className="mb-6 h-8 lg:h-10"
                  />
                  <p className="mb-10 text-xl font-semibold">
                    This tool has streamlined our development process and
                    improved team collaboration like never before.
                  </p>
                  <div className="mb-3 flex gap-4">
                    <Avatar className="size-12 rounded-full ring-1 ring-input">
                      <AvatarImage
                        src="https://www.shadcnblocks.com/images/block/avatar-2.webp"
                        alt="avatar"
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium">David Parker</p>
                      <p className="text-muted-foreground">CTO, @company</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="select-none rounded-2xl border p-8">
                  <img
                    src="https://www.shadcnblocks.com/images/block/logos/tailwind.svg"
                    alt="logo"
                    className="mb-6 h-4 lg:h-5"
                  />
                  <p className="mb-10 text-xl font-semibold">
                    We have reduced our development cycles by 33.2% thanks to
                    the efficiency this platform brings to us.
                  </p>
                  <div className="mb-3 flex gap-4">
                    <Avatar className="size-12 rounded-full ring-1 ring-input">
                      <AvatarImage
                        src="https://www.shadcnblocks.com/images/block/avatar-3.webp"
                        alt="avatar"
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium">Maria Gonzalez</p>
                      <p className="text-muted-foreground">
                        Lead Developer, @company
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="mt-8 flex justify-center">
              {Array.from({ length: count }).map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    'mx-2 inline-block size-3 cursor-pointer rounded-full border-2',
                    index + 1 === current && 'border-primary bg-primary',
                  )}
                  onClick={() => api && api.scrollTo(index)}
                />
              ))}
            </div>
          </Carousel>
          <div className="col-span-2 hidden grid-cols-2 items-center gap-6 lg:grid">
            <div className="rounded-2xl border p-8">
              <img
                src="https://www.shadcnblocks.com/images/block/logos/shadcn-ui.svg"
                alt="logo"
                className="mb-6 h-6 sm:h-8"
              />
              <p className="mb-10 text-xl font-semibold">
                Our team has seen an incredible boost in productivity since
                adopting this platform. It&apos;s a game-changer for us!
              </p>
              <div className="mb-3 flex gap-4">
                <Avatar className="size-12 rounded-full ring-1 ring-input">
                  <AvatarImage
                    src="https://www.shadcnblocks.com/images/block/avatar-1.webp"
                    alt="avatar"
                  />
                </Avatar>
                <div>
                  <p className="font-medium">Sarah Williams</p>
                  <p className="text-muted-foreground">
                    Head of Product, @company
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border p-8">
                <img
                  src="https://www.shadcnblocks.com/images/block/logos/nextjs.svg"
                  alt="logo"
                  className="mb-6 h-8 sm:h-10"
                />
                <p className="mb-10 text-xl font-semibold">
                  This tool has streamlined our development process and improved
                  team collaboration like never before.
                </p>
                <div className="mb-3 flex gap-4">
                  <Avatar className="size-12 rounded-full ring-1 ring-input">
                    <AvatarImage
                      src="https://www.shadcnblocks.com/images/block/avatar-2.webp"
                      alt="avatar"
                    />
                  </Avatar>
                  <div>
                    <p className="font-medium">David Parker</p>
                    <p className="text-muted-foreground">CTO, @company</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border p-8">
                <img
                  src="https://www.shadcnblocks.com/images/block/logos/tailwind.svg"
                  alt="logo"
                  className="mb-6 h-4 sm:h-5"
                />
                <p className="mb-10 text-xl font-semibold">
                  We’ve reduced our development cycles by 30% thanks to the
                  efficiency this platform brings.
                </p>
                <div className="mb-3 flex gap-4">
                  <Avatar className="size-12 rounded-full ring-1 ring-input">
                    <AvatarImage
                      src="https://www.shadcnblocks.com/images/block/avatar-3.webp"
                      alt="avatar"
                    />
                  </Avatar>
                  <div>
                    <p className="font-medium">Maria Gonzalez</p>
                    <p className="text-muted-foreground">
                      Lead Developer, @company
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial17;
