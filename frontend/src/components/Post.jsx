import { useState } from 'react';
import { AiOutlineLike, AiFillLike, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { timeAgo } from '../utils/timeAgo';
import './Post.css';

function Post({ post, onLike, onComment }) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  
  // xử lý like
  const handleLike = () => {
    // update UI immidiately để hiệu năng tốt hon
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    
    // gọi API ở background
    if (onLike) {
      onLike(post._id);
    }
  };
  
  // xử lý gửi comment
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    // gọi API thêm comment
    if (onComment) {
      onComment(post._id, commentText);
    }
    
    // xóa input
    setCommentText('');
  };
  
  return (
    <div className="post">
      {/* phần đầu bài post */}
      <div className="post-header">
        <div className="post-user">
          <div className="post-avatar">
            {post.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="post-info">
            <h4>{post.user?.name || 'Người dùng'}</h4>
            <span>{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <button className="post-menu">
          <BsThreeDots />
        </button>
      </div>
      
      {/* nội dung bài post */}
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      
     
      {post.images && post.images.length > 0 && (
        <div className="post-image">
          <img src={`http://localhost:5000${post.images[0]}`} alt="Post" />
        </div>
      )}
      
      {/* thống kê like và comment */}
      <div className="post-stats">
        <span>{likeCount} lượt thích</span>
        <span>{post.comments?.length || 0} bình luận</span>
      </div>
      
      {/* các nút action */}
      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {isLiked ? <AiFillLike /> : <AiOutlineLike />}
          Thích
        </button>
        <button 
          className="action-btn"
          onClick={() => setShowCommentInput(!showCommentInput)}
        >
          <AiOutlineComment />
          Bình luận
        </button>
        <button className="action-btn">
          <AiOutlineShareAlt />
          Chia sẻ
        </button>
      </div>
      
      {/* danh sách comment */}
      {post.comments && post.comments.length > 0 && (
        <div className="post-comments">
          {post.comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <div className="comment-avatar">
                {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="comment-content">
                <div className="comment-bubble">
                  <strong>{comment.user?.name || 'Người dùng'}</strong>
                  <p>{comment.content || comment.text}</p>
                </div>
                <div className="comment-time">
                  {timeAgo(comment.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* ô nhập comment */}
      {showCommentInput && (
        <div className="comment-input-wrapper">
          <div className="comment-avatar">U</div>
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              placeholder="Viết bình luận..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit">Gửi</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Post;
