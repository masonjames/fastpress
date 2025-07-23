import { Media } from '@/components/Media';
import RichText from '@/components/RichText';
import { TestimonialBlock } from '@/payload-types';
import { PublicContextProps } from '@/utilities/publicContextProps';

const Testimonial3: React.FC<TestimonialBlock & { publicContext: PublicContextProps }> = ({ headline, link, tagline, testimonial, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center gap-6 border-y py-14 text-center md:py-20">
          {Array.isArray(testimonial) && testimonial.length > 0 && (
            <>
              {testimonial[0].text && (
                <RichText publicContext={publicContext}
                  content={testimonial[0].text}
                  withWrapper={false}
                  overrideStyle={{
                    p: 'block max-w-4xl text-2xl font-medium lg:text-3xl'
                  }}
                />
              )}
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                {testimonial[0].icon && (
                  <Media
                    imgClassName="h-7 w-auto"
                    resource={testimonial[0].icon}
                  />
                )}
                <p className="font-medium">
                  {testimonial[0]?.authorName ?? ""}{testimonial[0]?.authorDescription && ", "}{testimonial[0]?.authorDescription ?? ""}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonial3;
