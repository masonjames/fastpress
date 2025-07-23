import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CTA13 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex w-full flex-col gap-16 overflow-hidden rounded-lg bg-accent p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-16">
          <div className="flex-1">
            <h3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
              Call to Action
            </h3>
            <p className="text-muted-foreground lg:text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
              doloremque mollitia fugiat omnis!
            </p>
          </div>
          <div className="shrink-0">
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Input placeholder="Enter your email" className="lg:min-w-72" />
              <Button>Subscribe</Button>
            </div>
            <p className="mt-2 text-left text-xs text-muted-foreground">
              View our{' '}
              <a href="#" className="underline hover:text-foreground">
                privacy policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA13;
