import { Sparkles, SquareDashedMousePointer } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Feature21 = () => {
  return (
    <section className="bg-gray-50 py-32 dark:bg-background">
      <div className="container max-w-7xl">
        <div className="flex items-center gap-2 text-muted-foreground">
          <SquareDashedMousePointer className="size-5" />
          <p className="text-sm">Utilities</p>
        </div>
        <Separator className="mb-8 mt-3" />
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <h2 className="text-3xl font-medium md:w-1/2">
            Utilites for every use case and platform you can think of.
          </h2>
          <p className="md:w-1/2">
            All the tools you need to get the job done. From apps to
            integrations, we have you covered.
          </p>
        </div>
        <div className="mt-11 flex flex-col gap-6 md:flex-row">
          <div className="flex w-full flex-col gap-6">
            <Card className="p-6">
              <p className="mb-1 font-medium">Apps</p>
              <p className="text-muted-foreground">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi
                laboriosam voluptatibus temporibus doloremque laudantium.
              </p>
            </Card>
            <Card>
              <img
                src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                alt="placeholder"
                className="aspect-video w-full object-cover"
              />
              <div className="p-6">
                <p className="mb-1 font-medium">Integrations</p>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Animi laboriosam voluptatibus temporibus doloremque
                  laudantium.
                </p>
              </div>
            </Card>
            <Card className="p-6">
              <p className="mb-1 font-medium">Utilities</p>
              <p className="text-muted-foreground">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi
                laboriosam voluptatibus temporibus doloremque laudantium.
              </p>
            </Card>
            <Card className="p-6">
              <p className="mb-1 flex items-center gap-2 font-medium">
                Features <Sparkles className="size-4" />
              </p>
              <p className="text-muted-foreground">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi
                laboriosam voluptatibus temporibus doloremque laudantium.
              </p>
            </Card>
          </div>
          <div className="flex w-full flex-col gap-6">
            <Card>
              <img
                src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                alt="placeholder"
                className="aspect-video w-full object-cover"
              />
              <div className="p-6">
                <p className="mb-1 flex items-center gap-2 font-medium">
                  Integrations <Sparkles className="size-4" />
                </p>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Animi laboriosam voluptatibus temporibus doloremque
                  laudantium.
                </p>
              </div>
            </Card>
            <Card className="p-6">
              <p className="mb-1 font-medium">Features</p>
              <p className="text-muted-foreground">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi
                laboriosam voluptatibus temporibus doloremque laudantium.
              </p>
            </Card>
            <Card className="p-6">
              <p className="mb-1 flex items-center gap-2 font-medium">
                Features <Sparkles className="size-4" />
              </p>
              <p className="text-muted-foreground">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi
                laboriosam voluptatibus temporibus doloremque laudantium.
              </p>
            </Card>
            <Card className="border-dashed bg-transparent p-6 shadow-none">
              <div className="mb-1 flex items-center gap-2 font-medium">
                Search
                <Badge variant={'outline'}>Coming soon</Badge>
              </div>
              <p className="text-muted-foreground">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi
                laboriosam voluptatibus temporibus doloremque laudantium.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature21;
