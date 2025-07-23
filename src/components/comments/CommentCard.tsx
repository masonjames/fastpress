import { Id } from "../../../convex/_generated/dataModel";

interface Comment {
  _id: Id<"comments">;
  author: string;
  email: string;
  content: string;
  status: "pending" | "approved" | "spam";
  createdAt: number;
  ipAddress?: string;
  userAgent?: string;
  post?: {
    title: string;
  };
  parentComment?: {
    author: string;
    content: string;
  };
}

interface CommentCardProps {
  comment: Comment;
  onApprove: (commentId: Id<"comments">) => void;
  onMarkSpam: (commentId: Id<"comments">) => void;
  onDelete: (commentId: Id<"comments">) => void;
}

export function CommentCard({ comment, onApprove, onMarkSpam, onDelete }: CommentCardProps) {
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
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
              onClick={() => onApprove(comment._id)}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Approve
            </button>
          )}
          
          {comment.status !== 'spam' && (
            <button
              onClick={() => onMarkSpam(comment._id)}
              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Mark Spam
            </button>
          )}
          
          <button
            onClick={() => onDelete(comment._id)}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}