import { Media } from '@/components/Media';
import RichText from '@/components/RichText';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { TestimonialBlock } from '@/payload-types';
import { PublicContextProps } from '@/utilities/publicContextProps';

const Testimonial4: React.FC<TestimonialBlock & { publicContext: PublicContextProps }> = ({ headline, link, tagline, testimonial, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 items-stretch gap-x-0 gap-y-4 lg:grid-cols-3 lg:gap-4">
            {Array.isArray(testimonial) && testimonial.length > 0 && testimonial[0] && (
              <>
                {testimonial[0]?.authorAvatar && <Media
                  imgClassName="h-72 w-full rounded-md object-cover lg:h-auto"
                  resource={testimonial[0]?.authorAvatar}
                />}
                <Card className="col-span-2 flex items-center justify-center p-6">
                  <div className="flex flex-col gap-4">
                    {testimonial[0].text && (
                      <RichText publicContext={publicContext}
                        content={testimonial[0].text}
                        withWrapper={false}
                        overrideStyle={{
                          p: 'text-xl font-medium lg:text-3xl'
                        }}
                      />
                    )}
                    <div className="flex flex-col items-start">
                      <p>{testimonial[0]?.authorName ?? ""}</p>
                      <p className="text-muted-foreground">{testimonial[0]?.authorDescription ?? ""}</p>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {Array.isArray(testimonial) && testimonial.length > 1 && testimonial[1] && (
              <Card>
                <CardContent className="px-6 pt-6 leading-7 text-foreground/70">
                  {testimonial[1]?.text && (
                    <RichText publicContext={publicContext}
                      content={testimonial[1].text}
                      withWrapper={false}
                      overrideStyle={{ p: '' }}
                    />
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex gap-4 leading-5">
                    {testimonial[0]?.authorAvatar && typeof testimonial[0]?.authorAvatar === "object" && (<Avatar className="size-9 rounded-full ring-1 ring-input">
                      <AvatarImage asChild src={testimonial[0]?.authorAvatar.url!}>
                        <Media
                          imgClassName="h-9 w-full rounded-md object-cover lg:h-auto"
                          resource={testimonial[0]?.authorAvatar}
                        />
                      </AvatarImage>
                    </Avatar>)}
                    <div className="text-sm">
                      <p className="font-medium">{testimonial[1]?.authorName ?? ""}</p>
                      <p className="text-muted-foreground">{testimonial[1]?.authorDescription ?? ""}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            )}
            {Array.isArray(testimonial) && testimonial.length > 2 && testimonial[2] && (
              <Card>
                <CardContent className="px-6 pt-6 leading-7 text-foreground/70">
                  {testimonial[2].text && (
                    <RichText publicContext={publicContext}
                      content={testimonial[2].text}
                      withWrapper={false}
                      overrideStyle={{ p: '' }}
                    />
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex gap-4 leading-5">
                    {testimonial[2]?.authorAvatar && typeof testimonial[2]?.authorAvatar === "object" && (
                      <Avatar className="size-9 rounded-full ring-1 ring-input">
                        <AvatarImage asChild src={testimonial[2]?.authorAvatar.url!}>
                          <Media
                            imgClassName="h-9 w-full rounded-md object-cover lg:h-auto"
                            resource={testimonial[2]?.authorAvatar}
                          />
                        </AvatarImage>
                      </Avatar>
                    )}
                    <div className="text-sm">
                      <p className="font-medium">{testimonial[2]?.authorName ?? ""}</p>
                      <p className="text-muted-foreground">{testimonial[2]?.authorDescription ?? ""}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            )}
            {Array.isArray(testimonial) && testimonial.length > 3 && testimonial[3] && (
              <Card>
                <CardContent className="px-6 pt-6 leading-7 text-foreground/70">
                  {testimonial[3].text && (
                    <RichText publicContext={publicContext}
                      content={testimonial[3].text}
                      withWrapper={false}
                      overrideStyle={{ p: '' }}
                    />
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex gap-4 leading-5">
                    {testimonial[3]?.authorAvatar && typeof testimonial[3]?.authorAvatar === "object" && (
                      <Avatar className="size-9 rounded-full ring-1 ring-input">
                        <AvatarImage asChild src={testimonial[3]?.authorAvatar.url!}>
                          <Media
                            imgClassName="h-9 w-full rounded-md object-cover lg:h-auto"
                            resource={testimonial[3]?.authorAvatar}
                          />
                        </AvatarImage>
                      </Avatar>
                    )}
                    <div className="text-sm">
                      <p className="font-medium">{testimonial[3]?.authorName ?? ""}</p>
                      <p className="text-muted-foreground">{testimonial[3]?.authorDescription ?? ""}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial4;
