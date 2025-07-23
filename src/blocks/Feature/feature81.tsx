import { ArrowRight } from 'lucide-react';

const Feature81 = () => {
  return (
    <section className="py-32">
      <div className="container flex flex-col items-center gap-8 md:gap-16 lg:px-16">
        <div className="flex flex-col items-center text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-wider">
            Tag Line
          </p>
          <h3 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Feature group
          </h3>
          <p className="mb-8 text-muted-foreground lg:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
            doloremque mollitia fugiat omnis! Porro facilis quo animi
            consequatur. Explicabo.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          <a
            href="#"
            className="group relative col-span-2 text-clip rounded-lg sm:max-lg:col-span-1"
          >
            <img
              src="https://images.unsplash.com/photo-1536735561749-fc87494598cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxNzd8fHx8fHwyfHwxNzIzNjM0NDc0fA&ixlib=rb-4.0.3&q=80&w=1080"
              alt="placeholder"
              className="absolute size-full object-cover object-center"
            />
            <div className="relative flex size-full flex-col items-start justify-between gap-4 bg-primary/60 px-4 py-5 text-primary-foreground transition-colors hover:bg-primary/70 sm:aspect-3/2 md:p-6 lg:p-8">
              <img
                src="https://www.shadcnblocks.com/images/block/logos/shadcn-ui.svg"
                alt="placeholder logo"
                className="mb-8 h-6 max-w-48 invert sm:h-8 md:h-10"
              />
              <div className="flex items-center text-xs font-medium md:text-base lg:text-lg">
                Read more{' '}
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </a>
          <a href="#" className="group relative text-clip rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1548324215-9133768e4094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMzF8fHx8fHwyfHwxNzIzNDM1MzA1fA&ixlib=rb-4.0.3&q=80&w=1080"
              alt="placeholder"
              className="absolute size-full object-cover object-center"
            />
            <div className="relative flex size-full flex-col items-start justify-between gap-4 bg-primary/60 px-4 py-5 text-primary-foreground transition-colors hover:bg-primary/70 sm:aspect-3/2 md:p-6 lg:p-8">
              <img
                src="https://www.shadcnblocks.com/images/block/logos/astro.svg"
                alt="placeholder logo"
                className="mb-8 h-6 invert sm:h-8 md:h-10"
              />
              <div className="flex items-center text-xs font-medium md:text-base lg:text-lg">
                Read more{' '}
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </a>
          <a href="#" className="group relative text-clip rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1550070881-a5d71eda5800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjV8fHx8fHwyfHwxNzIzNDM1Mjk4fA&ixlib=rb-4.0.3&q=80&w=1080"
              alt="placeholder"
              className="absolute size-full object-cover object-center"
            />
            <div className="relative flex size-full flex-col items-start justify-between gap-4 bg-primary/50 px-4 py-5 text-primary-foreground transition-colors hover:bg-primary/70 sm:aspect-2/1 sm:justify-end md:flex-row md:items-end md:justify-between md:gap-0 md:p-6 lg:p-8">
              <div>
                <img
                  src="https://www.shadcnblocks.com/images/block/logos/vercel.svg"
                  alt="placeholder logo"
                  className="h-6 invert sm:h-8 md:h-10"
                />
              </div>
              <div className="flex items-center justify-end text-xs font-medium md:w-min md:flex-1 md:text-base lg:text-lg">
                Read more{' '}
                <ArrowRight className="ml-2 size-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Feature81;
