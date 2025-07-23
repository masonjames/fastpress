import { Code, GitBranch } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

const Feature4 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto xl:px-36">
          <h1 className="mx-auto mb-16 max-w-screen-sm text-pretty text-center text-4xl font-semibold lg:text-5xl">
            Get your team on the same page, literally
          </h1>

          <div className="mt-10 flex flex-col gap-6">
            <Card>
              <CardHeader className="pb-1">
                <Code className="size-5" strokeWidth={1.5} />
              </CardHeader>
              <CardContent className="text-left">
                <h2 className="mb-1 text-lg font-semibold">
                  Collaborate or co-edit together
                </h2>
                <p className="leading-snug text-muted-foreground">
                  Allow others to comment or suggest edits. Just type the @ key
                  to get their attention.
                </p>
              </CardContent>
              <CardFooter className="justify-end pb-0">
                <img
                  className="h-[500px] w-full rounded-t-md object-cover object-center"
                  src="https://www.shadcnblocks.com/images/block/placeholder.svg"
                  alt="placeholder"
                />
              </CardFooter>
            </Card>
            <div className="flex flex-col gap-6 md:flex-row">
              <Card className="w-full">
                <CardHeader className="pb-1">
                  <GitBranch className="size-5" strokeWidth={1.5} />
                </CardHeader>
                <CardContent className="text-left">
                  <h2 className="mb-1 text-lg font-semibold">Card Title</h2>
                  <p className="leading-snug text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur.
                  </p>
                </CardContent>
                <CardFooter className="justify-end pb-0 pr-0">
                  <img
                    className="size-full max-h-96 rounded-tl-md object-cover object-center"
                    src="https://www.shadcnblocks.com/images/block/placeholder.svg"
                    alt="placeholder"
                  />
                </CardFooter>
              </Card>
              <Card className="flex w-full flex-col justify-between gap-10 md:gap-20">
                <CardHeader className="items-start pb-1">
                  <img
                    className="h-8"
                    src="https://www.shadcnblocks.com/images/block/logos/shadcn-ui.svg"
                    alt=""
                  />
                </CardHeader>
                <CardContent className="text-left">
                  <q className="text-2xl md:text-3xl">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. A
                    sint, porro consequatur illo itaque rem dolor.
                  </q>
                </CardContent>
                <CardFooter className="flex-col items-start text-xs">
                  <p className="font-semibold">John Doe</p>
                  <p className="text-muted-foreground">CET, Company Example</p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature4;
