import { ChevronRight, LayoutTemplate } from 'lucide-react';

import { Separator } from '@/components/ui/separator';

const Feature24 = () => {
  return (
    <section className="mb-32 border-b pt-32">
      <div className="container max-w-7xl">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <LayoutTemplate className="size-5" />
            <p>UI Components</p>
          </div>
          <a href="#" className="hover:text-primary hover:underline">
            Learn more
            <ChevronRight className="ml-2 inline-block size-4" />
          </a>
        </div>
        <Separator className="mb-8 mt-3" />
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <h2 className="text-3xl font-medium md:w-1/2">
            Use our UI components to build your website faster
          </h2>
          <p className="leading-7 text-muted-foreground md:w-1/2">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae
            praesent, ad ullam quis cupiditate atque maxime alias eaque
            repellendus perferendis, nemo repudiandae.
          </p>
        </div>
        <img
          src="https://www.shadcnblocks.com/images/block/placeholder.svg"
          alt="placeholder"
          className="mt-20 max-h-96 w-full rounded-t-lg object-cover"
        />
      </div>
    </section>
  );
};

export default Feature24;
