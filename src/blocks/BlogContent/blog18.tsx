'use client'

import { useEffect, useState, useMemo } from 'react'

import {
  ArrowUp,
  Clock,
  Facebook,
  Home,
  Instagram,
  Lightbulb,
  Linkedin,
  Twitter,
} from 'lucide-react'

import { cn } from '@/utilities'
import { DateFormatter } from '@/components/DateFormatter'
import RichText from '@/components/RichText'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Post } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { getAuthorObject } from '@/utilities/authorUtils'
import { getSideMenuStructure } from '@/utilities/richtext'

const Blog18: React.FC<Post & { publicContext: PublicContextProps }> = (props) => {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const { title, content, meta, readTime, publishedAt, authors, publicContext } = props || {}

  const author = getAuthorObject(authors?.[0])
  // Get side menu structure from content if it exists
  const sideMenuStructure = useMemo(() => {
    return content ? getSideMenuStructure(content, { headlineLevels: ['h2', 'h3'] }) : []
  }, [content])

  useEffect(() => {
    // Only set up observer if we have side menu items
    if (sideMenuStructure.length === 0) return

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    let observer: IntersectionObserver | null = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.2, // Lower threshold to detect headings earlier
    })

    // Observe all heading elements from our side menu structure
    sideMenuStructure.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer?.observe(element)
      }
    })

    return () => {
      observer?.disconnect()
      observer = null
    }
  }, [sideMenuStructure])

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
        <h1 className="mt-7 mb-6 max-w-3xl text-3xl font-semibold md:text-5xl">{title}</h1>
        <div className="flex items-center gap-3 text-sm">
          {author && (
            <>
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="https://shadcnblocks.com/images/block/avatar-1.webp" />
              </Avatar>
              <span>
                <a href="#" className="font-medium">
                  {author.name}
                </a>
                {publishedAt && (
                  <span className="ml-1 text-muted-foreground">
                    on <DateFormatter date={publishedAt} locale={publicContext?.locale} />
                  </span>
                )}
              </span>
            </>
          )}

          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {readTime} min. read
          </span>
        </div>
        <Separator className="mt-8 mb-16" />
        <div className="relative grid grid-cols-12 gap-6 lg:grid">
          <div className="col-span-12 lg:col-span-8">
            {content && (
              <div className="prose max-w-none">
                <RichText
                  content={content}
                  publicContext={props.publicContext}
                  withWrapper={false}
                />
              </div>
            )}
          </div>
          <div className="sticky top-8 col-span-3 col-start-10 hidden h-fit lg:block">
            {sideMenuStructure.length > 0 && (
              <>
                <span className="text-lg font-medium">On this page</span>
                <nav className="mt-4 text-sm">
                  <ul className="space-y-1">
                    {sideMenuStructure.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={cn(
                            'block py-1 transition-colors duration-200',
                            // Add padding based on heading level for visual hierarchy
                            item.level === 'h3' && 'pl-3',
                            item.level === 'h4' && 'pl-5',
                            activeSection === item.id
                              ? 'text-primary'
                              : 'text-muted-foreground hover:text-primary',
                          )}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </>
            )}
            <Separator className="my-6" />
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Share this article</p>
              <ul className="flex gap-2">
                <li>
                  <a
                    href="#"
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }
              >
                <ArrowUp className="h-4 w-4" />
                Back to top
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Blog18 }
