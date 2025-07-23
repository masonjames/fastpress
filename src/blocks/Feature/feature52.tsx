import {
  Blocks,
  Fingerprint,
  LayoutPanelTop,
  MessageCircleMore,
  Users,
  Workflow,
} from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabs = [
  {
    title: 'Communication',
    image: '/images/block/placeholder-1.svg',
    icon: (
      <MessageCircleMore
        className="size-8 text-primary lg:size-10"
        strokeWidth={1.5}
      />
    ),
  },
  {
    title: 'Integrations',
    image: '/images/block/placeholder-2.svg',
    icon: (
      <Blocks className="size-8 text-primary lg:size-10" strokeWidth={1.5} />
    ),
  },
  {
    title: 'Collaboration',
    image: '/images/block/placeholder-3.svg',
    icon: (
      <Users className="size-8 text-primary lg:size-10" strokeWidth={1.5} />
    ),
  },
  {
    title: 'Automation',
    image: '/images/block/placeholder-4.svg',
    icon: (
      <Workflow className="size-8 text-primary lg:size-10" strokeWidth={1.5} />
    ),
  },
  {
    title: 'Customization',
    image: '/images/block/placeholder-5.svg',
    icon: (
      <LayoutPanelTop
        className="size-8 text-primary lg:size-10"
        strokeWidth={1.5}
      />
    ),
  },
  {
    title: 'Security',
    image: '/images/block/placeholder-6.svg',
    icon: (
      <Fingerprint
        className="size-8 text-primary lg:size-10"
        strokeWidth={1.5}
      />
    ),
  },
];

const Feature52 = () => {
  return (
    <section className="py-32">
      <div className="container max-w-5xl px-1">
        <Tabs defaultValue="feature-1">
          <TabsList className="mb-4 grid h-auto grid-cols-2 gap-2 bg-background sm:grid-cols-3 md:flex lg:mb-6">
            {tabs.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={`feature-${index + 1}`}
                className="flex size-full flex-col items-start justify-start gap-1 whitespace-normal rounded-md border border-transparent bg-muted p-3 text-left text-primary hover:border-primary/40 hover:ring-1 hover:ring-input data-[state=active]:border data-[state=active]:border-primary data-[state=active]:bg-background lg:p-4"
              >
                <div className="flex w-full flex-col items-center gap-4">
                  {tab.icon}
                  <p className="text-sm font-semibold lg:text-base">
                    {tab.title}
                  </p>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab, index) => (
            <TabsContent key={index} value={`feature-${index + 1}`}>
              <img
                src={tab.image}
                alt=""
                className="aspect-video rounded-md object-cover"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Feature52;
