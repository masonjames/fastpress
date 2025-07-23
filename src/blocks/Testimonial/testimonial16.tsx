'use client';

import React, { useState } from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utilities/cn';
import { TestimonialBlock } from '@/payload-types';
import RichText from '@/components/RichText';
import { PublicContextProps } from '@/utilities/publicContextProps';

const tweets = [
  {
    id: 1,
    author: 'John Smith',
    tag: 'john_smith123',
    avatar: '/images/block/avatar-1.webp',
    content: (
      <p className="text-sm text-muted-foreground">
        Just switched over to
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        for all our team&apos;s project management needs. The UI is incredibly
        smooth and intuitive!
      </p>
    ),
    excerpt: (
      <p className="line-clamp-1 font-medium md:text-xl">
        Just switched over to
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        for all our team&apos;s
      </p>
    ),
  },
  {
    id: 2,
    author: 'Anna White',
    tag: 'anna_white',
    avatar: '/images/block/avatar-2.webp',
    content: (
      <p className="text-sm text-muted-foreground">
        Can&apos;t believe how much
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        has streamlined our internal communications. Meetings are shorter, and
        decisions are quicker!
      </p>
    ),
    excerpt: (
      <p className="line-clamp-1 font-medium md:text-xl">
        Can&apos;t believe how much
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        has streamlined
      </p>
    ),
  },
  {
    id: 3,
    author: 'Liam Rodriguez',
    tag: 'liam_rod',
    avatar: '/images/block/avatar-3.webp',
    content: (
      <p className="text-sm text-muted-foreground">
        Huge fan of
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        . We saved hours of admin work every week. If you&apos;re not using it
        yet, you&apos;re missing out!
      </p>
    ),
    excerpt: (
      <p className="line-clamp-1 font-medium md:text-xl">
        Huge fan of
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        — saved hours
      </p>
    ),
  },
  {
    id: 4,
    author: 'Sophia Martinez',
    tag: 'sophia_m',
    avatar: '/images/block/avatar-4.webp',
    content: (
      <p className="text-sm text-muted-foreground">
        Shoutout to
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        for simplifying our analytics workflow. Real-time insights are a
        game-changer for us!
      </p>
    ),
    excerpt: (
      <p className="line-clamp-1 font-medium md:text-xl">
        Shoutout to
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        for simplifying our
      </p>
    ),
  },
  {
    id: 5,
    author: 'Michael Green',
    tag: 'mikegreen_tech',
    avatar: '/images/block/avatar-5.webp',
    content: (
      <p className="text-sm text-muted-foreground">
        I’ve been using
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        for the past month, and I can confidently say it&apos;s revolutionized
        how our dev team collaborates remotely!
      </p>
    ),
    excerpt: (
      <p className="line-clamp-1 font-medium md:text-xl">
        I’ve been using
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        for the past month
      </p>
    ),
  },
  {
    id: 6,
    author: 'Emily Carter',
    tag: 'emily_carter_dev',
    avatar: '/images/block/avatar-6.webp',
    content: (
      <p className="text-sm text-muted-foreground">
        Amazing experience with
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        for managing product launches. Our latest product went to market
        seamlessly, thanks to their tools.
      </p>
    ),
    excerpt: (
      <p className="line-clamp-1 font-medium md:text-xl">
        Amazing experience with
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        for managing
      </p>
    ),
  },
  {
    id: 7,
    author: 'Chris Wilson',
    tag: 'chriswilson_ux',
    avatar: '/images/block/avatar-7.webp',
    content: (
      <p className="text-sm text-muted-foreground">
        Thanks to
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        for the fantastic resources. My design team has improved efficiency by
        30% in just a few weeks!
      </p>
    ),
    excerpt: (
      <p className="line-clamp-1 font-medium md:text-xl">
        Thanks to
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        for the fantastic
      </p>
    ),
  },
  {
    id: 8,
    author: 'Ella Davis',
    tag: 'ella_davis_dev',
    avatar: '/images/block/avatar-8.webp',
    content: (
      <p className="text-sm text-muted-foreground">
        I&apos;ve been using
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        for a few months now. The platform is a game-changer for managing remote
        teams. Highly recommended!
      </p>
    ),
    excerpt: (
      <p className="line-clamp-1 font-medium md:text-xl">
        I&apos;ve been using
        <a href="#" className="mx-1 text-blue-600">
          @Acme
        </a>
        for a few months
      </p>
    ),
  },
];

const Testimonial16: React.FC<TestimonialBlock & { publicContext: PublicContextProps }> = ({ headline, link, tagline, testimonial, publicContext }) => {
  const [expandedTweetId, setExpandedTweetId] = useState<number | null>(null);

  return (
    <section className="py-32">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-2">
          {headline && <RichText publicContext={publicContext}
            content={headline}
            withWrapper={false}
            overrideStyle={{
              h2: 'max-w-md text-3xl font-medium lg:text-[42px] lg:leading-tight',
              h3: 'max-w-md text-2xl font-medium lg:text-4xl lg:leading-tight',
              h4: 'max-w-md text-xl font-medium lg:text-3xl lg:leading-tight',
              p: 'mb-4 text-2xl font-medium text-muted-foreground'
            }}
          />}
          <div>
            <p className="mb-4 text-2xl font-medium text-muted-foreground">
              See what others are saying
            </p>
            <Separator />
            {tweets.map((tweet) => (
              <React.Fragment key={tweet.id}>
                <div className="select-none">
                  <div
                    onClick={() =>
                      setExpandedTweetId((prevId) =>
                        prevId === tweet.id ? null : tweet.id,
                      )
                    }
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        'overflow-hidden transition-all duration-500',
                        expandedTweetId === tweet.id
                          ? 'max-h-[500px]'
                          : 'max-h-20',
                      )}
                    >
                      {expandedTweetId === tweet.id ? (
                        <div className="py-4">
                          <div className="mb-3 flex gap-4 leading-5">
                            <Avatar className="size-9 rounded-full ring-1 ring-input">
                              <AvatarImage
                                src={tweet.avatar}
                                alt={tweet.author}
                              />
                            </Avatar>
                            <div className="text-sm">
                              <p className="font-medium">{tweet.author}</p>
                              <p className="text-muted-foreground">
                                {tweet.tag}
                              </p>
                            </div>
                          </div>
                          {tweet.content}
                        </div>
                      ) : (
                        <div className="py-4 transition-colors hover:bg-muted">
                          <div className="flex gap-3 px-2">
                            <Avatar className="h-full w-8">
                              <AvatarImage src={tweet.avatar} alt="avatar" />
                            </Avatar>
                            <div>{tweet.excerpt}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Separator />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Testimonial16;
