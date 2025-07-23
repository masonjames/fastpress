'use client';

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { TestimonialBlock } from '@/payload-types';

const testimonials = [
  {
    name: 'John Doe',
    role: 'CEO & Founder',
    avatar: '/images/block/avatar-1.webp',
    content:
      'Lorem ipsum dolor sit, amet Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis.',
    link: '#',
    icon: '/images/block/logos/instagram-icon.svg',
  },
  {
    name: 'Jane Doe',
    role: 'CTO',
    avatar: '/images/block/avatar-2.webp',
    content:
      'Lorem ipsum dolor adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur odio, maxime corporis.',
    link: '#',
    icon: '/images/block/logos/twitter-icon.svg',
  },
  {
    name: 'John Smith',
    role: 'COO',
    avatar: '/images/block/avatar-3.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis asperiores voluptatem.',
    link: '#',
    icon: '/images/block/logos/instagram-icon.svg',
  },
  {
    name: 'Jane Smith',
    role: 'Tech Lead',
    avatar: '/images/block/avatar-4.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur blanditiis asperiores voluptatem Ipsam ipsa cumque.',
    link: '#',
    icon: '/images/block/logos/twitter-icon.svg',
  },
  {
    name: 'Richard Doe',
    role: 'Designer',
    avatar: '/images/block/avatar-5.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis asperiores voluptatem Ipsam ipsa cumque deleniti.',
    link: '#',
    icon: '/images/block/logos/producthunt-icon.svg',
  },
  {
    name: 'Gordon Doe',
    role: 'Developer',
    avatar: '/images/block/avatar-6.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis asperiores voluptatem Ipsam ipsa cumque deleniti.',
    link: '#',
    icon: '/images/block/logos/twitter-icon.svg',
  },
];

const Testimonial9: React.FC<TestimonialBlock> = ({ headline, link, tagline, testimonial }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center gap-6">
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
            Used by 1000+ clients
          </h2>
          <p className="text-muted-foreground lg:text-lg">
            We are happy to have satisfied clients all over the world
          </p>
        </div>
        <div className="mt-14 w-full">
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 768: 2, 1024: 3 }}
          >
            <Masonry gutter="20px" columnsCount={3}>
              {testimonials.map((testimonial, idx) => {
                return (
                  <Card key={idx} className="p-5">
                    <div className="flex justify-between">
                      <div className="flex gap-4 leading-5">
                        <Avatar className="size-9 rounded-full ring-1 ring-input">
                          <AvatarImage
                            src={testimonial.avatar}
                            alt={testimonial.name}
                          />
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <a href={testimonial.link}>
                        <img
                          alt="Testimonial source"
                          src={testimonial.icon}
                          className="size-4"
                        />
                      </a>
                    </div>
                    <div className="mt-8 leading-7 text-foreground/70">
                      <q>{testimonial.content}</q>
                    </div>
                  </Card>
                );
              })}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </div>
    </section>
  );
};

export default Testimonial9;
