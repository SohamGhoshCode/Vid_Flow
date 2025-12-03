import React, { useState } from 'react';
import moment from 'moment';
import { FiThumbsUp, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { toast } from 'react-toastify';

const CommentItem = ({ comment, onEdit, onDelete, onLike, currentUserId }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [liked, setLiked] = useState(comment.isLiked);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(newLiked ? likesCount + 1 : likesCount - 1);
    if (onLike) {
      onLike(comment._id, !newLiked);
    }
  };

  const handleEdit = () => {
    setShowOptions(false);
    if (onEdit) {
      onEdit(comment);
    }
  };

  const handleDelete = () => {
    setShowOptions(false);
    if (window.confirm('Are you sure you want to delete this comment?')) {
      if (onDelete) {
        onDelete(comment._id);
      }
    }
  };

  const isOwner = currentUserId === comment.owner?._id;

  return (
    <div className="flex space-x-3 group">
      <img
        src={comment.owner?.avatar}
        alt={comment.owner?.username}
        className="w-10 h-10 rounded-full flex-shrink-0"
      />
      
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-sm">
                {comment.owner?.fullName}
              </h4>
              <p className="text-xs text-gray-500">
                {moment(comment.createdAt).fromNow()}
              </p>
            </div>
            
            {(isOwner || currentUserId) && (
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-1 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiMoreVertical className="text-gray-500" />
                </button>
                
                {showOptions && (
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border py-1 z-10">
                    {isOwner && (
                      <>
                        <button
                          onClick={handleEdit}
                          className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          <FiEdit2 className="mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={handleDelete}
                          className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
                        >
                          <FiTrash2 className="mr-2" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-2 ml-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 text-sm ${
              liked ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiThumbsUp />
            <span>{likesCount}</span>
          </button>
          
          <button className="text-sm text-gray-500 hover:text-gray-700">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;