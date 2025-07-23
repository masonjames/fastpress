'use client';

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import { Avatar, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { cn } from '../../utilities/cn';
import { TestimonialBlock } ;
import RichText from '../../components/RichText';
import { PublicContextProps } from '../../utilities/publicContextProps';

const testimonials = [
  {
    name: 'John Doe',
    role: 'CEO & Founder',
    avatar: '/images/block/avatar-1.webp',
    content:
      'Lorem ipsum dolor sit, amet Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis.',
  },
  {
    name: 'Jane Doe',
    role: 'CTO',
    avatar: '/images/block/avatar-2.webp',
    content:
      'Lorem ipsum dolor adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur odio, maxime corporis.',
  },
  {
    name: 'John Smith',
    role: 'COO',
    avatar: '/images/block/avatar-3.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis asperiores voluptatem.',
  },
  {
    name: 'Jane Smith',
    role: 'Tech Lead',
    avatar: '/images/block/avatar-4.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur blanditiis asperiores voluptatem Ipsam ipsa cumque.',
  },
  {
    name: 'Richard Doe',
    role: 'Designer',
    avatar: '/images/block/avatar-5.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis asperiores voluptatem Ipsam ipsa cumque deleniti.',
  },
  {
    name: 'Gordon Doe',
    role: 'Developer',
    avatar: '/images/block/avatar-6.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis asperiores voluptatem Ipsam ipsa cumque deleniti.',
  },
  {
    name: 'Richard Smith',
    role: 'Developer',
    avatar: '/images/block/avatar-7.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur blanditiis asperiores voluptatem Ipsam ipsa cumque deleniti.',
  },
  {
    name: 'Gordon Smith',
    role: 'Developer',
    avatar: '/images/block/avatar-8.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis asperiores voluptatem Ipsam ipsa cumque deleniti.',
  },
];

const Testimonial8: React.FC<TestimonialBlock & { publicContext: PublicContextProps }> = ({ headline, link, tagline, testimonial, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center gap-6">
          <Badge variant={'outline'}>Testimonials</Badge>
          {headline && <RichText publicContext={publicContext}
            content={headline}
            withWrapper={false}
            overrideStyle={{
              h2: 'mb-2 text-center text-3xl font-semibold lg:text-5xl',
              h3: 'mb-2 text-center text-2xl font-semibold lg:text-4xl',
              h4: 'mb-2 text-center text-xl font-semibold lg:text-3xl',
              p: 'text-muted-foreground lg:text-lg'
            }}
          />}
        </div>
        <div className="relative mt-14 w-full after:absolute after:inset-x-0 after:-bottom-2 after:h-96 after:bg-linear-to-t after:from-background">
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 768: 2, 1024: 3 }}
          >
            <Masonry gutter="20px" columnsCount={3}>
              {testimonials.map((testimonial, idx) => {
                return (
                  <Card
                    key={idx}
                    className={cn(
                      'p-5',
                      idx > 3 && idx <= 5 && 'hidden md:block',
                      idx > 5 && 'hidden lg:block',
                    )}
                  >
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

export default Testimonial8;
