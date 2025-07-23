import { Button } from '../../components/ui/button';

const CTA5 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex w-full flex-col overflow-hidden rounded-lg border border-border bg-accent md:rounded-xl lg:flex-row lg:items-center">
          <div className="w-full shrink-0 self-stretch lg:w-1/2">
            <img
              src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
              alt="placeholder hero"
              className="aspect-3/2 w-full rounded-md object-cover"
            />
          </div>
          <div className="w-full shrink-0 px-4 py-6 md:p-8 lg:w-1/2 lg:px-16">
            <h3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
              Feature name
            </h3>
            <p className="mb-8 text-muted-foreground lg:text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
              doloremque mollitia fugiat omnis! Porro facilis quo animi
              consequatur. Explicabo.
            </p>
            <Button>Call to Action</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA5;
