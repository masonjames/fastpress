import { ChevronRight, SquareDashedMousePointer } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const utilities = [
  {
    title: 'Integrations',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    image: '/images/block/placeholder-1.svg',
  },
  {
    title: 'Apps',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    image: '/images/block/placeholder-2.svg',
  },
  {
    title: 'APIs',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    image: '/images/block/placeholder-3.svg',
  },
  {
    title: 'Plugins',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    image: '/images/block/placeholder-4.svg',
  },
  {
    title: 'Extensions',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    image: '/images/block/placeholder-5.svg',
  },
  {
    title: 'Widgets',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    image: '/images/block/placeholder-6.svg',
  },
];

const Feature20 = () => {
  return (
    <section className="py-32">
      <div className="container max-w-7xl">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1  text-muted-foreground">
            <SquareDashedMousePointer className="size-5" />
            <p>Utilities</p>
          </div>
          <a href="#" className="hover:text-primary hover:underline">
            Learn more
            <ChevronRight className="ml-2 inline-block size-4" />
          </a>
        </div>
        <Separator className="mb-8 mt-3" />
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <h2 className="text-3xl font-medium md:w-1/2">
            What you can do with our utilities?
          </h2>
          <p className="md:w-1/2">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae
            praesent, ad ullam quis cupiditate atque maxime alias eaque
            repellendus perferendis, nemo repudiandae.
          </p>
        </div>
        <div className="mt-11 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {utilities.map((utility, index) => (
            <Card key={index}>
              <img
                src={utility.image}
                alt={utility.title}
                className="aspect-video w-full object-cover"
              />
              <div className="p-5">
                <p className="mb-1 font-medium">{utility.title}</p>
                <p className="text-muted-foreground">{utility.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature20;
