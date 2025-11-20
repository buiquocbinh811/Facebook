// tính thời gian đã qua theo kiểu "2 phút trước", "1 giờ trước"
export const timeAgo = (timestamp) => {
  const now = new Date();
  const postTime = new Date(timestamp);
  const seconds = Math.floor((now - postTime) / 1000);
  
  // vừa xong
  if (seconds < 60) {
    return 'Vừa xong';
  }
  
  // phút trước
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} phút trước`;
  }
  
  // giờ trước
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} giờ trước`;
  }
  
  // ngày trước
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} ngày trước`;
  }
  
  // tuần trước
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} tuần trước`;
  }
  
  // tháng trước
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} tháng trước`;
  }
  
  // năm trước
  const years = Math.floor(days / 365);
  return `${years} năm trước`;
};
