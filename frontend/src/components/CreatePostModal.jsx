import { useState } from 'react';
import { MdClose, MdOutlinePhotoLibrary } from 'react-icons/md';
import { BsCameraVideoFill } from 'react-icons/bs';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import './CreatePostModal.css';

function CreatePostModal({ isOpen, onClose, user, onSubmit }) {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // xử lý chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // tạo preview ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // xóa ảnh đã chọn
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // gửi bài post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !selectedImage) {
      alert('Vui lòng nhập nội dung hoặc chọn ảnh');
      return;
    }

    await onSubmit({ content, image: selectedImage });
    // reset form
    setContent('');
    setSelectedImage(null);
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Tạo bài viết</h2>
          <button className="modal-close" onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>

        {/* User info */}
        <div className="modal-user-info">
          <div className="modal-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h4>{user?.name || 'Người dùng'}</h4>
            <select className="privacy-select">
              <option>🌐 Công khai</option>
              <option>👥 Bạn bè</option>
              <option>🔒 Chỉ mình tôi</option>
            </select>
          </div>
        </div>

        {/* Content textarea */}
        <form onSubmit={handleSubmit}>
          <textarea
            className="modal-textarea"
            placeholder={`${user?.name || 'Bạn'} ơi, bạn đang nghĩ gì thế?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />

          {/* Image preview  */}
          {imagePreview && (
            <div className="image-preview-container">
              <button 
                type="button"
                className="remove-image-btn" 
                onClick={handleRemoveImage}
              >
                <MdClose size={20} />
              </button>
              <img src={imagePreview} alt="Preview" className="image-preview" />
            </div>
          )}

          {/* Add to post options */}
          <div className="add-to-post">
            <span>Thêm vào bài viết của bạn</span>
            <div className="add-options">
              <label className="add-option-btn" title="Ảnh/video">
                <MdOutlinePhotoLibrary size={24} color="#45bd62" />
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>
              <button type="button" className="add-option-btn" title="Video trực tiếp">
                <BsCameraVideoFill size={24} color="#f3425f" />
              </button>
              <button type="button" className="add-option-btn" title="Cảm xúc">
                <MdOutlineEmojiEmotions size={24} color="#f7b928" />
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            className="modal-submit-btn"
            disabled={!content.trim()}
          >
            Đăng
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
