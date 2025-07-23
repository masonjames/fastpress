import { Infinity, MessagesSquare, Target } from 'lucide-react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';

const Feature93 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="text-center">
          <span className="flex items-end justify-center -space-x-4">
            <Avatar className="size-16 border">
              <AvatarImage
                src="https://www.shadcnblocks.com/images/block/avatar-1.webp"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-24 border">
              <AvatarImage
                src="https://www.shadcnblocks.com/images/block/avatar-6.webp"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-16 border">
              <AvatarImage
                src="https://www.shadcnblocks.com/images/block/avatar-3.webp"
                alt="placeholder"
              />
            </Avatar>
          </span>
          <h2 className="mt-12 text-4xl lg:text-5xl">
            Outstanding customer care
          </h2>
          <div className="mt-20 grid justify-center gap-16 lg:grid-cols-3">
            <div className="max-w-md">
              <MessagesSquare
                className="mx-auto mb-6 h-auto w-16"
                strokeWidth={1}
              />
              <h3 className="mb-4 text-2xl font-medium lg:text-3xl">
                Dedicated support for your team
              </h3>
              <p className="lg:text-lg">
                Our team consists of experts who ensure that your questions are
                answered promptly and accurately.
              </p>
            </div>
            <div className="max-w-md">
              <Target className="mx-auto mb-6 h-auto w-16" strokeWidth={1} />
              <h3 className="mb-4 text-2xl font-medium lg:text-3xl">
                Quick and precise solutions to your problems
              </h3>
              <p className="lg:text-lg">
                We know the importance of timely answers, which is why we
                prioritize fast, reliable responses.
              </p>
            </div>
            <div className="max-w-md">
              <Infinity className="mx-auto mb-6 h-auto w-16" strokeWidth={1} />
              <h3 className="mb-4 text-2xl font-medium lg:text-3xl">
                Continuous improvement through feedback
              </h3>
              <p className="lg:text-lg">
                Your input helps us grow. We regularly update and enhance our
                services based on what matters to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature93;
