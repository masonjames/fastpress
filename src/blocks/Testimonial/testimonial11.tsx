import { TestimonialBlock } from '@/payload-types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Stars } from '@/components/uiCustom/stars';
import { Media } from '@/components/Media';
import RichText from '@/components/RichText';
import { CMSLink } from '@/components/Link';
import { PublicContextProps } from '@/utilities/publicContextProps';

const Testimonial11: React.FC<TestimonialBlock & { publicContext: PublicContextProps }> = ({ headline, link, tagline, testimonial, publicContext }) => {
  return (
    <section className="relative bg-accent bg-[linear-gradient(hsl(from_var(--accent)_h_s_l)_0%,hsl(from_var(--background)_h_s_l)_100%)] py-32 sm:py-0">
      <div className="container sm:py-32">
        <div className="flex flex-col items-start gap-12 sm:flex-row sm:items-center sm:justify-between sm:gap-32">
          <div className="flex flex-1 flex-col items-start text-left">
            {headline && <RichText publicContext={publicContext}
              content={headline}
              withWrapper={false}
              overrideStyle={{
                h2: 'my-6 text-pretty text-2xl font-bold lg:text-4xl',
                h3: 'my-6 text-pretty text-1xl font-bold lg:text-3xl',
                h4: 'my-6 text-pretty text-xl font-bold lg:text-2xl',
                p: 'mb-8 max-w-3xl text-muted-foreground lg:text-xl',
              }}
            />}
            {link && <CMSLink publicContext={publicContext} {...link} />}
          </div>
          <div className="block shrink-0 flex-row gap-12 sm:flex sm:flex-col lg:flex-row lg:gap-24">
            {testimonial?.[0] && (<div className="mb-8 mr-8 inline-block sm:mb-0 sm:mr-0">
              {testimonial?.[0]?.icon && <Media
                imgClassName="mb-4 h-6"
                resource={testimonial?.[0]?.icon}
              />}
              {testimonial?.[0].rating && (
                <div className="flex items-center">
                  <div className="mr-4 shrink-0 text-sm font-semibold">
                    {testimonial?.[0].rating} / 5
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Stars rating={testimonial?.[0].rating} />
                  </div>
                </div>
              )}
            </div>
            )}
            {testimonial?.[1] && (<div className="mb-8 mr-8 inline-block sm:mb-0 sm:mr-0">
              {testimonial?.[1]?.icon && <Media
                imgClassName="mb-4 h-6"
                resource={testimonial?.[1]?.icon}
              />}
              {testimonial?.[1].rating && (
                <div className="flex items-center">
                  <div className="mr-4 shrink-0 text-sm font-semibold">
                    {testimonial?.[1].rating} / 5
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Stars rating={testimonial?.[1].rating} />
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
      <div className="container mt-16 sm:mt-0">
        <div className="w-full columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-6 [&>div:nth-child(n+5)]:hidden sm:[&>div:nth-child(n+5)]:inline-block sm:[&>div:nth-child(n+9)]:hidden lg:[&>div:nth-child(n+9)]:inline-block">
          {Array.isArray(testimonial) && testimonial.map((t) => (
            <div
              key={t.id}
              className="mb-4 inline-block w-full rounded-lg border border-border bg-background p-6 lg:mb-6"
            >
              <div className="flex flex-col">
                {t.text && <RichText publicContext={publicContext}
                  content={t.text}
                  withWrapper={false}
                  overrideStyle={{
                    p: 'mb-4 text-xs',
                  }}
                />}
                <div className="flex items-center gap-1 md:gap-2">
                  {
                    t?.authorAvatar && typeof t?.authorAvatar === "object" && (
                      <Avatar key={t.id} className="size-8 md:size-10">
                        <AvatarImage asChild src={t?.authorAvatar.url!}>
                          <Media
                            imgClassName="h-9 w-full rounded-md object-cover lg:h-auto"
                            resource={t?.authorAvatar}
                          />
                        </AvatarImage>
                        <AvatarFallback>{t?.authorName}</AvatarFallback>
                      </Avatar>
                    )}
                  <div className="text-left">
                    <p className="text-xs font-medium">{t?.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {t?.authorDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 hidden w-full sm:block sm:h-67.5 sm:bg-[linear-gradient(transparent_0%,hsl(from_var(--accent)_h_s_l)_100%)] lg:h-56"></div>
    </section>
  );
};

export default Testimonial11;
