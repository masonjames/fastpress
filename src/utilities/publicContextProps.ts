// This is the type of the context props that are passed to the Hero and RenderBlocks component. 
// So do not bloat it with unnecessary properties because it can end up in client components.
export type PublicContextProps = {
  locale: string
  isNotFound: boolean
  cleanSlugs?: string[]
}