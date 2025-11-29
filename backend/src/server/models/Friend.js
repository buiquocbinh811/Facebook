import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
friendSchema.index({ requester: 1, recipient: 1 });
friendSchema.index({ status: 1 });

// Tránh duplicate friend requests
friendSchema.index(
  { requester: 1, recipient: 1 },
  { unique: true }
);

const Friend = mongoose.model('Friend', friendSchema);

export default Friend;
