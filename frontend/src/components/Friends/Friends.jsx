import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useVideoCall } from '../../hooks/useVideoCall';
import { FaPhoneAlt, FaVideo, FaUserPlus, FaBell } from 'react-icons/fa';
import friendApi from '../../api/friendApi';
import './Friends.css';

const Friends = () => {
  const { socket, onlineUsers, notifications, unreadCount, markNotificationAsRead } = useSocket();
  const { startCall } = useVideoCall();
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('friends'); // friends, requests

  useEffect(() => {
    loadFriends();
    loadPendingRequests();
  }, []);

  const loadFriends = async () => {
    try {
      const response = await friendApi.getFriends();
      setFriends(response.data);
    } catch (error) {
      console.error('Error loading friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const response = await friendApi.getPendingRequests();
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await friendApi.acceptFriendRequest(requestId);
      
      // Reload data
      loadFriends();
      loadPendingRequests();

      // Notify via socket
      const request = pendingRequests.find(r => r._id === requestId);
      if (request && socket) {
        const userData = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
        socket.emit('friend:accepted', {
          recipientId: request.requester._id,
          senderName: userData.name,
          senderId: userData.id
        });
      }

      alert('Đã chấp nhận lời mời kết bạn');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await friendApi.rejectFriendRequest(requestId);
      loadPendingRequests();
      alert('Đã từ chối lời mời');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const handleVideoCall = (friend) => {
    if (!onlineUsers.includes(friend._id)) {
      alert(`${friend.name} đang offline`);
      return;
    }

    startCall(friend._id, friend.name, 'video');
  };

  const handleVoiceCall = (friend) => {
    if (!onlineUsers.includes(friend._id)) {
      alert(`${friend.name} đang offline`);
      return;
    }

    startCall(friend._id, friend.name, 'audio');
  };

  const isOnline = (userId) => onlineUsers.includes(userId);

  if (loading) {
    return <div className="friends-loading">Đang tải...</div>;
  }

  return (
    <div className="friends-container">
      <div className="friends-header">
        <h2>Bạn bè</h2>
        <div className="notification-icon">
          <FaBell />
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </div>
      </div>

      <div className="friends-tabs">
        <button
          className={activeTab === 'friends' ? 'active' : ''}
          onClick={() => setActiveTab('friends')}
        >
          Bạn bè ({friends.length})
        </button>
        <button
          className={activeTab === 'requests' ? 'active' : ''}
          onClick={() => setActiveTab('requests')}
        >
          Lời mời ({pendingRequests.length})
        </button>
      </div>

      {activeTab === 'friends' && (
        <div className="friends-list">
          {friends.length === 0 ? (
            <p className="empty-state">Chưa có bạn bè nào</p>
          ) : (
            friends.map(friend => (
              <div key={friend._id} className="friend-card">
                <div className="friend-info">
                  <div className="friend-avatar">
                    {friend.avatar ? (
                      <img src={friend.avatar} alt={friend.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {friend.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {isOnline(friend._id) && <span className="online-dot"></span>}
                  </div>
                  <div>
                    <h4>{friend.name}</h4>
                    <span className="online-status">
                      {isOnline(friend._id) ? '🟢 Online' : '⚫ Offline'}
                    </span>
                  </div>
                </div>
                <div className="friend-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleVideoCall(friend)}
                    disabled={!isOnline(friend._id)}
                    title="Video call"
                  >
                    <FaVideo />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleVoiceCall(friend)}
                    disabled={!isOnline(friend._id)}
                    title="Voice call"
                  >
                    <FaPhoneAlt />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="requests-list">
          {pendingRequests.length === 0 ? (
            <p className="empty-state">Không có lời mời nào</p>
          ) : (
            pendingRequests.map(request => (
              <div key={request._id} className="request-card">
                <div className="friend-info">
                  <div className="friend-avatar">
                    {request.requester.avatar ? (
                      <img src={request.requester.avatar} alt={request.requester.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {request.requester.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4>{request.requester.name}</h4>
                    <span className="request-time">
                      {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                <div className="request-actions">
                  <button
                    className="btn-accept"
                    onClick={() => handleAcceptRequest(request._id)}
                  >
                    Chấp nhận
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleRejectRequest(request._id)}
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Friends;
