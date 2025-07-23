import { Bolt, Cloud, MessagesSquare, Star } from 'lucide-react';

const features = [
  {
    id: 'feature-1',
    title: 'Feature 1',
    description:
      'Nam vitae molestie arcu. Quisque eu libero orci. Aliquam imperdiet magna nec massa consectetur, id interdum ante congue.',
    icon: Cloud,
  },
  {
    id: 'feature-2',
    title: 'Feature 2',
    description:
      'Nam vitae molestie arcu. Quisque eu libero orci. Aliquam imperdiet magna nec massa consectetur.',
    icon: Star,
  },
  {
    id: 'feature-3',
    title: 'Feature 3',
    description:
      'Nam vitae molestie arcu. Aliquam imperdiet magna nec massa consectetur.',
    icon: Bolt,
  },
  {
    id: 'feature-4',
    title: 'Feature 4',
    description:
      'Nam vitae molestie arcu. Quisque eu libero orci. Aliquam imperdiet magna nec massa consectetur, id interdum ante congue.',
    icon: MessagesSquare,
  },
];

const Feature76 = () => {
  return (
    <section className="relative pt-32">
      <div className="container relative z-10 flex flex-col space-y-14">
        <h2 className="px-6 text-2xl font-semibold md:mb-4 md:text-5xl lg:mb-6 lg:max-w-md lg:px-10">
          Feature name
        </h2>
        <div className="relative mt-6 md:mt-10">
          <div className="absolute top-0 -mx-[calc(theme(container.padding))] h-px w-screen bg-border 2xl:-mx-[calc((100vw-100%)/2)]" />
          <div className="grid divide-border md:grid-cols-4 md:divide-x">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="relative px-6 pb-20 md:pb-10 lg:px-10"
              >
                <div className="absolute top-0 -mx-[calc(24px+theme(container.padding))] h-px w-screen bg-border md:hidden" />
                <div className="relative -mt-6 mb-10 flex aspect-square w-12 items-center justify-center bg-white md:-mt-10 md:mb-10 md:w-20">
                  <feature.icon className="size-10" />
                </div>
                <div>
                  <h3 className="mb-3 max-w-48 text-lg font-semibold md:mb-4 md:text-2xl lg:mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground lg:text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 -mx-[calc(theme(container.padding))] h-px w-screen bg-border 2xl:-mx-[calc((100vw-100%)/2)]" />
        </div>
      </div>
      <div className="container absolute inset-0 hidden h-full md:block">
        <div className="relative h-full">
          <div className="absolute inset-y-0 left-0 h-full w-px bg-border"></div>
          <div className="absolute inset-y-0 right-0 h-full w-px bg-border"></div>
        </div>
      </div>
    </section>
  );
};

export default Feature76;
