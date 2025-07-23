import { TestimonialBlock } from '@/payload-types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';

const Testimonial12: React.FC<TestimonialBlock> = ({ headline, link, tagline, testimonial }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="relative rounded-2xl bg-muted">
          <Carousel className="static">
            <CarouselContent className="-ml-4">
              <CarouselItem className="grid grid-cols-1 gap-y-10 pb-14 pl-8 pr-4 pt-4 sm:pt-8 lg:grid-cols-3 lg:gap-10 lg:p-20">
                <div>
                  <img
                    src="https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg"
                    alt="placeholder"
                    className="mx-auto max-h-80 rounded-xl lg:mx-0 lg:max-h-none"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-muted-foreground">CEO, Company Name</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="mb-6 flex items-center justify-center gap-2 lg:mb-8 lg:justify-start">
                    <img
                      src="https://www.shadcnblocks.com/images/block/logos/nike-icon.svg"
                      alt="logo"
                      className="h-auto w-7 lg:w-11"
                    />
                    <span className="text-xl font-semibold lg:text-3xl">
                      Company Name
                    </span>
                  </div>
                  <p className="text-center text-xl font-semibold lg:text-left lg:text-2xl">
                    “Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua”
                  </p>
                  <Separator className="my-8 lg:my-10" />
                  <div className="grid justify-center gap-10 text-center md:grid-cols-2 lg:justify-start lg:text-left">
                    <div className="flex flex-col">
                      <span className="mb-4 text-4xl font-semibold md:text-6xl">
                        2.2x
                      </span>
                      <span className="font-medium">Monthly Active Users</span>
                      <span className="text-muted-foreground">
                        Since last month
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="mb-4 text-4xl font-semibold md:text-6xl">
                        256%
                      </span>
                      <span className="font-medium">Increase in Revenue</span>
                      <span className="text-muted-foreground">
                        Since last year
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="grid grid-cols-1 gap-y-10 pb-14 pl-8 pr-4 pt-4 sm:pt-8 lg:grid-cols-3 lg:gap-10 lg:p-20">
                <div>
                  <img
                    src="https://www.shadcnblocks.com/images/block/placeholder-dark-2.svg"
                    alt="placeholder"
                    className="mx-auto max-h-80 rounded-xl lg:mx-0 lg:max-h-none"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="font-semibold">Jane Doe</h3>
                    <p className="text-muted-foreground">CTO, Company 2</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="mb-6 flex items-center justify-center gap-2 lg:mb-8 lg:justify-start">
                    <img
                      src="https://www.shadcnblocks.com/images/block/logos/slack-icon.svg"
                      alt="logo"
                      className="h-auto w-5 lg:mr-1 lg:w-9"
                    />
                    <span className="text-xl font-semibold lg:text-3xl">
                      Company Name
                    </span>
                  </div>
                  <p className="text-center text-xl font-semibold lg:text-left lg:text-2xl">
                    “Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua”
                  </p>
                  <Separator className="my-8 lg:my-10" />
                  <div className="grid justify-center gap-10 text-center md:grid-cols-2 lg:justify-start lg:text-left">
                    <div className="flex flex-col">
                      <span className="mb-4 text-4xl font-semibold md:text-6xl">
                        1.5x
                      </span>
                      <span className="font-medium">Monthly Active Users</span>
                      <span className="text-muted-foreground">
                        Since last month
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="mb-4 text-4xl font-semibold md:text-6xl">
                        150%
                      </span>
                      <span className="font-medium">Increase in Revenue</span>
                      <span className="text-muted-foreground">
                        Since last year
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="absolute bottom-6 right-6 z-10 lg:bottom-10 lg:right-10">
              <div className="relative flex items-center gap-4">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonial12;
