import { useState } from 'react';
import { Comment } from '../../types/submission';
import NewCommentModal from './NewCommentModal';
import axios from 'axios';

interface DiscussionsProps {
  problemId: number;
  employeeId: string;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const Discussions: React.FC<DiscussionsProps> = ({ problemId, comments, setComments, employeeId }) => {
  const [showNewComment, setShowNewComment] = useState(false);

  const handleAddNewComment = () => {
    setShowNewComment(true);
  };

  const handleCloseNewComment = () => {
    setShowNewComment(false);
  };

  const handlePublishComment = async (newCommentDescription: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/comments`, {
        employee_id: employeeId,
        description: newCommentDescription,
        problem_id: problemId
      });

      const newComment = {
        id: response.data.id,
        userName: response.data.firstName + ' ' + response.data.lastName,
        profilePic: response.data.profilePicture,
        comment: response.data.description,
        postDate: response.data.messageDate,
        employeeId: response.data.employee_id
      };

      setComments((prevComments) => [...prevComments, newComment]);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('There was an error publishing your comment. Please try again.');
    } finally {
      handleCloseNewComment();
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/comments/${commentId}`);
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('There was an error deleting your comment. Please try again.');
    }
  };
  console.log(comments);
  return (
    <div className="bg-white p-6 rounded-lg shadow h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Discussions</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleAddNewComment}
        >
          New Comment
        </button>
      </div>

      {showNewComment && (
        <NewCommentModal
          onClose={handleCloseNewComment}
          onPublish={handlePublishComment}
        />
      )}

      <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-4">
          <img
            src={comment.profilePic}
            alt={comment.userName}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="relative bg-gray-50 rounded-lg pt-4 pb-8 px-4">
              {/* Top: Name and Date */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{comment.userName}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.postDate).toLocaleString()}
                </span>
              </div>

              {/* Comment text */}
              <p className="text-gray-700">{comment.comment}</p>

              {/* Bottom-left delete button */}
              {comment.employeeId === employeeId && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="absolute right-4 bottom-2 flex items-center text-gray-400 hover:text-red-500 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6"
                    />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}


      </div>
    </div>
  );
};

export default Discussions;
