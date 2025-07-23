import { Check, ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

const Feature22 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid gap-4 md:grid-cols-3 md:gap-16">
          <h2 className="mb-4 text-4xl font-medium md:mb-0">
            Build any kind of Website with our Blocks
          </h2>
          <ul className="flex flex-col gap-4 text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="size-4" /> Responsive Design and Layout
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" /> Clean and Modern Design
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" /> Easy to Customize
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" /> Cross Browser Compatible
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" /> SEO Friendly
            </li>
          </ul>
          <ul className="flex flex-col gap-4 text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="size-4" /> High Performance and Speed
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" /> Clean Code and Well Documented
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" /> Fast Loading and Free Updates
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" /> 24/7 Support
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" /> Lifetime Access and Updates
            </li>
          </ul>
        </div>
        <div className="mt-20 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border">
            <div className="relative p-1">
              <img
                src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                alt="placeholder"
                className="max-h-96 w-full rounded-t-lg object-cover md:max-h-64"
              />
              <Badge
                variant="outline"
                className="absolute left-5 top-5 bg-primary-foreground"
              >
                Example
              </Badge>
            </div>
            <div>
              <div className="mb-3 px-6 pt-6">
                <h3 className="font-medium">Copy and paste Blocks</h3>
                <p className="text-muted-foreground">
                  Easly copy and paste any block you like and use it in your
                  project.
                </p>
              </div>
              <div className="h-px border-t border-dashed"></div>
              <ul className="text-muted-foreground">
                <li className="flex items-start gap-2 px-6 py-3">
                  <Check className="mt-1 size-4 shrink-0" />
                  Responsive design and layout with clean and modern design
                </li>
                <div className="h-px border-t border-dashed"></div>
                <li className="flex items-start gap-2 px-6 py-3">
                  <Check className="mt-1 size-4 shrink-0" />
                  Easy to customize with cross browser compatibility
                </li>
                <div className="h-px border-t border-dashed"></div>
                <li className="flex items-start gap-2 px-6 py-3">
                  <Check className="mt-1 size-4 shrink-0" />
                  SEO friendly with high performance and speed for improved laod
                  times
                </li>
              </ul>
              <div className="h-px border-t border-dashed"></div>
              <a
                href="#"
                className="my-4 flex items-center gap-2 px-6 font-medium"
              >
                Read more
                <ChevronRight className="mt-0.5 size-4" />
              </a>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="relative p-1">
              <img
                src="https://www.shadcnblocks.com/images/block/placeholder-2.svg"
                alt="placeholder"
                className="max-h-96 w-full rounded-t-lg object-cover md:max-h-64"
              />
              <Badge
                variant="outline"
                className="absolute left-5 top-5 bg-primary-foreground"
              >
                Example
              </Badge>
            </div>
            <div>
              <div className="mb-3 px-6 pt-6">
                <h3 className="font-medium">Easy to Customize Blocks</h3>
                <p className="text-muted-foreground">
                  Easly customize any block you like and use it in your project.
                </p>
              </div>
              <div className="h-px border-t border-dashed"></div>
              <ul className="text-muted-foreground">
                <li className="flex items-start gap-2 px-6 py-3">
                  <Check className="mt-1 size-4 shrink-0" />
                  The blocks are clean and modern with easy to customize
                  features
                </li>
                <div className="h-px border-t border-dashed"></div>
                <li className="flex items-start gap-2 px-6 py-3">
                  <Check className="mt-1 size-4 shrink-0" />
                  All blocks are SEO friendly with cross browser compatibility
                </li>
                <div className="h-px border-t border-dashed"></div>
                <li className="flex items-start gap-2 px-6 py-3">
                  <Check className="mt-1 size-4 shrink-0" />
                  Each block is responsive with high performance and speed
                </li>
              </ul>
              <div className="h-px border-t border-dashed"></div>
              <a
                href="#"
                className="my-4 flex items-center gap-2 px-6 font-medium"
              >
                Read more
                <ChevronRight className="mt-0.5 size-4" />
              </a>
            </div>
          </div>
          <div className="rounded-lg border">
            <div className="relative p-1">
              <img
                src="https://www.shadcnblocks.com/images/block/placeholder-3.svg"
                alt="placeholder"
                className="max-h-96 w-full rounded-t-lg object-cover md:max-h-64"
              />
              <Badge
                variant="outline"
                className="absolute left-5 top-5 bg-primary-foreground"
              >
                Example
              </Badge>
            </div>
            <div>
              <div className="mb-3 px-6 pt-6">
                <h3 className="font-medium">Readymade Blocks for you to use</h3>
                <p className="text-muted-foreground">
                  Easly use any block you like and use it in your project.
                </p>
              </div>
              <div className="h-px border-t border-dashed"></div>
              <ul className="text-muted-foreground">
                <li className="flex items-start gap-2 px-6 py-3">
                  <Check className="mt-1 size-4 shrink-0" />
                  Prebuilt blocks built with shadcn/ui & TailwindCSS
                </li>
                <div className="h-px border-t border-dashed"></div>
                <li className="flex items-start gap-2 px-6 py-3">
                  <Check className="mt-1 size-4 shrink-0" />
                  Synced with your project theme and design with easy to
                  customize features
                </li>
                <div className="h-px border-t border-dashed"></div>
                <li className="flex items-start gap-2 px-6 py-3">
                  <Check className="mt-1 size-4 shrink-0" />
                  Various blocks to choose from with high performance and speed
                </li>
              </ul>
              <div className="h-px border-t border-dashed"></div>
              <a
                href="#"
                className="my-4 flex items-center gap-2 px-6 font-medium"
              >
                Read more
                <ChevronRight className="mt-0.5 size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature22;
