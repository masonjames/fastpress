'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import { ChevronRight, Star, Zap } from 'lucide-react'
import { useRef } from 'react'
import { TestimonialBlock } from '@/payload-types';
import RichText from '@/components/RichText';
import { CMSLink } from '@/components/Link';
import { PublicContextProps } from '@/utilities/publicContextProps'

const testimonials = [
    {
        name: 'Alice Johnson',
        role: 'CEO & Founder',
        avatar: '/images/block/avatar-1.webp',
        content:
            'This platform has revolutionized the way we manage projects. It is incredibly user-friendly and efficient.',
    },
    {
        name: 'David Lee',
        role: 'CTO',
        avatar: '/images/block/avatar-2.webp',
        content:
            'I have been impressed with the seamless integration and functionality. It has made our tech operations much smoother.',
    },
    {
        name: 'Mark Thompson',
        role: 'COO',
        avatar: '/images/block/avatar-3.webp',
        content:
            'Managing our day-to-day tasks has never been easier. The interface is intuitive and saves us a lot of time.',
    },
    {
        name: 'Emily Carter',
        role: 'Tech Lead',
        avatar: '/images/block/avatar-4.webp',
        content:
            'The tools provided have significantly improved our team’s workflow and collaboration. Highly recommend it!',
    },
    {
        name: 'Sophia Turner',
        role: 'Designer',
        avatar: '/images/block/avatar-5.webp',
        content:
            'From a design perspective, the flexibility and ease of use are outstanding. This has become an indispensable tool for our team.',
    },
    {
        name: 'James Wilson',
        role: 'Developer',
        avatar: '/images/block/avatar-6.webp',
        content:
            'As a developer, I appreciate the robust features and simplicity. It has streamlined our processes considerably.',
    },
]

const Testimonial19: React.FC<TestimonialBlock & { publicContext: PublicContextProps }> = ({ headline, link, tagline, testimonial, publicContext }) => {
    const plugin = useRef(
        AutoScroll({
            startDelay: 500,
            speed: 0.7,
        })
    )

    return (
        <section className='py-32'>
            <div className='container flex flex-col items-center gap-4'>
                <div className='flex items-center gap-1 text-sm font-semibold'>
                    <Zap className='h-6 w-auto fill-primary' />
                    Rated 5 stars by 1000+ clients
                </div>
                {headline && <RichText publicContext={publicContext}
                    content={headline}
                    withWrapper={false}
                    overrideStyle={{
                        h2: 'text-center text-3xl font-semibold lg:text-4xl',
                        h3: 'text-center text-2xl font-semibold lg:text-3xl',
                        h4: 'text-center text-xl font-semibold lg:text-2xl',
                        p: 'text-center text-muted-foreground lg:text-lg'
                    }}
                />}
                {link && (
                    <CMSLink publicContext={publicContext} {...link} className="flex items-center gap-1 font-semibold" />
                )}
            </div>
            <div className='lg:container'>
                <div className='mt-16 space-y-4'>
                    <Carousel
                        opts={{
                            loop: true,
                        }}
                        plugins={[plugin.current]}
                        onMouseLeave={() => plugin.current.play()}
                        className='relative before:absolute before:bottom-0 before:left-0 before:top-0 before:z-10 before:w-36 before:bg-linear-to-r before:from-background before:to-transparent after:absolute after:bottom-0 after:right-0 after:top-0 after:z-10 after:w-36 after:bg-linear-to-l after:from-background after:to-transparent'
                    >
                        <CarouselContent>
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem
                                    key={index}
                                    className='basis-auto'
                                >
                                    <Card className='max-w-96 select-none p-6'>
                                        <div className='flex justify-between'>
                                            <div className='mb-4 flex gap-4'>
                                                <Avatar className='size-14 rounded-full ring-1 ring-input'>
                                                    <AvatarImage
                                                        src={testimonial.avatar}
                                                        alt={testimonial.name}
                                                    />
                                                </Avatar>
                                                <div>
                                                    <p className='font-medium'>
                                                        {testimonial.name}
                                                    </p>
                                                    <p className='text-sm text-muted-foreground'>
                                                        {testimonial.role}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex gap-1'>
                                                <Star className='size-5 fill-amber-500 text-amber-500' />
                                                <Star className='size-5 fill-amber-500 text-amber-500' />
                                                <Star className='size-5 fill-amber-500 text-amber-500' />
                                                <Star className='size-5 fill-amber-500 text-amber-500' />
                                                <Star className='size-5 fill-amber-500 text-amber-500' />
                                            </div>
                                        </div>
                                        <q className='leading-7 text-muted-foreground'>
                                            {testimonial.content}
                                        </q>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </section>
    )
}

export default Testimonial19
