import { ArrowUp } from 'lucide-react';

import { Card } from '@/components/ui/card';

const Stat2 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <h1 className="text-center text-4xl font-semibold lg:text-6xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </h1>
        <div className="grid gap-6 pt-9 text-center md:grid-cols-3 lg:pt-20">
          <Card className="border-none bg-accent p-8 lg:p-10">
            <p className="mb-1 flex items-center justify-center text-2xl font-semibold lg:text-3xl">
              <ArrowUp className="mr-1 h-8" />
              20,000
            </p>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </Card>
          <Card className="border-none bg-accent p-8 lg:p-10">
            <p className="mb-1 flex items-center justify-center text-2xl font-semibold lg:text-3xl">
              <ArrowUp className="mr-1 h-8" />
              20+
            </p>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </Card>
          <Card className="border-none bg-accent p-8 lg:p-10">
            <p className="mb-1 flex items-center justify-center text-2xl font-semibold lg:text-3xl">
              <ArrowUp className="mr-1 h-8" />
              50%
            </p>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </Card>
          <Card className="border-none bg-accent p-8 lg:p-10">
            <p className="mb-1 flex items-center justify-center text-2xl font-semibold lg:text-3xl">
              <ArrowUp className="mr-1 h-8" />
              100+
            </p>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </Card>
          <Card className="border-none bg-accent p-8 lg:p-10">
            <p className="mb-1 flex items-center justify-center text-2xl font-semibold lg:text-3xl">
              <ArrowUp className="mr-1 h-8" />
              100%
            </p>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </Card>
          <Card className="border-none bg-accent p-8 lg:p-10">
            <p className="mb-1 flex items-center justify-center text-2xl font-semibold lg:text-3xl">
              <ArrowUp className="mr-1 h-8" />
              Forever
            </p>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Stat2;
