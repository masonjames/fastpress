import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Star, Zap } from 'lucide-react'
import { TestimonialBlock } from '@/payload-types';
import RichText from '@/components/RichText';
import { PublicContextProps } from '@/utilities/publicContextProps';

const Testimonial18: React.FC<TestimonialBlock & { publicContext: PublicContextProps }> = ({ headline, link, tagline, testimonial, publicContext }) => {
    return (
        <section className='py-32'>
            <div className='container'>
                <div className='flex flex-col items-center gap-4'>
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
                </div>
                <div className='mx-auto mt-20 max-w-screen-lg rounded-2xl bg-muted p-6 md:p-20'>
                    <div className='mb-6 flex gap-1'>
                        <Star className='size-5 fill-amber-500 text-amber-500' />
                        <Star className='size-5 fill-amber-500 text-amber-500' />
                        <Star className='size-5 fill-amber-500 text-amber-500' />
                        <Star className='size-5 fill-amber-500 text-amber-500' />
                        <Star className='size-5 fill-amber-500 text-amber-500' />
                    </div>
                    <q className='text-2xl font-semibold md:text-4xl'>
                        Joining the Innovators Community has completely
                        transformed my vision for the better
                    </q>
                    <p className='mt-6 text-muted-foreground'>
                        At the Innovators Community, I have been able to
                        exchange ideas, learn from others, and participate in
                        unique events and discussions. The community has been
                        fantastic for networking with industry peers.
                    </p>
                    <div className='mt-6 flex gap-4'>
                        <Avatar className='size-14 rounded-full ring-1 ring-input'>
                            <AvatarImage
                                src='/images/block/avatar-1.webp'
                                alt='placeholder'
                            />
                        </Avatar>
                        <div>
                            <p className='font-medium'>Emily Johnson</p>
                            <p className='text-sm text-muted-foreground'>
                                CEO at @company
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Testimonial18
