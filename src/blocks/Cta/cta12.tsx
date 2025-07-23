import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CTA12 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <h3 className="mb-3 max-w-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
            Call to Action
          </h3>
          <p className="mb-8 max-w-3xl text-muted-foreground lg:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
            doloremque mollitia fugiat omnis!
          </p>
          <div className="w-full md:max-w-lg">
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Input placeholder="Enter your email" />
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

export default CTA12;
