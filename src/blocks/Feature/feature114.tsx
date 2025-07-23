"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import {
  Globe,
  MessagesSquare,
  MoveRight,
  PanelsTopLeft,
  PenTool,
  ScissorsLineDashed,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Icon } from "@/components/Icon";
import { CMSLink } from "@/components/Link";
import RichText from "@/components/RichText";
import { FeatureBlock } from "@/payload-types";
import { PublicContextProps } from "@/utilities/publicContextProps";
import React from "react";
import { Media } from "@/components/Media";

// Fallback features if no USPs are provided
const fallbackFeatures = [
  {
    title: "Pixel-Perfect",
    description: "Begin our journey to build outstanding websites.",
    icon: <ScissorsLineDashed className="h-auto w-8 md:w-12" />,
  },
  {
    title: "SEO Optimized",
    description: "We ensure that your website ranks high on Google.",
    icon: <Globe className="h-auto w-8 md:w-12" />,
  },
  {
    title: "Responsive",
    description: "Our websites look great on any device.",
    icon: <PanelsTopLeft className="h-auto w-8 md:w-12" />,
  },
  {
    title: "Customizable",
    description: "We can tailor your website to your needs.",
    icon: <PenTool className="h-auto w-8 md:w-12" />,
  },
  {
    title: "Fast Loading",
    description: "We ensure that your website loads quickly.",
    icon: <Zap className="h-auto w-8 md:w-12" />,
  },
  {
    title: "Secure",
    description: "We take security seriously. Your data is safe with us.",
    icon: <ShieldCheck className="h-auto w-8 md:w-12" />,
  },
  {
    title: "24/7 Support",
    description: "We are always here to help you. Reach out to us.",
    icon: <MessagesSquare className="h-auto w-8 md:w-12" />,
  },
  {
    title: "User-Friendly",
    description: "We make sure that your website is easy to use.",
    icon: <Users className="h-auto w-8 md:w-12" />,
  },
];

// Default icon mapping for common feature names
const defaultIconMap: Record<string, React.ReactNode> = {
  "Pixel-Perfect": <ScissorsLineDashed className="h-auto w-8 md:w-12" />,
  "SEO Optimized": <Globe className="h-auto w-8 md:w-12" />,
  "Responsive": <PanelsTopLeft className="h-auto w-8 md:w-12" />,
  "Customizable": <PenTool className="h-auto w-8 md:w-12" />,
  "Fast Loading": <Zap className="h-auto w-8 md:w-12" />,
  "Secure": <ShieldCheck className="h-auto w-8 md:w-12" />,
  "Support": <MessagesSquare className="h-auto w-8 md:w-12" />,
  "User-Friendly": <Users className="h-auto w-8 md:w-12" />,
};

const Feature114: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({ 
  richText, 
  USPs, 
  links, 
  publicContext,
  images,
  metrics,
}) => {
  // Use USPs from CMS or fallback to hardcoded features
  const features = USPs?.length ? USPs.map((usp, index) => {
    // Extract title from richText if available
    const title = usp.tagline || `Feature ${index + 1}`;
    
    // Extract description from richText if available
    const description = usp.richText?.root?.children?.[0]?.children?.[0]?.text || "";
    
    // Use custom icon if provided, or try to find a default icon, or use the first default icon
    let iconElement: React.ReactNode;
    if (usp.uspIcon) {
      iconElement = <Icon icon={usp.uspIcon} className="h-auto w-8 md:w-12" />;
    } else {
      iconElement = defaultIconMap[title] || fallbackFeatures[0].icon;
    }
    
    return {
      title,
      description,
      icon: iconElement,
      link: usp.link,
    };
  }) : fallbackFeatures;

  return (
    <section className="py-32">
      <div className="container">
        <div className="grid items-center gap-20 md:grid-cols-2">
          <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
            <span className="inline-flex items-center -space-x-4">
              {images && images.length > 0 ? (
                images.slice(0, 3).map((image, index) => (
                  <Avatar key={index} className="size-11 border lg:size-16">
                    <Media
                      resource={image}
                      imgClassName="h-full w-full object-cover"
                      alt={`Team member ${index + 1}`}
                    />
                  </Avatar>
                ))
              ) : (
                <>
                  <Avatar className="size-11 border lg:size-16">
                    <AvatarImage
                      src="https://shadcnblocks.com/images/block/avatar-1.webp"
                      alt="placeholder"
                    />
                  </Avatar>
                  <Avatar className="size-11 border lg:size-16">
                    <AvatarImage
                      src="https://shadcnblocks.com/images/block/avatar-6.webp"
                      alt="placeholder"
                    />
                  </Avatar>
                  <Avatar className="size-11 border lg:size-16">
                    <AvatarImage
                      src="https://shadcnblocks.com/images/block/avatar-3.webp"
                      alt="placeholder"
                    />
                  </Avatar>
                </>
              )}
            </span>
            
            {richText ? (
              <RichText 
                publicContext={publicContext}
                content={richText}
                withWrapper={false}
                overrideStyle={{
                  h1: 'text-3xl font-semibold md:text-5xl',
                  h2: 'text-3xl font-semibold md:text-5xl',
                  p: 'text-muted-foreground md:text-lg',
                }}
              />
            ) : (
              <>
                <h1 className="text-3xl font-semibold md:text-5xl">
                  Explore New Frontiers in Digital Innovation with Us
                </h1>
                <p className="text-muted-foreground md:text-lg">
                  Join our journey to craft highly optimized web experiences.
                </p>
              </>
            )}
            
            {links && links.length > 0 && (
              links.map((linkItem, index) => (
                <CMSLink
                  key={index}
                  publicContext={publicContext}
                  {...linkItem.link}
                  className="w-fit gap-2"
                  iconAfter={linkItem.link.iconAfter || "move-right"}
                  size="lg"
                />
              ))
            )}
            
            <div className="grid grid-cols-2 justify-between gap-4 pt-10 text-left md:gap-20">
              {metrics && metrics.length > 0 && (
                metrics.slice(0, 2).map((metric, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <h2 className="text-3xl font-semibold md:text-5xl">{metric.title}</h2>
                    <p className="text-muted-foreground md:text-lg">
                      {metric.subline}
                    </p>
                  </div>
                ))
              ) }
            </div>
          </div>
          <div className="grid gap-4 md:gap-7 lg:grid-cols-2">
            <Carousel
              opts={{
                loop: true,
                align: "start",
              }}
              plugins={[
                AutoScroll({
                  speed: 0.7,
                }),
              ]}
              orientation="vertical"
              className="pointer-events-none relative lg:hidden"
            >
              <CarouselContent className="max-h-[600px]">
                {features.map((feature, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-col rounded-xl border p-5 md:p-7">
                      {feature.icon}
                      <h3 className="mt-5 mb-2.5 font-semibold md:text-xl">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground md:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background"></div>
            </Carousel>
            <Carousel
              opts={{
                loop: true,
                align: "start",
              }}
              plugins={[
                AutoScroll({
                  speed: 0.7,
                }),
              ]}
              orientation="vertical"
              className="pointer-events-none relative hidden lg:block"
            >
              <CarouselContent className="max-h-[600px]">
                {features
                  .slice(0, Math.ceil(features.length / 2))
                  .map((feature, index) => (
                    <CarouselItem key={index}>
                      <div className="flex flex-col rounded-xl border p-4 md:p-7">
                        {feature.icon}
                        <h3 className="mt-5 mb-2.5 font-semibold md:text-xl">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground md:text-base">
                          {feature.description}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background"></div>
            </Carousel>
            <Carousel
              opts={{
                loop: true,
                align: "start",
              }}
              plugins={[
                AutoScroll({
                  speed: 0.7,
                }),
              ]}
              orientation="vertical"
              className="pointer-events-none relative hidden lg:block"
            >
              <CarouselContent className="max-h-[600px]">
                {features.slice(Math.ceil(features.length / 2)).map((feature, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-col rounded-xl border p-4 md:p-7">
                      {feature.icon}
                      <h3 className="mt-5 mb-2.5 font-semibold md:text-xl">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground md:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background"></div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature114;
