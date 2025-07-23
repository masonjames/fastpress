import { Check } from 'lucide-react';

const Feature68 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="mb-6 md:mb-8 lg:mb-0">
              <img
                src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                alt="placeholder hero"
                className="aspect-square w-full rounded-3xl object-cover"
              />
            </div>
          </div>
          <div className="md:flex md:w-1/2 md:items-center md:pl-8 lg:pl-24 2xl:pl-32">
            <div>
              <h2 className="mb-3 text-xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
                Feature name
              </h2>
              <p className="text-muted-foreground lg:text-lg">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
                doloremque mollitia fugiat omnis! Porro facilis quo animi
                consequatur. Explicabo.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-y-4 rounded-xl border border-border px-5 py-4 md:gap-y-8 md:px-12 md:py-10 lg:mt-12 2xl:mt-16">
          <p className="mb-2 text-lg font-medium sm:text-center lg:text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit
          </p>
          <ul className="grid w-full grid-cols-1 gap-x-6 gap-y-4 text-base sm:grid-cols-2 lg:max-w-5xl lg:grid-cols-3">
            <li className="flex items-center gap-2 lg:justify-center">
              <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                <Check className="size-2.5 text-primary-foreground" />
              </div>
              Feature 1
            </li>
            <li className="flex items-center gap-2 lg:justify-center">
              <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                <Check className="size-2.5 text-primary-foreground" />
              </div>
              Feature 1
            </li>
            <li className="flex items-center gap-2 lg:justify-center">
              <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                <Check className="size-2.5 text-primary-foreground" />
              </div>
              Feature 1
            </li>
            <li className="flex items-center gap-2 lg:justify-center">
              <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                <Check className="size-2.5 text-primary-foreground" />
              </div>
              Feature 1
            </li>
            <li className="flex items-center gap-2 lg:justify-center">
              <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                <Check className="size-2.5 text-primary-foreground" />
              </div>
              Feature 1
            </li>
            <li className="flex items-center gap-2 lg:justify-center">
              <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                <Check className="size-2.5 text-primary-foreground" />
              </div>
              Feature 1
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Feature68;
