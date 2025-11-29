import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }

    // Decode JWT to get user info
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Connect to WebSocket server
    const newSocket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3001', {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
    });

    // Online users
    newSocket.on('users:online', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('user:online', ({ userId }) => {
      setOnlineUsers(prev => [...new Set([...prev, userId])]);
    });

    newSocket.on('user:offline', ({ userId }) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });

    // Notifications
    newSocket.on('notification:friendRequest', (data) => {
      setNotifications(prev => [...prev, { ...data, id: Date.now(), read: false }]);
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification('Lời mời kết bạn', {
          body: data.message,
          icon: '/logo.png'
        });
      }
    });

    newSocket.on('notification:friendAccepted', (data) => {
      setNotifications(prev => [...prev, { ...data, id: Date.now(), read: false }]);
    });

    newSocket.on('notification:reaction', (data) => {
      setNotifications(prev => [...prev, { ...data, id: Date.now(), read: false }]);
    });

    newSocket.on('notification:comment', (data) => {
      setNotifications(prev => [...prev, { ...data, id: Date.now(), read: false }]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markNotificationAsRead,
    clearNotifications
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
