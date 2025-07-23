import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TestimonialBlock } from '@/payload-types';

const Testimonial13: React.FC<TestimonialBlock> = ({ headline, link, tagline, testimonial }) => {
  return (
    <section className="bg-accent py-32">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex items-center rounded-full bg-background p-1 shadow-md">
            <Avatar className="size-10">
              <AvatarImage src="https://www.shadcnblocks.com/images/block/avatar-1.webp" />
              <AvatarFallback>SB</AvatarFallback>
            </Avatar>
            <Avatar className="-ml-3 size-10">
              <AvatarImage src="https://www.shadcnblocks.com/images/block/avatar-3.webp" />
              <AvatarFallback>RA</AvatarFallback>
            </Avatar>
            <Avatar className="-ml-3 size-10">
              <AvatarImage src="https://www.shadcnblocks.com/images/block/avatar-2.webp" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div className="mx-2 text-xs font-medium">
              Trusted by visionary designers
            </div>
          </div>
          <p className="max-w-4xl text-xl font-medium lg:text-2xl">
            &ldquo;Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
            doloremque mollitia fugiat omnis! Porro facilis quo animi
            consequatur. Explicabo.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonial13;
