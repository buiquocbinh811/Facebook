import { useState } from 'react';
import { FaUserPlus, FaCheck, FaUserFriends } from 'react-icons/fa';
import axios from 'axios';
import friendApi from '../../api/friendApi';
import './SearchUsers.css';

const SearchUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [friendStatuses, setFriendStatuses] = useState({}); // { userId: status }

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/search?q=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSearchResults(response.data.data || []);
      
      // Check friendship status for each user
      const statuses = {};
      for (const user of response.data.data || []) {
        const statusRes = await friendApi.checkFriendshipStatus(user._id);
        statuses[user._id] = statusRes.data.status;
      }
      setFriendStatuses(statuses);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      await friendApi.sendFriendRequest(userId);
      
      // Update status locally
      setFriendStatuses(prev => ({
        ...prev,
        [userId]: 'pending'
      }));
      
      alert('Đã gửi lời mời kết bạn!');
    } catch (error) {
      console.error('Add friend error:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const renderActionButton = (user) => {
    const status = friendStatuses[user._id];

    if (status === 'accepted') {
      return (
        <button className="btn-status friends" disabled>
          <FaUserFriends /> Bạn bè
        </button>
      );
    }

    if (status === 'pending') {
      return (
        <button className="btn-status pending" disabled>
          <FaCheck /> Đã gửi lời mời
        </button>
      );
    }

    return (
      <button 
        className="btn-add-friend" 
        onClick={() => handleAddFriend(user._id)}
      >
        <FaUserPlus /> Thêm bạn bè
      </button>
    );
  };

  return (
    <div className="search-users-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Tìm kiếm bạn bè..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {loading && <div className="search-loading">Đang tìm kiếm...</div>}

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map(user => (
            <div key={user._id} className="user-result-card">
              <div className="user-info">
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="user-details">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="user-actions">
                {renderActionButton(user)}
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery && !loading && searchResults.length === 0 && (
        <div className="no-results">
          Không tìm thấy người dùng "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export default SearchUsers;
