import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import postApi from '../../api/postApi';
import Post from '../../components/Post';
import { 
  AiOutlineHome, 
  AiFillHome,
  AiOutlineShop,
  AiOutlinePlus,
  AiOutlineBell,
  AiOutlineMessage,
  AiOutlineSearch,
  AiOutlineMore,
  AiOutlineLike,
  AiOutlineComment,
  AiOutlineShareAlt,
  AiOutlineSetting
} from 'react-icons/ai';
import { 
  MdOndemandVideo, 
  MdOutlinePhotoLibrary,
  MdOutlineEmojiEmotions,
  MdGroups
} from 'react-icons/md';
import { 
  BsCameraVideoFill,
  BsThreeDots,
  BsMoon,
  BsSun
} from 'react-icons/bs';
import { 
  HiUserGroup 
} from 'react-icons/hi';
import { 
  IoGameController 
} from 'react-icons/io5';
import { 
  SiMeta 
} from 'react-icons/si';
import './Home.css';

function Home() {
  const [showMessenger, setShowMessenger] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  // state cho posts
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  
  const { user, logout } = useAuth();
  
  // lấy danh sách bài post khi vào trang
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    try {
      const response = await postApi.getPosts();
      // Backend trả về  success, count, data , lấy array từ data
      setPosts(response.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy bài post:', error);
      setPosts([]); // Set empty array nếu lỗi
    } finally {
      setLoading(false);
    }
  };
  
  // tạo bài post mới
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    
    try {
      const response = await postApi.createPost({ content: postContent });
      // Backend trả về success, message, data  lấy post từ data
      const newPost = response.data;
      // thêm bài mới vào đầu danh sách
      setPosts([newPost, ...posts]);
      setPostContent('');
    } catch (error) {
      console.error('Lỗi khi tạo bài:', error);
      alert('Không thể đăng bài. Vui lòng thử lại.');
    }
  };
  
  // xử lý like
  const handleLike = async (postId) => {
    try {
      await postApi.likePost(postId);
      // cập nhật lại danh sách sau khi like
      fetchPosts();
    } catch (error) {
      console.error('Lỗi khi like:', error);
    }
  };
  
  // xử lý comment
  const handleComment = async (postId, text) => {
    try {
      await postApi.commentPost(postId, { content: text });
      // cập nhật lại danh sách sau khi comment
      fetchPosts();
    } catch (error) {
      console.error('Lỗi khi comment:', error);
    }
  };
  
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // sample
  const messages = [
    { id: 1, name: 'Nhóm đoàn kết', avatar: '💬', message: 'Nguyệt: Mọi người ơi nhóm m...', time: '10 giờ', online: true },
    { id: 2, name: 'Hà nội sớm', avatar: 'T', message: 'Chính: Mai đi bơi', time: '11 giờ', online: false },
    { id: 3, name: 'Hoàn Cường', avatar: 'C', message: 'Bạn: mấy giờ qua', time: '12 giờ', online: true },
    { id: 4, name: 'Anh Đức', avatar: 'N', message: 'Bạn: này t bận gọi điện', time: '13 giờ', online: false },
    { id: 5, name: 'My Bùi', avatar: 'M', message: 'Đã gửi tỏ cảm xúc 👍 về tin n...', time: '14 giờ', online: false }
  ];

  // sample noti
  const notifications = [
    { id: 1, type: 'job', icon: '💼', title: 'Việc làm IT', message: 'Chào mừng bạn đến với Việc làm IT. Giờ bạn có thể đăng bài, kết nối với các thành viên khác và h...', time: '12 giờ', unread: true },
    { id: 2, type: 'job', icon: '🖼️', title: 'Tin mới', message: 'Chào mừng bạn đến với Tin mới Giờ bạn có thể đăng bài, kết nối với các thành...', time: '11 giờ', unread: true },
    { id: 3, type: 'job', icon: '🖼️', title: 'Sơn', message: 'đã chia sẻ 1 bài viết mà bạn có thể quan tâm', time: '11 giờ', unread: true },
    { id: 4, type: 'job', icon: '🖼️', title: 'TTGshop', message: 'Tháng 11 này, chương trình khuyến mãi ...', time: '11 giờ', unread: false }
  ];

  return (
    <div className="home" data-theme={darkMode ? 'dark' : 'light'}>
      {/* Header - Top navigation */}
      <header className="home-header">
        <div className="header-left">
          <div className="fb-logo">facebook</div>
          <div className="search-box">
            <AiOutlineSearch className="search-icon" />
            <input type="text" placeholder="Tìm kiếm trên Facebook" />
          </div>
        </div>
        
        <div className="header-center">
          <div className="header-icon active">
            <AiFillHome size={24} />
          </div>
          <div className="header-icon">
            <MdOndemandVideo size={24} />
          </div>
          <div className="header-icon">
            <AiOutlineShop size={24} />
          </div>
          <div className="header-icon">
            <HiUserGroup size={24} />
          </div>
          <div className="header-icon">
            <IoGameController size={24} />
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-icon">
            <MdGroups size={20} />
          </div>
          
          {/* Messenger Dropdown */}
          <div className="dropdown-wrapper">
            <div 
              className="header-icon"
              onClick={() => {
                setShowMessenger(!showMessenger);
                setShowNotifications(false);
              }}
            >
              <AiOutlineMessage size={20} />
              <span className="badge">5</span>
            </div>
            
            {showMessenger && (
              <div className="dropdown messenger-dropdown">
                <div className="dropdown-header">
                  <h2>Đoạn chat</h2>
                  <div className="dropdown-actions">
                    <button className="action-icon">⋯</button>
                    <button className="action-icon">🎬</button>
                    <button className="action-icon">✏️</button>
                  </div>
                </div>
                
                <div className="dropdown-tabs">
                  <button className="tab active">Tất cả</button>
                  <button className="tab">Chưa đọc</button>
                  <button className="tab">Nhóm</button>
                </div>
                
                <div className="dropdown-search">
                  <AiOutlineSearch />
                  <input type="text" placeholder="Tìm kiếm trên Messenger" />
                </div>
                
                <div className="dropdown-list">
                  {messages.map(msg => (
                    <div key={msg.id} className="message-item">
                      <div className="message-avatar">
                        {msg.avatar}
                        {msg.online && <span className="online-dot"></span>}
                      </div>
                      <div className="message-content">
                        <h4>{msg.name}</h4>
                        <p>{msg.message} · {msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="dropdown-footer">
                  <a href="#">Xem tất cả trong Messenger</a>
                </div>
              </div>
            )}
          </div>
          
          {/* Notifications Dropdown */}
          <div className="dropdown-wrapper">
            <div 
              className="header-icon"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowMessenger(false);
              }}
            >
              <AiOutlineBell size={20} />
              <span className="badge">7</span>
            </div>
            
            {showNotifications && (
              <div className="dropdown notifications-dropdown">
                <div className="dropdown-header">
                  <h2>Thông báo</h2>
                  <button className="action-icon">⋯</button>
                </div>
                
                <div className="dropdown-tabs">
                  <button className="tab active">Tất cả</button>
                  <button className="tab">Chưa đọc</button>
                </div>
                
                <div className="notification-section">
                  <h3>Hôm nay</h3>
                  {notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                      <div className="notification-icon">{notif.icon}</div>
                      <div className="notification-content">
                        <p>
                          <strong>{notif.title}</strong> {notif.message}
                        </p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                      {notif.unread && <span className="unread-dot"></span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Settings Dropdown */}
          <div className="dropdown-wrapper">
            <div 
              className="user-avatar"
              onClick={() => {
                setShowSettings(!showSettings);
                setShowMessenger(false);
                setShowNotifications(false);
              }}
            >
              B
            </div>
            
            {showSettings && (
              <div className="dropdown settings-dropdown">
                <div className="settings-item">
                  <div className="user-avatar small">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="settings-info">
                    <h4>{user?.name || 'Người dùng'}</h4>
                    <p>Xem trang cá nhân của bạn</p>
                  </div>
                </div>
                
                <div className="settings-divider"></div>
                
                <div className="settings-item">
                  <div className="settings-icon">
                    {darkMode ? <BsMoon size={20} /> : <BsSun size={20} />}
                  </div>
                  <div className="settings-info">
                    <h4>Màn hình và trợ năng</h4>
                    <p>Điều chỉnh giao diện Facebook để giảm độ chói và cho đôi mắt được nghỉ ngơi.</p>
                  </div>
                </div>
                
                <div className="theme-options">
                  <div 
                    className={`theme-option ${!darkMode ? 'active' : ''}`}
                    onClick={() => {
                      setDarkMode(false);
                    }}
                  >
                    <input 
                      type="radio" 
                      name="theme" 
                      checked={!darkMode} 
                      onChange={() => setDarkMode(false)}
                    />
                    <label>
                      <strong>Tắt</strong>
                      <p>Màu sáng</p>
                    </label>
                  </div>
                  
                  <div 
                    className={`theme-option ${darkMode ? 'active' : ''}`}
                    onClick={() => {
                      setDarkMode(true);
                    }}
                  >
                    <input 
                      type="radio" 
                      name="theme" 
                      checked={darkMode} 
                      onChange={() => setDarkMode(true)}
                    />
                    <label>
                      <strong>Bật</strong>
                      <p>Màu tối</p>
                    </label>
                  </div>
                  
                  <div className="theme-option">
                    <input type="radio" name="theme" />
                    <label>
                      <strong>Tự động</strong>
                      <p>Tự động điều chỉnh theo thiết bị</p>
                    </label>
                  </div>
                </div>
                
                <div className="settings-divider"></div>
                
                <div className="settings-item clickable">
                  <div className="settings-icon">
                    <AiOutlineSetting size={20} />
                  </div>
                  <div className="settings-info">
                    <h4>Cài đặt & quyền riêng tư</h4>
                  </div>
                </div>
                
                <div className="settings-item clickable">
                  <div className="settings-icon">❓</div>
                  <div className="settings-info">
                    <h4>Trợ giúp & hỗ trợ</h4>
                  </div>
                </div>
                
                <div className="settings-item clickable logout" onClick={handleLogout}>
                  <div className="settings-icon">🚪</div>
                  <div className="settings-info">
                    <h4>Đăng xuất</h4>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="home-content">
        {/* Sidebar trái */}
        <aside className="sidebar-left">
          <div className="sidebar-item">
            <div className="user-avatar small">B</div>
            <span>Bùi Quốc Bình</span>
          </div>
          <div className="sidebar-item">
            <HiUserGroup size={36} color="#2e89ff" />
            <span>Bạn bè</span>
          </div>
          <div className="sidebar-item">
            <MdGroups size={36} color="#2e89ff" />
            <span>Nhóm</span>
          </div>
          <div className="sidebar-item">
            <AiOutlineShop size={36} color="#2e89ff" />
            <span>Marketplace</span>
          </div>
          <div className="sidebar-item">
            <MdOndemandVideo size={36} color="#2e89ff" />
            <span>Watch</span>
          </div>
          <div className="sidebar-item">
            <IoGameController size={36} color="#2e89ff" />
            <span>Gaming</span>
          </div>
          <div className="sidebar-item">
            <AiOutlineMore size={36} />
            <span>Xem thêm</span>
          </div>
        </aside>

        {/* Feed giữa */}
        <main className="main-feed">
          {/* Create Post Box */}
          <div className="create-post">
            <form onSubmit={handleCreatePost}>
              <div className="create-post-top">
                <div className="user-avatar small">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <input 
                  type="text" 
                  placeholder={`${user?.name || 'Bạn'} ơi, bạn đang nghĩ gì thế?`}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>
              <div className="create-post-bottom">
                <button type="button" className="post-option">
                  <BsCameraVideoFill size={24} color="#f3425f" />
                  <span>Video trực tiếp</span>
                </button>
                <button type="button" className="post-option">
                  <MdOutlinePhotoLibrary size={24} color="#45bd62" />
                  <span>Ảnh/video</span>
                </button>
                <button type="button" className="post-option">
                  <MdOutlineEmojiEmotions size={24} color="#f7b928" />
                  <span>Cảm xúc/Hoạt động</span>
                </button>
              </div>
            </form>
          </div>

          {/* Posts - Hiển thị các bài viết */}
          {loading ? (
            <div className="loading">Đang tải bài viết...</div>
          ) : posts.length === 0 ? (
            <div className="no-posts">Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!</div>
          ) : (
            <div className="posts">
              {posts.map(post => (
                <Post 
                  key={post._id} 
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))}
            </div>
          )}

          {/* Bài viết mẫu cũ - XÓA PHẦN NÀY */}
          <div className="posts-old" style={{display: 'none'}}>
            {/* Post 1 - Mẫu */}
            <div className="post">
              <div className="post-header">
                <div className="post-user">
                  <div className="user-avatar small">T</div>
                  <div className="post-user-info">
                    <h4>TTGshop</h4>
                    <span>9 phút · 🌐</span>
                  </div>
                </div>
                <button className="post-menu">
                  <BsThreeDots size={20} />
                </button>
              </div>

              <div className="post-content">
                <p>K thể làm kịp được CTKM tháng 11 làyyyy. Giá thay đổi liên tục haizz. Hnay giá PC sẽ tiếp tục tăng🚀, sorry các tình iuu😢Vũ k thể làm gì # được🤷</p>
              </div>

              <div className="post-image">
                <img 
                  src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&h=400&fit=crop" 
                  alt="PC Gaming Setup"
                />
              </div>

              <div className="post-stats">
                <span>👍❤️ 15</span>
                <span>2 bình luận</span>
              </div>

              <div className="post-actions">
                <button className="action-btn">
                  <AiOutlineLike size={20} />
                  <span>Thích</span>
                </button>
                <button className="action-btn">
                  <AiOutlineComment size={20} />
                  <span>Bình luận</span>
                </button>
                <button className="action-btn">
                  <AiOutlineShareAlt size={20} />
                  <span>Chia sẻ</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar phải */}
        <aside className="sidebar-right">
          <h3>Người liên hệ</h3>
          <div className="contact-item">
            <div className="meta-ai-avatar">
              <SiMeta size={20} color="#00a7e7" />
            </div>
            <span>Meta AI</span>
            <span className="online-status"></span>
          </div>
          <div className="contact-item">
            <div className="user-avatar small">N</div>
            <span>Nhật Hải</span>
            <span className="online-status"></span>
          </div>
          <div className="contact-item">
            <div className="user-avatar small">D</div>
            <span>Đức Hoàng</span>
          </div>
          <div className="contact-item">
            <div className="user-avatar small">N</div>
            <span>Nguyễn Trường Sớn</span>
          </div>
          <div className="contact-item">
            <div className="user-avatar small">Q    </div>
            <span>Lê Quân</span>
          </div>
           <div className="contact-item">
            <div className="user-avatar small">L</div>
            <span>Lê Hải</span>
          </div>
           <div className="contact-item">
            <div className="user-avatar small">T</div>
            <span>Hà Thu</span>
            <span className="online-status"></span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Home;
