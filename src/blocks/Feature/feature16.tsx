import { Timer, Zap, ZoomIn } from 'lucide-react';

const Feature16 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <p className="mb-4 text-sm text-muted-foreground lg:text-base">
          OUR VALUES
        </p>
        <h2 className="text-3xl font-medium lg:text-4xl">Why Choose Us?</h2>
        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
          <div className="rounded-lg bg-accent p-5">
            <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-background">
              <Timer className="size-6" />
            </span>
            <h3 className="mb-2 text-xl font-medium">Performance</h3>
            <p className="leading-7 text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt
              beatae tenetur totam aut blanditis ipsa quaerat neque eaque, atque
              doloremque! Eligendi.
            </p>
          </div>
          <div className="rounded-lg bg-accent p-5">
            <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-background">
              <ZoomIn className="size-6" />
            </span>
            <h3 className="mb-2 text-xl font-medium">Quality</h3>
            <p className="leading-7 text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt
              beatae tenetur totam aut blanditis ipsa quaerat neque eaque, atque
              doloremque! Eligendi.
            </p>
          </div>
          <div className="rounded-lg bg-accent p-5">
            <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-background">
              <Zap className="size-6" />
            </span>
            <h3 className="mb-2 text-xl font-medium">Innovation</h3>
            <p className="leading-7 text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt
              beatae tenetur totam aut blanditis ipsa quaerat neque eaque, atque
              doloremque! Eligendi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature16;
