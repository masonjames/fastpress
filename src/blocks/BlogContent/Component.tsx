import { Post } 
import { allPostDesignVersions } from '../../collections/Posts/index'
import { Blog20 } from './blog20'
import { Blog18 } from './blog18'
import { PublicContextProps } from '../../utilities/publicContextProps'

// Extract just the value property from the design versions for use as keys
type PostDesignVersionValue = (typeof allPostDesignVersions)[number]['value']

// Enforce required blog but allow additional ones
type BlogContent<T extends string = string> = Required<Record<PostDesignVersionValue, React.FC<any>>> &
  Record<T, React.FC<any>>

const blog: BlogContent = {
  BLOG18: Blog18,
  BLOG20: Blog20,
}

/**
 * Blog Content is the Blog Detail Page. 
 * @param props 
 * @returns 
 */
export const BlogContentBlock: React.FC<Post & { publicContext: PublicContextProps }> = (props) => {
  if (!props.content) return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const BlogContentToRender = blog[designVersion]

  if (!BlogContentToRender) return null

  return <BlogContentToRender {...props} />
}
