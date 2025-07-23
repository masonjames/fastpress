import { Check } from 'lucide-react';

import { Button } from '../../components/ui/button';

const CTA7 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="relative rounded-xl border border-border bg-accent px-6 py-8 2xl:grid 2xl:grid-cols-2 2xl:px-14 2xl:py-10">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <svg
              fill="none"
              width={404}
              height={384}
              viewBox="0 0 404 384"
              aria-hidden="true"
              className="absolute left-full top-full -translate-x-2/3 -translate-y-1/2 rotate-60"
            >
              <defs>
                <pattern
                  x={0}
                  y={0}
                  id="dots"
                  width={16}
                  height={16}
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx={2}
                    cy={2}
                    r={2}
                    fill="currentColor"
                    className="text-border"
                  />
                </pattern>
              </defs>
              <rect fill="url(#dots)" width={400} height={400} />
            </svg>
          </div>
          <div className="relative mb-12 2xl:mb-0">
            <h3 className="mb-6 text-2xl font-semibold md:mb-8 md:text-4xl lg:mb-12">
              Feature name
            </h3>
            <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">
              Bullet points introduction
            </p>
            <ul className="grid gap-x-8 gap-y-4 text-muted-foreground md:grid-cols-2">
              <li className="flex items-center gap-2">
                <Check className="size-5" />
                Bullet point 1
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-5" />
                Bullet point 1
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-5" />
                Bullet point 1
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-5" />
                Bullet point 1
              </li>
            </ul>
          </div>
          <div className="relative flex items-end 2xl:justify-end">
            <Button>Call to Action</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA7;
