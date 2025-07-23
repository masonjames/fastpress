import { CheckCircle, MessagesSquare } from 'lucide-react';

const Feature6 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col lg:items-start lg:text-left">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent">
              <MessagesSquare className="size-6" />
            </span>
            <h1 className="my-6 text-pretty text-3xl font-bold lg:text-4xl">
              Welcome to Our Website
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
              doloremque mollitia fugiat omnis! Porro facilis quo animi.
            </p>
            <ul className="ml-4 space-y-4 text-left">
              <li className="flex items-center gap-3">
                <CheckCircle className="size-6" />
                <p className="text-muted-foreground lg:text-lg">
                  Lorem ipsum dolor sit amet.
                </p>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="size-6" />
                <p className="text-muted-foreground lg:text-lg">
                  Lorem ipsum dolor sit amet consectetur.
                </p>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="size-6" />
                <p className="text-muted-foreground lg:text-lg">
                  Lorem, ipsum dolor sit amet consectetur adipisicing.
                </p>
              </li>
            </ul>
          </div>
          <img
            src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
            alt="placeholder hero"
            className="max-h-96 w-full rounded-md object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Feature6;
