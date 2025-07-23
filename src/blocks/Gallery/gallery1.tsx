'use client';

import { ArrowUpRight, Plus } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '../../components/ui/badge';

const data = [
  {
    id: 'item-1',
    title: 'Case study 1',
    href: '#',
    image: 'https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg',
    logo: 'https://www.shadcnblocks.com/images/block/logos/shadcn-ui.svg',
    company: 'Company Name',
  },
  {
    id: 'item-2',
    title: 'Case study 2',
    href: '#',
    image: 'https://www.shadcnblocks.com/images/block/placeholder-dark-2.svg',
    logo: 'https://www.shadcnblocks.com/images/block/logos/astro.svg',
    company: 'Company Name',
  },
  {
    id: 'item-3',
    title: 'Case study 3',
    href: '#',
    image: 'https://www.shadcnblocks.com/images/block/placeholder-dark-3.svg',
    logo: 'https://www.shadcnblocks.com/images/block/logos/vercel.svg',
    company: 'Company Name',
  },
];

const Gallery1 = () => {
  const [selection, setSelection] = useState(data[0].id);
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col gap-5 lg:aspect-1336/420 lg:flex-row">
          {data.map((item) => (
            <div
              key={item.id}
              data-state={selection === item.id ? 'open' : 'closed'}
              className='lg:data-[state="open"]:duration-400 group max-lg:w-full max-lg:flex-1 max-md:h-[200px] md:max-lg:aspect-1336/420 lg:transform-gpu lg:transition-all lg:data-[state="closed"]:w-1/5 lg:data-[state="open"]:w-3/5 lg:data-[state="closed"]:duration-500'
              onMouseEnter={() => {
                setSelection(item.id);
              }}
            >
              <a
                href={item.href}
                className="relative block size-full overflow-hidden rounded-xl bg-primary text-primary-foreground"
              >
                <div className='absolute -inset-[50%] hidden size-[200%] md:block lg:group-data-[state="closed"]:blur-xs'>
                  <div className="absolute top-[calc(25%+40px)] aspect-square h-[calc(50%+40px)] max-lg:right-[calc(50%+40px)] lg:right-[50%]">
                    <div className="size-full text-clip rounded-xl">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="size-full object-cover object-center"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-y-1/4 left-[50%] flex aspect-389/420 h-[50%] items-center justify-center max-lg:hidden">
                    <img
                      src={item.logo}
                      alt={item.company}
                      className="h-8 invert"
                    />
                  </div>
                  <div className="absolute left-[50%] top-[50%] flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent max-lg:hidden">
                    <Plus className="size-8 text-accent-foreground" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 hidden h-[50%] bg-linear-to-t from-primary from-50% to-transparent lg:block"></div>
                </div>
                <div className="relative flex flex-col justify-between gap-4 md:absolute md:inset-0 md:max-lg:inset-x-[50%] md:max-lg:w-[50%]">
                  <div className='flex h-[80px] items-center gap-2 p-4 transition-opacity delay-200 duration-500 lg:group-data-[state="closed"]:opacity-0'>
                    <Badge variant="secondary">Commercial</Badge>
                    <Badge variant="secondary">Multiloan</Badge>
                  </div>
                  <div className='delay-250 flex flex-col gap-2 p-4 transition-all delay-200 duration-500 lg:group-data-[state="closed"]:translate-y-4 lg:group-data-[state="closed"]:opacity-0'>
                    <div className="lg:hidden">
                      <img
                        src={item.logo}
                        alt={item.company}
                        className="h-5 invert lg:h-6"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-base font-medium lg:text-lg">
                        {item.title}
                      </div>
                      <div className="flex size-8 items-center justify-center rounded-full bg-background text-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 lg:size-10">
                        <ArrowUpRight className="size-4 lg:size-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery1;
