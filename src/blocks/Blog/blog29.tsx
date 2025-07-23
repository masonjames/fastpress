import { ArrowUpRightIcon } from 'lucide-react'
import React from 'react'

import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'
import { BlogBlock, Post, Category } 
import { PublicContextProps } from '../../utilities/publicContextProps'
import RichText from '../../components/RichText'
import Link from 'next/link'
import { CMSLink } from '../../components/Link'
import { extractPlainText } from '../../utilities/richtext'

// Extended props interface to include posts array
interface Blog29Props extends BlogBlock {
  publicContext: PublicContextProps
  posts?: Post[] // Add posts property for server-fetched posts
}

// Define a type for sample blog posts
interface SamplePost {
  id: string
  slug: string
  title: string
  content: string
  publishedAt: string
  createdAt: string
  tags: string[]
  readTime?: number
}

/**
 * Format date for display
 */
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

/**
 * Blog29 component for displaying blog posts in a card layout
 */
const Blog29: React.FC<Blog29Props> = (props) => {
  const {
    publicContext,
    richText,
    populateBy = 'collection',
    selectedPosts,
  } = props

  // For compatibility with previous code, map the new structure
  const featuredPosts = populateBy === 'selection' ? selectedPosts : undefined

  // Get posts from props or use sample data if none available
  const posts = React.useMemo(() => {
    // If featuredPosts are provided (from manual selection), use them
    if (featuredPosts && featuredPosts.length > 0) {
      return featuredPosts
        .map((post) => (typeof post === 'string' ? null : post))
        .filter(Boolean) as Post[]
    }

    // If posts were fetched from the server and passed via props, use them
    if (props.posts && Array.isArray(props.posts) && props.posts.length > 0) {
      return props.posts as Post[]
    }
  }, [featuredPosts, props.posts])

  return (
    <section className="bg-background py-16">
      <div className="container">
        {/* Render rich text content if provided */}
        {richText && (
          <RichText
            content={richText}
            publicContext={publicContext}
            overrideStyle={{
              h1: 'mb-10 px-6 text-left text-4xl font-bold tracking-tighter text-foreground sm:text-6xl',
              h2: 'mb-10 px-6 text-left text-4xl font-bold tracking-tighter text-foreground sm:text-6xl',
            }}
          />
        )}

        {/* If no rich text is provided, show a default heading */}
        {!richText && (
          <h1 className="mb-10 px-6 text-left text-4xl font-bold tracking-tighter text-foreground sm:text-6xl">
            Blog
          </h1>
        )}

        <section className="mt-10 space-y-6 md:mt-18">
          {Array.isArray(posts) &&
            posts.map((post, index) => {
              // For real posts from Payload
              const postUrl = post.slug ? `/posts/${post.slug}` : '#'

              // Handle content which might be a string or rich text
              const postContent =
                typeof post.content === 'string' ? post.content : extractPlainText(post.content)

              // Format the date for display
              const postDate = formatDate(post.publishedAt || post.createdAt)

              // Handle categories for Payload posts
              let categories: Category[] = []
              if ('categories' in post && Array.isArray(post.categories)) {
                categories = post.categories
                  .map((cat) => (typeof cat === 'string' ? null : cat))
                  .filter(Boolean) as Category[]
              }

              return (
                <React.Fragment key={post.id || index}>
                  <Card className="border-none shadow-none">
                    <CardContent className="">
                      <div className="relative w-full">
                        <p className="text-sm tracking-tight text-muted-foreground">{postDate}</p>

                        <h2 className="mt-2 text-lg font-medium tracking-tight text-foreground md:text-2xl">
                          {post.title}
                        </h2>

                        <p className="md:text-md mt-4 text-sm text-muted-foreground md:pr-24 xl:pr-32">
                          {postContent}
                        </p>

                        <div className="mt-4 flex w-9/10 flex-wrap items-center gap-2">
                          {/* Show categories for Payload posts */}
                          {categories.length > 0 &&
                            categories.map((category, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="h-6 rounded-md">
                                <span className="text-md font-medium text-muted-foreground">
                                  {category.title}
                                </span>
                              </Badge>
                            ))}

                          {/* Show tags for sample posts */}
                          {'tags' in post &&
                            Array.isArray(post.tags) &&
                            post.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="h-6 rounded-md">
                                <span className="text-md font-medium text-muted-foreground">
                                  {tag}
                                </span>
                              </Badge>
                            ))}

                          {/* Show read time if available */}
                          {post.readTime && (
                            <Badge variant="secondary" className="h-6 rounded-md">
                              <span className="text-md font-medium text-muted-foreground">
                                {post.readTime} min read
                              </span>
                            </Badge>
                          )}
                        </div>

                        {/* Link to post detail page */}
                        <CMSLink url={postUrl} publicContext={publicContext}>
                          <Button
                            variant="secondary"
                            className="absolute -right-3 -bottom-1 flex h-10 w-10 items-center justify-center rounded-full transition-all ease-in-out hover:rotate-45 md:bottom-14"
                          >
                            <ArrowUpRightIcon />
                          </Button>
                        </CMSLink>
                      </div>
                    </CardContent>
                  </Card>

                  {index < posts.length - 1 && <Separator className="h-px w-full" />}
                </React.Fragment>
              )
            })}
        </section>
      </div>
    </section>
  )
}

export { Blog29 }
