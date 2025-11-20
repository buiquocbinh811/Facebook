// hash password cho user có sẵn trong MongoDB
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

async function hashExistingPasswords() {
  try {
    const users = await User.find();
    
    for (const user of users) {
      // Kiểm tra xem password đã hash chưa (bcrypt hash bắt đầu bằng $2a$ hoặc $2b$)
      if (!user.password.startsWith('$2')) {
        console.log(`Đang hash password cho user: ${user.email}`);
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        await User.updateOne(
          { _id: user._id },
          { password: hashedPassword }
        );
        
        console.log(`✅ Đã hash password cho: ${user.email}`);
      } else {
        console.log(`⏭️  Password đã hash rồi: ${user.email}`);
      }
    }
    
    console.log('\n✅ Hoàn thành!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

hashExistingPasswords();
