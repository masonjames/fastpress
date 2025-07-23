import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const slides = [
  {
    id: 1,
    tabName: 'Product',
    title: 'Ready to use blocks',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit, voluptatibus.',
    features: ['Integrations', 'Components', 'Blocks', 'Templates'],
    link: '#',
    image: '/images/block/placeholder-1.svg',
  },
  {
    id: 2,
    tabName: 'Services',
    title: 'Customize and build',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit, voluptatibus.',
    features: ['A block for everything', 'Easy to use', 'Ready to use'],
    link: '#',
    image: '/images/block/placeholder-2.svg',
  },
  {
    id: 3,
    tabName: 'Company',
    title: 'Easy to use',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit, voluptatibus.',
    features: ['Highly customizable', 'Zero configuration', 'Modern design'],
    link: '#',
    image: '/images/block/placeholder-3.svg',
  },
  {
    id: 4,
    tabName: 'Portfolio',
    title: 'Ready to use blocks',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit, voluptatibus.',
    features: ['Just add your content', 'Easy to customize', 'One click away'],
    link: '#',
    image: '/images/block/placeholder-4.svg',
  },
  {
    id: 5,
    tabName: 'Blog',
    title: 'Customize and build',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit, voluptatibus.',
    features: ['Variety of options', 'Keep it simple', 'Get creative'],
    link: '#',
    image: '/images/block/placeholder-5.svg',
  },
];

const Feature19 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-screen-md flex-col items-center gap-6">
          <h2 className="mb-4 text-center text-3xl font-semibold lg:text-5xl">
            This is where your feature goes
          </h2>
          <p className="text-balance text-center text-muted-foreground lg:text-2xl">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae aut
            doloribus voluptatum distinctio! Eum
          </p>
        </div>
        <div className="mt-24">
          <Tabs
            defaultValue="1"
            className="mx-auto flex w-fit flex-col items-center gap-8 md:gap-12"
          >
            <TabsList className="flex h-auto flex-wrap gap-x-2 p-2">
              {slides.map((slide) => (
                <TabsTrigger
                  key={slide.id}
                  value={slide.id.toString()}
                  className="text-sm hover:bg-white md:text-base"
                >
                  {slide.tabName}
                </TabsTrigger>
              ))}
            </TabsList>
            {slides.map((slide) => (
              <TabsContent
                value={slide.id.toString()}
                key={slide.id}
                className="max-w-screen-lg"
              >
                <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
                  <div>
                    <h2 className="mb-4 text-2xl font-semibold md:text-4xl">
                      {slide.title}
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      {slide.description}
                    </p>
                    <ul className="mt-8 grid grid-cols-1 gap-2 lg:grid-cols-2">
                      {slide.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={slide.link}
                      className="mt-8 flex items-center gap-2 font-medium hover:underline"
                    >
                      Learn more
                      <ArrowRight className="w-4" />
                    </a>
                  </div>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="order-first max-h-[400px] w-full rounded-lg object-cover md:order-last"
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Feature19;
