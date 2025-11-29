import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://facebookffc.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Store online users: { userId: socketId }
const onlineUsers = new Map();

// Store active calls: { roomId: { caller, callee, type } }
const activeCalls = new Map();

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userName = decoded.name;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.userName} (${socket.userId})`);
  
  // Add user to online users
  onlineUsers.set(socket.userId, socket.id);
  
  // Broadcast online status
  io.emit('user:online', {
    userId: socket.userId,
    userName: socket.userName
  });
  
  // Send current online users to new connection
  socket.emit('users:online', Array.from(onlineUsers.keys()));

  // ==================== FRIEND REQUEST NOTIFICATIONS ====================
  socket.on('friend:request', ({ recipientId, senderName, senderId }) => {
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('notification:friendRequest', {
        type: 'friend_request',
        message: `${senderName} đã gửi lời mời kết bạn`,
        senderId,
        senderName,
        timestamp: new Date()
      });
    }
  });

  socket.on('friend:accepted', ({ recipientId, senderName, senderId }) => {
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('notification:friendAccepted', {
        type: 'friend_accepted',
        message: `${senderName} đã chấp nhận lời mời kết bạn`,
        senderId,
        senderName,
        timestamp: new Date()
      });
    }
  });

  // ==================== POST REACTIONS ====================
  socket.on('post:react', ({ postId, userId, userName, reactionType, postOwnerId }) => {
    // Broadcast to all users viewing this post
    io.emit('post:reactionUpdate', {
      postId,
      userId,
      userName,
      reactionType,
      timestamp: new Date()
    });

    // Notify post owner if online
    if (postOwnerId && userId !== postOwnerId) {
      const ownerSocketId = onlineUsers.get(postOwnerId);
      if (ownerSocketId) {
        io.to(ownerSocketId).emit('notification:reaction', {
          type: 'post_reaction',
          message: `${userName} đã ${reactionType} bài viết của bạn`,
          postId,
          userId,
          userName,
          reactionType,
          timestamp: new Date()
        });
      }
    }
  });

  // ==================== COMMENT NOTIFICATIONS ====================
  socket.on('post:comment', ({ postId, commentId, userId, userName, content, postOwnerId }) => {
    // Broadcast new comment to all users viewing this post
    io.emit('post:newComment', {
      postId,
      commentId,
      userId,
      userName,
      content,
      timestamp: new Date()
    });

    // Notify post owner if online
    if (postOwnerId && userId !== postOwnerId) {
      const ownerSocketId = onlineUsers.get(postOwnerId);
      if (ownerSocketId) {
        io.to(ownerSocketId).emit('notification:comment', {
          type: 'post_comment',
          message: `${userName} đã bình luận: "${content.substring(0, 50)}..."`,
          postId,
          commentId,
          userId,
          userName,
          timestamp: new Date()
        });
      }
    }
  });

  // ==================== VIDEO CALL SIGNALING ====================
  
  // Initiate call
  socket.on('call:initiate', ({ calleeId, callerName, callType }) => {
    const calleeSocketId = onlineUsers.get(calleeId);
    
    if (!calleeSocketId) {
      return socket.emit('call:error', { message: 'User is offline' });
    }

    const roomId = `call_${socket.userId}_${calleeId}_${Date.now()}`;
    
    activeCalls.set(roomId, {
      caller: socket.userId,
      callee: calleeId,
      type: callType, // 'video' or 'audio'
      startTime: new Date()
    });

    // Notify callee about incoming call
    io.to(calleeSocketId).emit('call:incoming', {
      roomId,
      callerId: socket.userId,
      callerName,
      callType
    });
  });

  // Accept call
  socket.on('call:accept', ({ roomId }) => {
    const call = activeCalls.get(roomId);
    
    if (!call) {
      return socket.emit('call:error', { message: 'Call not found' });
    }

    const callerSocketId = onlineUsers.get(call.caller);
    
    if (!callerSocketId) {
      activeCalls.delete(roomId);
      return socket.emit('call:error', { message: 'Caller is offline' });
    }

    // Join both users to the room
    socket.join(roomId);
    io.sockets.sockets.get(callerSocketId)?.join(roomId);

    // Notify caller that call was accepted
    io.to(callerSocketId).emit('call:accepted', { roomId });
  });

  // Reject call
  socket.on('call:reject', ({ roomId }) => {
    const call = activeCalls.get(roomId);
    
    if (call) {
      const callerSocketId = onlineUsers.get(call.caller);
      
      if (callerSocketId) {
        io.to(callerSocketId).emit('call:rejected', { roomId });
      }
      
      activeCalls.delete(roomId);
    }
  });

  // End call
  socket.on('call:end', ({ roomId }) => {
    const call = activeCalls.get(roomId);
    
    if (call) {
      // Notify all participants
      io.to(roomId).emit('call:ended', { roomId });
      
      // Clean up
      activeCalls.delete(roomId);
    }
  });

  // WebRTC signaling: offer
  socket.on('webrtc:offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('webrtc:offer', {
      offer,
      senderId: socket.userId
    });
  });

  // WebRTC signaling: answer
  socket.on('webrtc:answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('webrtc:answer', {
      answer,
      senderId: socket.userId
    });
  });

  // WebRTC signaling: ICE candidate
  socket.on('webrtc:iceCandidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('webrtc:iceCandidate', {
      candidate,
      senderId: socket.userId
    });
  });

  // ==================== LIVESTREAM ====================
  
  // Start livestream
  socket.on('livestream:start', ({ streamTitle, streamDescription }) => {
    const streamId = `stream_${socket.userId}_${Date.now()}`;
    
    socket.join(streamId);
    socket.streamId = streamId;

    // Broadcast to all friends/followers
    socket.broadcast.emit('livestream:started', {
      streamId,
      streamerId: socket.userId,
      streamerName: socket.userName,
      title: streamTitle,
      description: streamDescription,
      startTime: new Date()
    });

    socket.emit('livestream:ready', { streamId });
  });

  // Join livestream
  socket.on('livestream:join', ({ streamId }) => {
    socket.join(streamId);
    
    // Notify streamer about new viewer
    socket.to(streamId).emit('livestream:viewerJoined', {
      viewerId: socket.userId,
      viewerName: socket.userName
    });
  });

  // Leave livestream
  socket.on('livestream:leave', ({ streamId }) => {
    socket.leave(streamId);
    
    socket.to(streamId).emit('livestream:viewerLeft', {
      viewerId: socket.userId
    });
  });

  // End livestream
  socket.on('livestream:end', ({ streamId }) => {
    io.to(streamId).emit('livestream:ended', { streamId });
    
    // Remove all users from stream room
    io.socketsLeave(streamId);
  });

  // Livestream WebRTC signaling (similar to video call)
  socket.on('livestream:offer', ({ streamId, offer }) => {
    socket.to(streamId).emit('livestream:offer', {
      offer,
      streamerId: socket.userId
    });
  });

  socket.on('livestream:answer', ({ streamId, answer, streamerId }) => {
    const streamerSocketId = onlineUsers.get(streamerId);
    if (streamerSocketId) {
      io.to(streamerSocketId).emit('livestream:answer', {
        answer,
        viewerId: socket.userId
      });
    }
  });

  socket.on('livestream:iceCandidate', ({ streamId, candidate, targetId }) => {
    const targetSocketId = onlineUsers.get(targetId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('livestream:iceCandidate', {
        candidate,
        senderId: socket.userId
      });
    }
  });

  // ==================== DISCONNECT ====================
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.userName} (${socket.userId})`);
    
    // Remove from online users
    onlineUsers.delete(socket.userId);
    
    // Broadcast offline status
    io.emit('user:offline', {
      userId: socket.userId
    });

    // End any active calls
    activeCalls.forEach((call, roomId) => {
      if (call.caller === socket.userId || call.callee === socket.userId) {
        io.to(roomId).emit('call:ended', { roomId, reason: 'User disconnected' });
        activeCalls.delete(roomId);
      }
    });

    // End livestream if user was streaming
    if (socket.streamId) {
      io.to(socket.streamId).emit('livestream:ended', {
        streamId: socket.streamId,
        reason: 'Streamer disconnected'
      });
    }
  });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Facebook Clone WebSocket Server',
    status: 'running',
    onlineUsers: onlineUsers.size,
    activeCalls: activeCalls.size
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    onlineUsers: onlineUsers.size,
    activeCalls: activeCalls.size
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 WebSocket Server running on port ${PORT}`);
  console.log(`📡 Accepting connections from: ${allowedOrigins.join(', ')}`);
});
