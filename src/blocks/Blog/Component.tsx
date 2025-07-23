import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { allBlogDesignVersions } from './config'
import { Blog29 } from './blog29'
import { Post, Category } 
import { PublicContextProps } from '../../utilities/publicContextProps'

// Extract just the value property from the design versions for use as keys
type BlogDesignVersionValue = (typeof allBlogDesignVersions)[number]['value']

// Enforce required blog but allow additional ones
type BlogContent<T extends string = string> = Required<Record<BlogDesignVersionValue, React.FC<any>>> &
  Record<T, React.FC<any>>

// Blog block props interface
export interface BlogBlockProps {
  designVersion: BlogDesignVersionValue
  populateBy?: 'collection' | 'selection'
  postCollection?: string
  selectedPosts?: (string | Post)[]
  limit?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  categories?: (string | Category)[]
  richText?: any
  link?: any
  publicContext: PublicContextProps
}

const blog: BlogContent = {
  BLOG29: Blog29,
}

/**
 * Blog Overview / List components
 * Renders different blog designs based on the designVersion
 * Supports configurable collection source, sort options, and filtering
 * @returns 
 */
export const BlogBlock: React.FC<BlogBlockProps> = async (props) => {
  const { 
    designVersion, 
    populateBy = 'collection',
    selectedPosts,
    postCollection = 'posts',
    limit = 3, 
    sortField = 'publishedAt',
    sortOrder = 'desc',
    categories,
  } = props || {}
  
  // Initialize posts array
  let posts: Post[] = []
  
  // Fetch posts based on populateBy approach
  if (populateBy === 'collection') {
    // Fetch posts from collection with filters
    const payload = await getPayload({ config: configPromise })
    
    // Flatten categories for query
    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      return category
    })
    
    // Fetch posts from the API
    try {
      // Prepare sort parameter for Payload API
      // Payload expects a string in the format 'field' or '-field' for descending
      const sortString = sortOrder === 'desc' ? `-${sortField}` : sortField;
      
      const fetchedPosts = await payload.find({
        collection: postCollection as 'posts', // Type assertion to handle collection slug
        depth: 1,
        limit,
        sort: sortString,
        ...(flattenedCategories && flattenedCategories.length > 0
          ? {
              where: {
                categories: {
                  in: flattenedCategories,
                },
              },
            }
          : {}),
      })
      
      // Type assertion to ensure we're working with Post objects
      posts = fetchedPosts.docs as Post[]
    } catch (error) {
      console.error('Error fetching posts:', error)
      posts = [] // Fallback to empty array if fetch fails
    }
  } else if (populateBy === 'selection' && selectedPosts?.length) {
    // Use manually selected posts
    posts = selectedPosts
      .map(post => typeof post === 'object' ? post : null)
      .filter(Boolean) as Post[]
  }
  
  if (!designVersion) return null

  const BlogContentToRender = blog[designVersion]

  if (!BlogContentToRender) return null

  // Pass all props including the fetched posts to the blog component
  return <BlogContentToRender {...props} posts={posts} />
}
