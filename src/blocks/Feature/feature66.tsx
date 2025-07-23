const Feature66 = () => {
  return (
    <section className="py-32">
      <div className="container flex flex-col items-start gap-8 lg:gap-12 lg:px-16">
        <h3 className="text-pretty text-3xl font-semibold md:text-4xl lg:max-w-3xl lg:text-5xl">
          Feature group
        </h3>
        <div className="grid w-full grid-cols-1 gap-4 max-md:grid-rows-[1fr_1fr] md:grid-cols-2 lg:gap-6">
          <a href="#" className="h-full">
            <div className="group relative h-full min-h-108 max-w-full overflow-hidden rounded-xl bg-red-200 md:aspect-5/4 lg:aspect-video">
              <img
                src="https://images.unsplash.com/photo-1548324215-9133768e4094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMzF8fHx8fHwyfHwxNzIzNDM1MzA1fA&ixlib=rb-4.0.3&q=80&w=1080"
                alt="placeholder"
                className="absolute size-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 mt-auto max-h-[50%] min-h-[50%] bg-[linear-gradient(transparent,hsl(from_var(--primary)_h_s_l/0.8)_80%)] mix-blend-multiply" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-primary-foreground md:p-8">
                <img
                  src="https://www.shadcnblocks.com/images/block/logos/astro.svg"
                  alt="placeholder logo"
                  className="mb-3 h-8 invert"
                />
                <p className="text-xl font-semibold">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
            </div>
          </a>
          <a href="#" className="h-full">
            <div className="group relative size-full min-h-108 overflow-hidden rounded-xl bg-red-200 md:aspect-5/4 lg:aspect-video">
              <img
                src="https://images.unsplash.com/photo-1550070881-a5d71eda5800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjV8fHx8fHwyfHwxNzIzNDM1Mjk4fA&ixlib=rb-4.0.3&q=80&w=1080"
                alt="placeholder"
                className="absolute size-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 mt-auto max-h-[50%] min-h-[50%] bg-[linear-gradient(transparent,hsl(from_var(--primary)_h_s_l/0.8)_80%)] mix-blend-multiply" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-primary-foreground md:p-8">
                <img
                  src="https://www.shadcnblocks.com/images/block/logos/nextjs.svg"
                  alt="placeholder logo"
                  className="mb-3 h-8 invert"
                />
                <p className="text-xl font-semibold">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Feature66;
