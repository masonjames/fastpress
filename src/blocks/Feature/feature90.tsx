import { Button } from '@/components/ui/button';

const Feature90 = () => {
  return (
    <section className="bg-muted/10 py-32">
      <div className="container">
        <div className="mx-auto flex max-w-screen-md flex-col items-center gap-6">
          <h2 className="mb-2 text-balance text-center text-4xl font-extrabold lg:text-6xl">
            Seamless connections with all your tools
          </h2>
          <p className="text-center text-lg text-muted-foreground lg:text-xl">
            Easily integrate your platform with the services you rely on to
            enhance your productivity and results.
          </p>
          <Button variant="outline" className="mt-6">
            View all integrations
          </Button>
        </div>
        <div className="my-14">
          <div className="flex justify-center -space-x-4 sm:-space-x-5">
            <span className="flex aspect-square h-[13vw] min-h-10 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted md:h-28">
              <img
                src="https://www.shadcnblocks.com/images/block/block-1.svg"
                alt="logo"
                className="h-auto w-[8vw] max-w-12 md:w-12"
              />
            </span>
            <span className="flex aspect-square h-[13vw] min-h-10 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted md:h-28">
              <img
                src="https://www.shadcnblocks.com/images/block/block-2.svg"
                alt="logo"
                className="h-auto w-[8vw] max-w-12 md:w-12"
              />
            </span>
            <span className="flex aspect-square h-[13vw] min-h-10 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted md:h-28">
              <img
                src="https://www.shadcnblocks.com/images/block/block-3.svg"
                alt="logo"
                className="h-auto w-[8vw] max-w-12 md:w-12"
              />
            </span>
            <span className="flex aspect-square h-[13vw] min-h-10 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted md:h-28">
              <img
                src="https://www.shadcnblocks.com/images/block/block-4.svg"
                alt="logo"
                className="h-auto w-[8vw] max-w-12 md:w-12"
              />
            </span>
            <span className="flex aspect-square h-[13vw] min-h-10 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted md:h-28">
              <img
                src="https://www.shadcnblocks.com/images/block/block-5.svg"
                alt="logo"
                className="h-auto w-[8vw] max-w-12 md:w-12"
              />
            </span>
            <span className="flex aspect-square h-[13vw] min-h-10 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted md:h-28">
              <img
                src="https://www.shadcnblocks.com/images/block/block-1.svg"
                alt="logo"
                className="h-auto w-[8vw] max-w-12 md:w-12"
              />
            </span>
            <span className="flex aspect-square h-[13vw] min-h-10 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted md:h-28">
              <img
                src="https://www.shadcnblocks.com/images/block/block-2.svg"
                alt="logo"
                className="h-auto w-[8vw] max-w-12 md:w-12"
              />
            </span>
            <span className="flex aspect-square h-[13vw] min-h-10 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted md:h-28">
              <img
                src="https://www.shadcnblocks.com/images/block/block-3.svg"
                alt="logo"
                className="h-auto w-[8vw] max-w-12 md:w-12"
              />
            </span>
          </div>
        </div>
        <div className="text-center text-sm">
          and more than
          <a href="#" className="ml-1 font-bold underline">
            120+ integrations available
          </a>
        </div>
      </div>
    </section>
  );
};

export default Feature90;
