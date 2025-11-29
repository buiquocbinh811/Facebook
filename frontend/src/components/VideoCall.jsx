import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useVideoCall } from '../hooks/useVideoCall';
import { FaPhone, FaPhoneSlash, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';
import './VideoCall.css';

const VideoCall = () => {
  const { socket } = useSocket();
  const {
    callState,
    currentCall,
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    acceptCall,
    rejectCall,
    endCall,
    toggleMicrophone,
    toggleCamera
  } = useVideoCall();

  const [incomingCall, setIncomingCall] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // Listen for incoming calls
  useEffect(() => {
    if (!socket) return;

    socket.on('call:incoming', (callData) => {
      console.log('📞 Incoming call from', callData.callerName);
      setIncomingCall(callData);
    });

    return () => {
      socket.off('call:incoming');
    };
  }, [socket]);

  const handleAcceptCall = () => {
    if (incomingCall) {
      acceptCall(incomingCall);
      setIncomingCall(null);
    }
  };

  const handleRejectCall = () => {
    if (incomingCall) {
      rejectCall(incomingCall.roomId);
      setIncomingCall(null);
    }
  };

  const handleToggleMic = () => {
    const newState = toggleMicrophone();
    setIsMicOn(newState);
  };

  const handleToggleCamera = () => {
    const newState = toggleCamera();
    setIsCameraOn(newState);
  };

  // Incoming call modal
  if (incomingCall) {
    return (
      <div className="call-modal">
        <div className="call-modal-content">
          <h3>📞 Cuộc gọi đến</h3>
          <p className="caller-name">{incomingCall.callerName}</p>
          <p className="call-type">
            {incomingCall.callType === 'video' ? '📹 Video Call' : '📞 Voice Call'}
          </p>
          <div className="call-actions">
            <button className="btn-accept" onClick={handleAcceptCall}>
              <FaPhone /> Nhận cuộc gọi
            </button>
            <button className="btn-reject" onClick={handleRejectCall}>
              <FaPhoneSlash /> Từ chối
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active call UI
  if (callState !== 'idle' && currentCall) {
    return (
      <div className="video-call-container">
        {/* Remote video (main) */}
        <div className="remote-video-wrapper">
          {callState === 'calling' && (
            <div className="call-status">
              <p>Đang gọi {currentCall.calleeName}...</p>
            </div>
          )}
          {callState === 'connecting' && (
            <div className="call-status">
              <p>Đang kết nối...</p>
            </div>
          )}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="remote-video"
          />
        </div>

        {/* Local video (small) */}
        <div className="local-video-wrapper">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="local-video"
          />
        </div>

        {/* Call controls */}
        <div className="call-controls">
          <button
            className={`control-btn ${!isMicOn ? 'disabled' : ''}`}
            onClick={handleToggleMic}
            title={isMicOn ? 'Tắt mic' : 'Bật mic'}
          >
            {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>

          {currentCall.callType === 'video' && (
            <button
              className={`control-btn ${!isCameraOn ? 'disabled' : ''}`}
              onClick={handleToggleCamera}
              title={isCameraOn ? 'Tắt camera' : 'Bật camera'}
            >
              {isCameraOn ? <FaVideo /> : <FaVideoSlash />}
            </button>
          )}

          <button
            className="control-btn end-call"
            onClick={endCall}
            title="Kết thúc"
          >
            <FaPhoneSlash />
          </button>
        </div>

        {/* Call info */}
        <div className="call-info">
          <p>{currentCall.calleeName || 'Unknown'}</p>
          <span className="call-duration">
            {callState === 'connected' ? '🟢 Đang kết nối' : '🟡 Đang gọi...'}
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default VideoCall;
