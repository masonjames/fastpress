import { ArrowRight } from 'lucide-react';

const Feature77 = () => {
  return (
    <section className="relative">
      <div className="container relative flex flex-col items-center">
        <div className="absolute top-0 -mx-[calc(24px+theme(container.padding))] h-px w-screen bg-border" />
        <div className="relative py-24 text-center lg:py-32">
          <p className="mb-6 text-xs font-medium uppercase tracking-wider">
            Tag Line
          </p>
          <h3 className="text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Feature group
          </h3>
        </div>
      </div>
      <div className="container relative">
        <div className="grid md:grid-cols-2 md:divide-x md:divide-border">
          <a
            href="#"
            className="group relative flex flex-col items-center border-border py-8 text-center transition-all duration-200 md:border-t md:px-8 md:py-12 lg:px-12 lg:pb-20 lg:pt-16"
          >
            <div className="absolute top-0 h-px w-full bg-border md:hidden" />
            <div className="mb-8 flex aspect-square w-16 items-center justify-center md:w-25 lg:mb-13">
              <img
                src="https://www.shadcnblocks.com/images/block/block-2.svg"
                alt="Product"
                className="size-full object-contain object-center"
              />
            </div>
            <h3 className="mb-4 text-lg font-semibold md:mb-5">Product</h3>
            <p className="mb-auto text-sm text-muted-foreground">
              Maecenas egestas leo nec risus viverra accumsan. Interdum et
              malesuada fames ac ante ipsum primis in faucibus. Donec ultricies,
              nisi non elementum convallis, lacus justo eleifend dolor, nec
              imperdiet nisi sem vel nisi.
            </p>
            <div className="mt-4 flex items-center md:mt-6">
              <span>See more</span>
              <ArrowRight className="ml-2 size-5 transition-all group-hover:translate-x-1" />
            </div>
          </a>
          <a
            href="#"
            className="group relative flex flex-col items-center border-border py-8 text-center transition-all duration-200 md:border-t md:px-8 md:py-12 lg:px-12 lg:pb-20 lg:pt-16"
          >
            <div className="absolute top-0 h-px w-full bg-border md:hidden" />
            <div className="mb-8 flex aspect-square w-16 items-center justify-center md:w-25 lg:mb-13">
              <img
                src="https://www.shadcnblocks.com/images/block/block-3.svg"
                alt="Product"
                className="size-full object-contain object-center"
              />
            </div>
            <h3 className="mb-4 text-lg font-semibold md:mb-5">Product</h3>
            <p className="mb-auto text-sm text-muted-foreground">
              Maecenas egestas leo nec risus viverra accumsan. Interdum et
              malesuada fames ac ante ipsum primis in faucibus. Donec ultricies,
              nisi non elementum convallis, lacus justo eleifend dolor, nec
              imperdiet nisi sem vel nisi.
            </p>
            <div className="mt-4 flex items-center md:mt-6">
              <span>See more</span>
              <ArrowRight className="ml-2 size-5 transition-all group-hover:translate-x-1" />
            </div>
          </a>
        </div>
        <div className="absolute left-[calc(theme(container.padding)-25px)] top-[-1.7rem] z-10 bg-background px-5 py-6">
          <div className="size-[.75rem] rounded-full bg-primary"></div>
        </div>
        <div className="absolute right-[calc(theme(container.padding)-25px)] top-[-1.7rem] z-10 bg-background px-5 py-6">
          <div className="size-[.75rem] rounded-full bg-primary"></div>
        </div>
        <div className="absolute bottom-[-1.7rem] left-[calc(theme(container.padding)-25px)] z-10 bg-background px-5 py-6">
          <div className="size-[.75rem] rounded-full bg-primary"></div>
        </div>
        <div className="absolute bottom-[-1.7rem] right-[calc(theme(container.padding)-25px)] z-10 bg-background px-5 py-6">
          <div className="size-[.75rem] rounded-full bg-primary"></div>
        </div>
        <div className="absolute bottom-0 -mx-[calc(theme(container.padding))] h-px w-screen bg-border" />
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

export default Feature77;
