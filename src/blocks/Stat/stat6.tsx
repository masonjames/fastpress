import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

const Stat6 = () => {
  return (
    <section className="bg-accent py-32">
      <div className="container flex flex-col items-start text-left">
        <div className="mb-12 w-full md:mb-16">
          <h2 className="mb-8 w-full max-w-[24rem] text-pretty text-3xl font-bold sm:text-4xl md:max-w-120 lg:max-w-148 lg:text-5xl">
            Here are some stats to look at
          </h2>
          <div className="flex flex-col justify-start gap-2 sm:flex-row">
            <Button className="w-full sm:w-auto">
              <ArrowRight className="mr-2 size-4" />
              Primary
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Secondary
            </Button>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-12 sm:w-fit sm:grid-cols-4 lg:gap-16">
          <div className="w-full">
            <div className="mb-2 text-4xl font-semibold sm:text-4xl lg:text-5xl">
              90%
            </div>
            <div className="text-base leading-6 text-muted-foreground lg:text-lg">
              Metric 1
            </div>
          </div>
          <div className="w-full">
            <div className="mb-2 text-4xl font-semibold sm:text-4xl lg:text-5xl">
              200+
            </div>
            <div className="text-base leading-6 text-muted-foreground lg:text-lg">
              Metric 2
            </div>
          </div>
          <div className="w-full">
            <div className="mb-2 text-4xl font-semibold sm:text-4xl lg:text-5xl">
              99%
            </div>
            <div className="text-base leading-6 text-muted-foreground lg:text-lg">
              Metric 3
            </div>
          </div>
          <div className="w-full">
            <div className="mb-2 text-4xl font-semibold sm:text-4xl lg:text-5xl">
              150+
            </div>
            <div className="text-base leading-6 text-muted-foreground lg:text-lg">
              Metric 4
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stat6;
