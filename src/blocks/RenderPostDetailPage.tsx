import { BlogContentBlock } from "./BlogContent/Component"

// FastPress post type (simplified)
interface Post {
  [key: string]: any
}

export const RenderPostDetailPage: React.FC<{
  post: Post
  disableContainer?: boolean
}> = (props) => {
  return (
    <BlogContentBlock {...props.post} disableContainer={props.disableContainer} />
  )
}