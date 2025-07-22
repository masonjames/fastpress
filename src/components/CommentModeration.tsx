import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { LoadingState } from "./LoadingSpinner";

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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'spam':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <div key={comment._id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="font-medium text-gray-900">{comment.author}</div>
                    <div className="text-sm text-gray-500">{comment.email}</div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(comment.status)}`}>
                      {comment.status}
                    </span>
                    <div className="text-sm text-gray-500">{formatDate(comment.createdAt)}</div>
                  </div>

                  {/* Post Context */}
                  {comment.post && (
                    <div className="mb-3 p-2 bg-gray-50 rounded">
                      <div className="text-sm text-gray-600">
                        On post: <span className="font-medium">{comment.post.title}</span>
                      </div>
                    </div>
                  )}

                  {/* Parent Comment Context */}
                  {comment.parentComment && (
                    <div className="mb-3 p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                      <div className="text-sm text-gray-600">
                        Reply to: <span className="font-medium">{comment.parentComment.author}</span>
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        "{comment.parentComment.content.substring(0, 100)}..."
                      </div>
                    </div>
                  )}

                  {/* Comment Content */}
                  <div className="text-gray-800 whitespace-pre-wrap mb-4 p-3 bg-gray-50 rounded">
                    {comment.content}
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-gray-500">
                    {comment.ipAddress && <span>IP: {comment.ipAddress} • </span>}
                    {comment.userAgent && <span>User Agent: {comment.userAgent.substring(0, 50)}...</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  {comment.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(comment._id)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Approve
                    </button>
                  )}
                  
                  {comment.status !== 'spam' && (
                    <button
                      onClick={() => handleMarkSpam(comment._id)}
                      className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                      Mark Spam
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
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