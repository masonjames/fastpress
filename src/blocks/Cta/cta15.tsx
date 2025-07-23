import { Play } from 'lucide-react';

import { Button } from '@/components/ui/button';

const Cta15 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-20 rounded-2xl border bg-[radial-gradient(ellipse_30%_60%_at_100%_50%,hsla(var(--primary)/20%),#ffffff00)] pt-20 sm:pl-16 lg:flex-row lg:bg-[radial-gradient(ellipse_50%_50%_at_50%_120%,hsla(var(--primary)/20%),#ffffff00)] lg:pl-20">
          <div className="lg:texlf mx-auto max-w-md px-4 text-center md:px-0 lg:mx-0 lg:pb-20 lg:text-left">
            <p className="mb-6 font-medium">Ready to get started?</p>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              Start your free trial today.
            </h2>
            <p className="text-lg text-muted-foreground">
              Start with a 14-day free trial. No credit card required. No setup
              fees. Cancel anytime.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button>Get Started</Button>
              <Button variant="outline">
                <Play className="mr-1 h-full w-4" />
                Watch demo
              </Button>
            </div>
          </div>
          <div className="w-full pl-4 sm:pl-0">
            <img
              src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
              alt="placeholder"
              className="size-full max-h-[400px] rounded-br-2xl rounded-tl-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta15;
