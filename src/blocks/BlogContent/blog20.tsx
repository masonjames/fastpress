"use client";

import { Clock, Facebook, Home, Lightbulb, Linkedin, Twitter } from "lucide-react";
import { useEffect, useRef, useState } from "react";


import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DateFormatter } from "@/components/DateFormatter";
import RichText from "@/components/RichText";
import { Media } from "@/components/Media";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utilities";
import { Post } from "@/payload-types";
import { PublicContextProps } from "@/utilities/publicContextProps";
import { getAuthorObject } from "@/utilities/authorUtils";
import { getSideMenuStructure } from "@/utilities/richtext";

const Blog20: React.FC<Post & { publicContext: PublicContextProps }> = (props) => {
  const { title, content, meta, designVersion, authors, readTime, publishedAt, publicContext, bannerImage } = props || {}

  const author = getAuthorObject(authors?.[0])

  const sideMenuStructure = content ? getSideMenuStructure(content, { headlineLevels: ['h2', 'h3'] }) : []

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});

  useEffect(() => {
    const sections = Object.keys(sectionRefs.current);

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    let observer: IntersectionObserver | null = new IntersectionObserver(
      observerCallback,
      {
        root: null,
        rootMargin: "0px",
        threshold: 1,
      },
    );

    sections.forEach((sectionId) => {
      const element = sectionRefs.current[sectionId];
      if (element) {
        observer?.observe(element);
      }
    });

    return () => {
      observer?.disconnect();
      observer = null;
    };
  }, []);

  const addSectionRef = (id: string, ref: HTMLElement | null) => {
    if (ref) {
      sectionRefs.current[id] = ref;
    }
  };
  return (
    <section className="py-32">
      <div className="container">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Blog</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="mt-9 mb-7 max-w-3xl text-4xl font-bold md:mb-10 md:text-7xl">
            {title}
        </h1>
        <div className="flex items-center gap-3 text-sm md:text-base">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src="https://shadcnblocks.com/images/block/avatar-1.webp" />
          </Avatar>
          <span>
            {author && (
              <>
                <a href="#" className="font-medium">
                  {author.name}
                </a>
                {publishedAt && (
                  <span className="ml-1 text-muted-foreground">
                    on <DateFormatter date={publishedAt} locale={publicContext?.locale} />
                  </span>
                )}
              </>
            )}
          </span>
        </div>
        
        {readTime && (
          <span className="flex items-center gap-1 text-muted-foreground mt-2">
            <Clock className="h-4 w-4" />
            {readTime} min. read
          </span>
        )}
        
        <div className="relative mt-12 grid max-w-7xl gap-14 lg:mt-14 lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="order-2 lg:order-none lg:col-span-8">
            {bannerImage && typeof bannerImage !== 'string' && (
              <div className="mb-8 relative aspect-video w-full rounded-lg border overflow-hidden">
                <Media 
                  resource={bannerImage}
                  alt={bannerImage.alt || title || 'Blog banner image'}
                  imgClassName="object-cover"
                />
              </div>
            )}
            {meta?.description && (
              <div className="mb-8">
                <p className="text-sm text-muted-foreground">
                  {meta.description}
                </p>
              </div>
            )}
            
            {content && (
              <div className="prose max-w-none">
                <RichText 
                  content={content} 
                  publicContext={publicContext} 
                  withWrapper={false}
                />
              </div>
            )}
          </div>
          <div className="order-1 flex h-fit flex-col text-sm lg:sticky lg:top-8 lg:order-none lg:col-span-3 lg:col-start-10 lg:text-xs">
            <div className="order-3 lg:order-none">
              <span className="text-xs font-medium">ON THIS PAGE</span>
              <nav className="mt-2 lg:mt-4">
                <ul className="space-y-1">
                  {sideMenuStructure.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={cn(
                          "block py-1 transition-colors duration-200",
                          activeSection === item.id
                            ? "text-muted-foreground lg:text-primary"
                            : "text-muted-foreground hover:text-primary",
                        )}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <Separator className="order-2 mt-8 mb-11 lg:hidden" />
            <div className="order-1 flex flex-col gap-2 lg:order-none lg:mt-9">
              <p className="font-medium text-muted-foreground">
                Share this article:
              </p>
              <ul className="flex gap-2">
                <li>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="group rounded-full"
                  >
                    <a href="#">
                      <Facebook className="h-4 w-4 fill-muted-foreground text-muted-foreground transition-colors group-hover:fill-primary group-hover:text-primary" />
                    </a>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="group rounded-full"
                  >
                    <a href="#">
                      <Linkedin className="h-4 w-4 fill-muted-foreground text-muted-foreground transition-colors group-hover:fill-primary group-hover:text-primary" />
                    </a>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="group rounded-full"
                  >
                    <a href="#">
                      <Twitter className="h-4 w-4 fill-muted-foreground text-muted-foreground transition-colors group-hover:fill-primary group-hover:text-primary" />
                    </a>
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Blog20 };
