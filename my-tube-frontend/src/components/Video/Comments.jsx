import React, { useState, useEffect } from 'react';

import CommentItem from './CommentItem';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { SmallLoader } from '../Common/Loader.jsx';
import { FiMessageSquare, FiSend } from 'react-icons/fi';

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async (pageNum = 1) => {
    try {
      const response = await getVideoComments(videoId, {
        page: pageNum,
        limit: 10
      });
      
      if (pageNum === 1) {
        setComments(response.data.data.docs);
      } else {
        setComments(prev => [...prev, ...response.data.data.docs]);
      }
      
      setHasMore(response.data.data.hasNextPage);
    } catch (error) {
      toast.error('Failed to load comments');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      const response = await addComment(videoId, newComment);
      setComments(prev => [response.data.data, ...prev]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const response = await updateComment(commentId, editContent);
      setComments(prev => prev.map(comment => 
        comment._id === commentId ? response.data.data : comment
      ));
      setEditingComment(null);
      setEditContent('');
      toast.success('Comment updated');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId, isLiked) => {
    try {
      await likeComment(commentId);
      setComments(prev => prev.map(comment => {
        if (comment._id === commentId) {
          return {
            ...comment,
            isLiked: !isLiked,
            likesCount: isLiked ? comment.likesCount - 1 : comment.likesCount + 1
          };
        }
        return comment;
      }));
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center space-x-2 mb-6">
        <FiMessageSquare className="text-xl" />
        <h2 className="text-xl font-semibold">
          {comments.length} Comments
        </h2>
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex space-x-3">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="2"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiSend />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            Please <a href="/login" className="text-blue-600 hover:underline">login</a> to add comments
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id}>
            {editingComment === comment._id ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-2"
                  rows="3"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateComment(comment._id)}
                    className="btn-primary"
                  >
                    Update
                  </button>
                </div>
              </div>
            ) : (
              <CommentItem
                comment={comment}
                onEdit={startEditing}
                onDelete={handleDeleteComment}
                onLike={handleLikeComment}
                currentUserId={user?._id}
              />
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && comments.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Comments'}
          </button>
        </div>
      )}

      {comments.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <FiMessageSquare className="text-4xl mx-auto mb-4 text-gray-300" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

export default Comments;