import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { CommentForm } from "./CommentForm";
import { LoadingState } from "./LoadingSpinner";

interface CommentListProps {
  postId: Id<"posts">;
}

interface CommentWithReplies {
  _id: Id<"comments">;
  author: string;
  email: string;
  content: string;
  createdAt: number;
  replies: CommentWithReplies[];
}

interface CommentItemProps {
  comment: CommentWithReplies;
  postId: Id<"posts">;
  depth?: number;
}

function CommentItem({ comment, postId, depth = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const maxDepth = 3; // Limit nesting to avoid UI issues
  const canReply = depth < maxDepth;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getAvatarColor = (email: string) => {
    // Generate consistent color based on email
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500",
      "bg-yellow-500", "bg-indigo-500", "bg-red-500", "bg-gray-500"
    ];
    const index = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const handleReplySubmit = () => {
    setShowReplyForm(false);
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="bg-white rounded-lg border p-4 mb-4">
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${getAvatarColor(comment.email)} flex items-center justify-center`}>
            <span className="text-white text-sm font-medium">
              {comment.author.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-medium text-gray-900">{comment.author}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              
              {comment.replies.length > 0 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {isExpanded ? "Hide" : "Show"} {comment.replies.length} repl{comment.replies.length !== 1 ? 'ies' : 'y'}
                </button>
              )}
            </div>

            {/* Content */}
            <div className="text-gray-800 whitespace-pre-wrap mb-3">
              {comment.content}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {canReply && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  {showReplyForm ? "Cancel Reply" : "Reply"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 ml-11">
            <CommentForm
              postId={postId}
              parentId={comment._id}
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplyForm(false)}
              placeholder={`Reply to ${comment.author}...`}
              buttonText="Post Reply"
            />
          </div>
        )}
      </div>

      {/* Replies */}
      {isExpanded && comment.replies.length > 0 && (
        <div className="space-y-0">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentList({ postId }: CommentListProps) {
  const comments = useQuery(api.comments.listForPost, { postId, limit: 100 });
  const commentCount = useQuery(api.comments.getCommentCount, { postId });

  if (comments === undefined) {
    return <LoadingState message="Loading comments..." />;
  }

  const totalComments = commentCount || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({totalComments})
        </h2>
        {totalComments > 0 && (
          <p className="text-gray-600 mt-1">
            Join the conversation! All comments are moderated.
          </p>
        )}
      </div>

      {/* Comment Form */}
      <CommentForm postId={postId} />

      {/* Comments */}
      {comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium mb-2">No comments yet</h3>
            <p>Be the first to share your thoughts!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-0">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={postId}
              depth={0}
            />
          ))}
        </div>
      )}

      {/* Load More (for future pagination) */}
      {comments.length >= 100 && (
        <div className="text-center pt-6 border-t">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Load More Comments
          </button>
        </div>
      )}
    </div>
  );
}