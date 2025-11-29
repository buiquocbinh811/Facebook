# Facebook Clone - WebSocket Server

Real-time features server for Facebook Clone using Socket.IO

## Features
- 🔔 Real-time notifications (friend requests, reactions, comments)
- 📱 Video/Audio calling (WebRTC signaling)
- 📹 Livestream support
- 👥 Online/offline user tracking

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

```env
PORT=3001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

## Deploy to Railway

1. Create account at [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy!

## Socket Events

### Client → Server

**Friend Notifications:**
- `friend:request` - Send friend request notification
- `friend:accepted` - Send friend accepted notification

**Post Interactions:**
- `post:react` - Real-time reaction
- `post:comment` - New comment notification

**Video Call:**
- `call:initiate` - Start call
- `call:accept` - Accept call
- `call:reject` - Reject call
- `call:end` - End call
- `webrtc:offer` - Send WebRTC offer
- `webrtc:answer` - Send WebRTC answer
- `webrtc:iceCandidate` - Send ICE candidate

**Livestream:**
- `livestream:start` - Start streaming
- `livestream:join` - Join stream
- `livestream:leave` - Leave stream
- `livestream:end` - End stream

### Server → Client

**Status:**
- `user:online` - User came online
- `user:offline` - User went offline
- `users:online` - List of online users

**Notifications:**
- `notification:friendRequest`
- `notification:friendAccepted`
- `notification:reaction`
- `notification:comment`

**Call Events:**
- `call:incoming`
- `call:accepted`
- `call:rejected`
- `call:ended`
- `call:error`

**WebRTC:**
- `webrtc:offer`
- `webrtc:answer`
- `webrtc:iceCandidate`

**Livestream:**
- `livestream:started`
- `livestream:ready`
- `livestream:ended`
- `livestream:viewerJoined`
- `livestream:viewerLeft`
