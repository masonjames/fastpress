import { AppWindowMac, Zap } from 'lucide-react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

const Feature5 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <AppWindowMac className="mb-1 w-7" />
            <div className="text-left">
              <h2 className="mb-1 mt-4 text-lg font-semibold">
                Get your team on the same page.
              </h2>
              <p className="text-muted-foreground">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aut
                odit pariatur, ullam delectus modi excepturi ea dignissimos
                mollitia minima unde animi qui omnis.
              </p>
            </div>
            <div className="mt-7">
              <img
                className="aspect-square max-h-[500px] w-full rounded-t-md object-cover object-center"
                src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                alt="placeholder"
              />
            </div>
          </Card>
          <Card className="flex flex-col justify-between p-6">
            <div className="text-left">
              <Zap className="mb-1 w-7" />
              <h2 className="mb-1 mt-4 text-lg font-semibold">
                Fast and easy to use.
              </h2>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
                corrupti sed.
              </p>
            </div>
            <img
              className="mt-7 aspect-square rounded-t-md object-cover lg:aspect-auto lg:h-full"
              src="https://www.shadcnblocks.com/images/block/placeholder-2.svg"
              alt="placeholder"
            />
          </Card>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3">
          <q className="max-w-2xl text-center text-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo,
            pariatur.
          </q>
          <div className="flex flex-col items-center gap-2 leading-5 sm:flex-row">
            <Avatar className="size-9 rounded-full ring-1 ring-input">
              <AvatarImage
                src="https://www.shadcnblocks.com/images/block/avatar-1.webp"
                alt="placeholder"
              />
            </Avatar>
            <div className="text-center text-xs sm:text-left">
              <p className="font-bold">John Doe</p>
              <p className="text-muted-foreground">CEO, Company Name</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature5;
