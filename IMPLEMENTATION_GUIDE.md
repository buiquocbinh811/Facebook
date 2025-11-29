# 🎯 HƯỚNG DẪN HOÀN THIỆN FACEBOOK CLONE

## 📊 Tình trạng hiện tại:

### ✅ Đã có:
1. **Backend REST API** (Vercel)
   - ✅ Auth (Login/Register)
   - ✅ Posts CRUD + Like + Comment
   - ✅ Friend System (Send/Accept/Reject)
   - ✅ User Search API (MỚI TẠO)

2. **WebSocket Server** (Port 3001 - Local)
   - ✅ Real-time infrastructure
   - ✅ Socket.IO setup
   - ✅ JWT authentication

3. **Frontend** (Port 5174)
   - ✅ Login/Register UI
   - ✅ Home feed with posts
   - ✅ SocketContext (đã tạo)
   - ✅ VideoCall component (đã tạo)
   - ✅ Friends component (đã tạo)
   - ✅ SearchUsers component (MỚI TẠO)

### ❌ Chưa tích hợp vào UI:
1. Tìm kiếm user trong Home page
2. Notification dropdown với dữ liệu thật từ WebSocket
3. Friends tab/page
4. Chat/Messenger với real-time
5. Video call button trong chat
6. Online status indicators

---

## 🔧 BƯỚC 1: Tích hợp Search Users vào Home

### File cần sửa: `frontend/src/pages/Home/Home.jsx`

Thêm SearchUsers component vào sidebar:

```jsx
import SearchUsers from '../../components/SearchUsers/SearchUsers';

function Home() {
  // ...existing code...

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        {/* ...existing header... */}
      </header>

      {/* Main Content */}
      <div className="home-main">
        {/* LEFT SIDEBAR */}
        <aside className="home-sidebar-left">
          {/* ...existing sidebar... */}
          
          {/* ✨ THÊM MỚI: Search Users */}
          <SearchUsers />
        </aside>

        {/* CENTER FEED */}
        <main className="home-feed">
          {/* ...existing feed... */}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="home-sidebar-right">
          {/* Contacts/Friends sẽ thêm ở đây */}
        </aside>
      </div>
    </div>
  );
}
```

---

## 🔧 BƯỚC 2: Notification Dropdown với dữ liệu thật

### Tạo Notification Component

**File mới: `frontend/src/components/Notification/NotificationDropdown.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { FaBell, FaUserPlus, FaHeart, FaComment } from 'react-icons/fa';
import friendApi from '../../api/friendApi';
import './NotificationDropdown.css';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, markNotificationAsRead } = useSocket();
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      const response = await friendApi.getPendingRequests();
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  const handleAcceptFriend = async (requestId) => {
    try {
      await friendApi.acceptFriendRequest(requestId);
      loadPendingRequests(); // Reload
      alert('Đã chấp nhận lời mời kết bạn!');
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectFriend = async (requestId) => {
    try {
      await friendApi.rejectFriendRequest(requestId);
      loadPendingRequests(); // Reload
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'friend_request':
        return <FaUserPlus className="notif-icon friend" />;
      case 'friend_accepted':
        return <FaUserPlus className="notif-icon friend" />;
      case 'post_reaction':
        return <FaHeart className="notif-icon reaction" />;
      case 'post_comment':
        return <FaComment className="notif-icon comment" />;
      default:
        return <FaBell className="notif-icon default" />;
    }
  };

  return (
    <div className="notification-dropdown">
      <div className="notif-header">
        <h3>Thông báo</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="notif-content">
        {/* Friend Requests Section */}
        {pendingRequests.length > 0 && (
          <div className="notif-section">
            <h4>Lời mời kết bạn ({pendingRequests.length})</h4>
            {pendingRequests.map(request => (
              <div key={request._id} className="notif-item friend-request">
                <div className="notif-avatar">
                  {request.requester.avatar ? (
                    <img src={request.requester.avatar} alt={request.requester.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {request.requester.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="notif-body">
                  <p><strong>{request.requester.name}</strong> đã gửi lời mời kết bạn</p>
                  <span className="notif-time">{new Date(request.createdAt).toLocaleDateString('vi-VN')}</span>
                  <div className="friend-actions">
                    <button 
                      className="btn-accept"
                      onClick={() => handleAcceptFriend(request._id)}
                    >
                      Chấp nhận
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleRejectFriend(request._id)}
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Real-time Notifications */}
        {notifications.length > 0 && (
          <div className="notif-section">
            <h4>Hoạt động gần đây</h4>
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                onClick={() => markNotificationAsRead(notif.id)}
              >
                {getNotificationIcon(notif.type)}
                <div className="notif-body">
                  <p>{notif.message}</p>
                  <span className="notif-time">
                    {new Date(notif.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>
                {!notif.read && <div className="unread-dot"></div>}
              </div>
            ))}
          </div>
        )}

        {pendingRequests.length === 0 && notifications.length === 0 && (
          <div className="empty-state">
            <FaBell size={48} color="#ccc" />
            <p>Không có thông báo mới</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
```

**CSS: `frontend/src/components/Notification/NotificationDropdown.css`**

```css
.notification-dropdown {
  position: absolute;
  top: 60px;
  right: 20px;
  width: 360px;
  max-height: 600px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;
}

.notif-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e4e6eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notif-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #65676b;
  cursor: pointer;
  padding: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f0f2f5;
}

.notif-content {
  max-height: 540px;
  overflow-y: auto;
}

.notif-section {
  padding: 12px 0;
  border-bottom: 1px solid #e4e6eb;
}

.notif-section h4 {
  margin: 0;
  padding: 8px 16px;
  font-size: 17px;
  font-weight: 600;
  color: #050505;
}

.notif-item {
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.notif-item:hover {
  background: #f0f2f5;
}

.notif-item.unread {
  background: #e7f3ff;
}

.notif-item.unread:hover {
  background: #d8ebff;
}

.notif-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.notif-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.notif-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  padding: 16px;
  flex-shrink: 0;
}

.notif-icon.friend {
  background: #e7f3ff;
  color: #1877f2;
}

.notif-icon.reaction {
  background: #ffebe9;
  color: #f02849;
}

.notif-icon.comment {
  background: #f0f2f5;
  color: #65676b;
}

.notif-body {
  flex: 1;
}

.notif-body p {
  margin: 0 0 4px;
  font-size: 15px;
  line-height: 1.4;
}

.notif-time {
  font-size: 13px;
  color: #65676b;
}

.unread-dot {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #1877f2;
  border-radius: 50%;
}

.friend-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.btn-accept,
.btn-reject {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-accept {
  background: #1877f2;
  color: white;
}

.btn-accept:hover {
  background: #166fe5;
}

.btn-reject {
  background: #e4e6eb;
  color: #050505;
}

.btn-reject:hover {
  background: #d8dadf;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #65676b;
}

.empty-state p {
  margin: 12px 0 0;
  font-size: 17px;
}
```

---

## 🔧 BƯỚC 3: Tích hợp Notification vào Header

### Sửa `Home.jsx` - Header section:

```jsx
import NotificationDropdown from '../../components/Notification/NotificationDropdown';
import { useSocket } from '../../context/SocketContext';

function Home() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useSocket();

  return (
    <header className="home-header">
      {/* ...existing header code... */}

      {/* Notification Button */}
      <button 
        className={`header-icon-btn ${showNotifications ? 'active' : ''}`}
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <AiOutlineBell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <>
          <div 
            className="dropdown-overlay"
            onClick={() => setShowNotifications(false)}
          />
          <NotificationDropdown 
            onClose={() => setShowNotifications(false)}
          />
        </>
      )}
    </header>
  );
}
```

---

## 📝 TỔNG KẾT NHỮNG GÌ VỪA TẠO:

### Backend (Đã thêm):
1. ✅ **`/api/users/search`** - Tìm kiếm user
2. ✅ **`/api/users/:userId`** - Xem profile user

### Frontend Components (Đã tạo):
1. ✅ **SearchUsers** - Tìm kiếm và gửi kết bạn
2. ✅ **NotificationDropdown** - Thông báo thật với lời mời kết bạn
3. ✅ **SocketContext** - Real-time notifications
4. ✅ **VideoCall** - Video call UI
5. ✅ **Friends** - Danh sách bạn bè

### Còn thiếu:
1. ❌ **Chat/Messenger** component
2. ❌ **Livestream** UI
3. ❌ Tích hợp SearchUsers vào Home page
4. ❌ Tích hợp NotificationDropdown vào Header
5. ❌ Friends page riêng
6. ❌ Deploy WebSocket server lên Railway/Render

---

## 🚀 HƯỚNG DẪN TEST:

### 1. Restart Backend:
```bash
cd d:\Workspace\Facebook\backend
npm run dev
```

### 2. Restart WebSocket:
```bash
cd d:\Workspace\Facebook\websocket-server
npm run dev
```

### 3. Restart Frontend:
```bash
cd d:\Workspace\Facebook\frontend
npm run dev
```

### 4. Test flow:
1. Đăng nhập 2 accounts (2 browser tabs)
2. Tab 1: Tìm kiếm user → Gửi kết bạn
3. Tab 2: Nhận notification real-time
4. Tab 2: Click bell icon → Xem notification
5. Tab 2: Chấp nhận kết bạn
6. Tab 1: Nhận notification "đã chấp nhận"

---

## 📌 LƯU Ý:

Tôi đã tạo đầy đủ code cho:
- Backend API search users
- SearchUsers component (tìm + gửi kết bạn)
- NotificationDropdown (thông báo thật + lời mời kết bạn)

**Bạn chỉ cần:**
1. Copy code NotificationDropdown vào project
2. Import vào Home.jsx
3. Restart servers
4. Test!

Bạn muốn tôi tiếp tục tạo **Chat/Messenger component** không?
