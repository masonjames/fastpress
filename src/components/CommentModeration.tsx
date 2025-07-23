import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { LoadingState } from "./LoadingSpinner";
import { CommentCard } from "./comments/CommentCard";

export function CommentModeration() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam'>('all');
  
  const comments = useQuery(api.comments.listForAdmin, { 
    status: filter === 'all' ? undefined : filter as any,
    limit: 100 
  });
  
  const approveComment = useMutation(api.comments.approve);
  const markSpamComment = useMutation(api.comments.markSpam);
  const deleteComment = useMutation(api.comments.remove);

  const handleApprove = async (commentId: Id<"comments">) => {
    try {
      await approveComment({ commentId });
      toast.success("Comment approved");
    } catch (error) {
      toast.error("Failed to approve comment");
      console.error(error);
    }
  };

  const handleMarkSpam = async (commentId: Id<"comments">) => {
    try {
      await markSpamComment({ commentId });
      toast.success("Comment marked as spam");
    } catch (error) {
      toast.error("Failed to mark comment as spam");
      console.error(error);
    }
  };

  const handleDelete = async (commentId: Id<"comments">) => {
    if (!confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteComment({ commentId });
      toast.success("Comment deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete comment");
      console.error(error);
    }
  };


  if (comments === undefined) {
    return <LoadingState message="Loading comments..." />;
  }

  const pendingCount = comments.filter(c => c.status === 'pending').length;
  const approvedCount = comments.filter(c => c.status === 'approved').length;
  const spamCount = comments.filter(c => c.status === 'spam').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">{comments.length}</div>
          <div className="text-sm text-gray-600">Total Comments</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-red-600">{spamCount}</div>
          <div className="text-sm text-gray-600">Spam</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Comment Moderation</h2>
          
          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-sm font-medium text-gray-700">
              Filter:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Comments</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="spam">Spam</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium mb-2">No comments found</h3>
              <p>Comments will appear here when users submit them.</p>
            </div>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onApprove={handleApprove}
              onMarkSpam={handleMarkSpam}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Bulk Actions (for future enhancement) */}
      {comments.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600">
            Showing {comments.length} comments. {pendingCount > 0 && (
              <span className="font-medium text-yellow-600">
                {pendingCount} need{pendingCount !== 1 ? '' : 's'} your review.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}