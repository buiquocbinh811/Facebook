import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

export const useVideoCall = () => {
  const { socket } = useSocket();
  const [callState, setCallState] = useState('idle'); // idle, calling, ringing, connected
  const [currentCall, setCurrentCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // STUN servers for NAT traversal
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  // Initialize peer connection
  const createPeerConnection = (roomId) => {
    const pc = new RTCPeerConnection(iceServers);

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      console.log('📹 Received remote track');
      const [stream] = event.streams;
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 Sending ICE candidate');
        socket.emit('webrtc:iceCandidate', {
          roomId,
          candidate: event.candidate
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('🧊 ICE connection state:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected') {
        setCallState('connected');
      } else if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        endCall();
      }
    };

    peerConnection.current = pc;
    return pc;
  };

  // Get user media
  const getMediaStream = async (callType = 'video') => {
    try {
      const constraints = {
        video: callType === 'video',
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('❌ Error getting media stream:', error);
      alert('Không thể truy cập camera/microphone. Vui lòng cho phép quyền truy cập.');
      throw error;
    }
  };

  // Initiate call
  const startCall = async (calleeId, calleeName, callType = 'video') => {
    try {
      setCallState('calling');
      
      // Get media stream
      await getMediaStream(callType);

      // Send call initiation
      const userData = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      socket.emit('call:initiate', {
        calleeId,
        callerName: userData.name,
        callType
      });

      setCurrentCall({
        calleeId,
        calleeName,
        callType,
        isInitiator: true
      });
    } catch (error) {
      console.error('❌ Error starting call:', error);
      setCallState('idle');
    }
  };

  // Accept incoming call
  const acceptCall = async (callData) => {
    try {
      setCallState('connecting');
      setCurrentCall({
        ...callData,
        isInitiator: false
      });

      // Get media stream
      await getMediaStream(callData.callType);

      // Create peer connection
      const pc = createPeerConnection(callData.roomId);

      // Send accept signal
      socket.emit('call:accept', {
        roomId: callData.roomId
      });
    } catch (error) {
      console.error('❌ Error accepting call:', error);
      rejectCall(callData.roomId);
    }
  };

  // Reject incoming call
  const rejectCall = (roomId) => {
    socket.emit('call:reject', { roomId });
    cleanup();
  };

  // End call
  const endCall = () => {
    if (currentCall?.roomId) {
      socket.emit('call:end', { roomId: currentCall.roomId });
    }
    cleanup();
  };

  // Cleanup
  const cleanup = () => {
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setLocalStream(null);
    setRemoteStream(null);
    setCurrentCall(null);
    setCallState('idle');
  };

  // Toggle microphone
  const toggleMicrophone = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  };

  // Toggle camera
  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Call accepted by callee
    socket.on('call:accepted', async ({ roomId }) => {
      console.log('✅ Call accepted, creating offer');
      setCallState('connecting');

      const pc = createPeerConnection(roomId);
      
      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('webrtc:offer', {
        roomId,
        offer
      });

      setCurrentCall(prev => ({ ...prev, roomId }));
    });

    // Call rejected
    socket.on('call:rejected', () => {
      alert('Cuộc gọi đã bị từ chối');
      cleanup();
    });

    // Call ended
    socket.on('call:ended', () => {
      cleanup();
    });

    // Received WebRTC offer
    socket.on('webrtc:offer', async ({ offer, senderId }) => {
      console.log('📨 Received offer');
      
      if (!peerConnection.current) {
        const pc = createPeerConnection(currentCall?.roomId);
        peerConnection.current = pc;
      }

      const pc = peerConnection.current;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      // Create and send answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('webrtc:answer', {
        roomId: currentCall?.roomId,
        answer
      });
    });

    // Received WebRTC answer
    socket.on('webrtc:answer', async ({ answer }) => {
      console.log('📨 Received answer');
      
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    // Received ICE candidate
    socket.on('webrtc:iceCandidate', async ({ candidate }) => {
      console.log('🧊 Received ICE candidate');
      
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    });

    return () => {
      socket.off('call:accepted');
      socket.off('call:rejected');
      socket.off('call:ended');
      socket.off('webrtc:offer');
      socket.off('webrtc:answer');
      socket.off('webrtc:iceCandidate');
    };
  }, [socket, currentCall, localStream]);

  return {
    callState,
    currentCall,
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMicrophone,
    toggleCamera
  };
};
