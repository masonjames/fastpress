'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const features = [
  {
    id: 'feature-1',
    title: 'Feature 1',
    description: 'Nam vitae molestie arcu. Quisque eu libero orci.',
    image: 'https://www.shadcnblocks.com/images/block/placeholder-1.svg',
    subfeatures: [
      {
        id: 'subfeature-1',
        title: 'Subfeature 1',
        description:
          'Pellentesque ac commodo sem. Maecenas efficitur dolor quis ex varius, ut volutpat lacus vulputate.',
      },
      {
        id: 'subfeature-2',
        title: 'Subfeature 2',
        description:
          'Curabitur tincidunt libero vitae odio ultricies, id cursus velit vehicula. Praesent accumsan, quam non fringilla efficitur.',
      },
      {
        id: 'subfeature-3',
        title: 'Subfeature 3',
        description:
          'Praesent placerat risus vel magna pharetra, vitae vestibulum leo sodales. Pellentesque habitant morbi tristique.',
      },
    ],
  },
  {
    id: 'feature-2',
    title: 'Feature 2',
    description: 'Nam vitae molestie arcu. Quisque eu libero orci.',
    image: 'https://www.shadcnblocks.com/images/block/placeholder-2.svg',
    subfeatures: [
      {
        id: 'subfeature-1',
        title: 'Subfeature 1',
        description:
          'Pellentesque ac commodo sem. Maecenas efficitur dolor quis ex varius, ut volutpat lacus vulputate.',
      },
      {
        id: 'subfeature-2',
        title: 'Subfeature 2',
        description:
          'Curabitur tincidunt libero vitae odio ultricies, id cursus velit vehicula. Praesent accumsan, quam non fringilla efficitur.',
      },
      {
        id: 'subfeature-3',
        title: 'Subfeature 3',
        description:
          'Praesent placerat risus vel magna pharetra, vitae vestibulum leo sodales. Pellentesque habitant morbi tristique.',
      },
    ],
  },
  {
    id: 'feature-3',
    title: 'Feature 3',
    description: 'Nam vitae molestie arcu. Quisque eu libero orci.',
    image: 'https://www.shadcnblocks.com/images/block/placeholder-3.svg',
    subfeatures: [
      {
        id: 'subfeature-1',
        title: 'Subfeature 1',
        description:
          'Pellentesque ac commodo sem. Maecenas efficitur dolor quis ex varius, ut volutpat lacus vulputate.',
      },
      {
        id: 'subfeature-2',
        title: 'Subfeature 2',
        description:
          'Curabitur tincidunt libero vitae odio ultricies, id cursus velit vehicula. Praesent accumsan, quam non fringilla efficitur.',
      },
      {
        id: 'subfeature-3',
        title: 'Subfeature 3',
        description:
          'Praesent placerat risus vel magna pharetra, vitae vestibulum leo sodales. Pellentesque habitant morbi tristique.',
      },
    ],
  },
  {
    id: 'feature-4',
    title: 'Feature 4',
    description: 'Nam vitae molestie arcu. Quisque eu libero orci.',
    image: 'https://www.shadcnblocks.com/images/block/placeholder-4.svg',
    subfeatures: [
      {
        id: 'subfeature-1',
        title: 'Subfeature 1',
        description:
          'Pellentesque ac commodo sem. Maecenas efficitur dolor quis ex varius, ut volutpat lacus vulputate.',
      },
      {
        id: 'subfeature-2',
        title: 'Subfeature 2',
        description:
          'Curabitur tincidunt libero vitae odio ultricies, id cursus velit vehicula. Praesent accumsan, quam non fringilla efficitur.',
      },
      {
        id: 'subfeature-3',
        title: 'Subfeature 3',
        description:
          'Praesent placerat risus vel magna pharetra, vitae vestibulum leo sodales. Pellentesque habitant morbi tristique.',
      },
    ],
  },
  {
    id: 'feature-5',
    title: 'Feature 5',
    description: 'Nam vitae molestie arcu. Quisque eu libero orci.',
    image: 'https://www.shadcnblocks.com/images/block/placeholder-5.svg',
    subfeatures: [
      {
        id: 'subfeature-1',
        title: 'Subfeature 1',
        description:
          'Pellentesque ac commodo sem. Maecenas efficitur dolor quis ex varius, ut volutpat lacus vulputate.',
      },
      {
        id: 'subfeature-2',
        title: 'Subfeature 2',
        description:
          'Curabitur tincidunt libero vitae odio ultricies, id cursus velit vehicula. Praesent accumsan, quam non fringilla efficitur.',
      },
      {
        id: 'subfeature-3',
        title: 'Subfeature 3',
        description:
          'Praesent placerat risus vel magna pharetra, vitae vestibulum leo sodales. Pellentesque habitant morbi tristique.',
      },
    ],
  },
];

const Feature54 = () => {
  const [selection, setSelection] = useState(features[0].id);
  return (
    <section className="py-32">
      <div className="flex flex-col items-center gap-16 lg:px-16">
        <div className="container flex flex-col items-center">
          <h3 className="mb-3 text-pretty text-center text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Feature group
          </h3>
        </div>
        <div className="w-full text-center">
          <Tabs value={selection} onValueChange={setSelection}>
            <div className="relative">
              <div className="overflow-auto">
                <div className="container mb-6 flex min-w-fit flex-col items-center lg:mb-8">
                  <TabsList>
                    {features.map((feature) => (
                      <TabsTrigger key={feature.id} value={feature.id}>
                        {feature.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(from_var(--background)_h_s_l)_0%,transparent_10%,transparent_90%,hsl(from_var(--background)_h_s_l)_100%)] md:hidden" />
              </div>
            </div>
            <div className="container w-full lg:max-w-5xl">
              {features.map((feature) => (
                <TabsContent key={feature.id} value={feature.id}>
                  <div className="">
                    <div className="aspect-[1.67] w-full rounded-lg border border-border bg-accent">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="size-full object-cover object-center"
                      />
                    </div>
                    <div className="hidden grid-cols-3 gap-6 py-6 md:grid">
                      {feature.subfeatures.map((subfeature) => (
                        <div
                          key={subfeature.id}
                          className="flex flex-col text-left"
                        >
                          <p className="mb-2 text-xs font-semibold">
                            {subfeature.title}
                          </p>
                          <p className="mb-8 text-xs text-muted-foreground">
                            {subfeature.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
            <div className="flex justify-center py-3 md:hidden">
              {features.map((feature) => (
                <Button
                  key={feature.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelection(feature.id);
                  }}
                >
                  <div
                    className={`size-2 rounded-full ${feature.id === selection ? 'bg-primary' : 'bg-input'}`}
                  />
                </Button>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Feature54;
