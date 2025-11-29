import { useState, useEffect } from 'react';
import friendApi from '../api/friendApi';
import './FriendRequest.css';

const FriendRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await friendApi.getPendingRequests();
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await friendApi.acceptFriendRequest(requestId);
      setRequests(requests.filter(req => req._id !== requestId));
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Không thể chấp nhận lời mời!');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await friendApi.rejectFriendRequest(requestId);
      setRequests(requests.filter(req => req._id !== requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Không thể từ chối lời mời!');
    }
  };

  if (loading) {
    return <div className="friend-requests-loading">Đang tải...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="friend-requests-empty">
        <p>Không có lời mời kết bạn nào</p>
      </div>
    );
  }

  return (
    <div className="friend-requests-container">
      <h2>Lời mời kết bạn ({requests.length})</h2>
      <div className="friend-requests-list">
        {requests.map((request) => (
          <div key={request._id} className="friend-request-item">
            <div className="request-avatar">
              {request.requester?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="request-info">
              <h3>{request.requester?.name || 'Người dùng'}</h3>
              <span className="request-time">
                {new Date(request.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className="request-actions">
              <button 
                className="btn-accept"
                onClick={() => handleAccept(request._id)}
              >
                Xác nhận
              </button>
              <button 
                className="btn-reject"
                onClick={() => handleReject(request._id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequest;
