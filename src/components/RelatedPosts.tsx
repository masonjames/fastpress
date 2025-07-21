import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PostCard } from "./PostCard";

interface RelatedPostsProps {
  currentPostId: string;
  categoryId?: string;
  navigate: (path: string) => void;
}

export function RelatedPosts({ currentPostId, categoryId, navigate }: RelatedPostsProps) {
  const relatedPosts = useQuery(
    api.posts.list, 
    categoryId ? { 
      status: "published", 
      categoryId: categoryId as any, 
      limit: 4 
    } : { 
      status: "published", 
      limit: 4 
    }
  );

  const filteredPosts = relatedPosts?.filter(post => post._id !== currentPostId).slice(0, 3);

  if (!filteredPosts || filteredPosts.length === 0) {
    return null;
  }

  return (
    <section className="border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <PostCard 
            key={post._id} 
            post={post} 
            onClick={() => navigate(`/${post.slug}`)}
          />
        ))}
      </div>
    </section>
  );
}
