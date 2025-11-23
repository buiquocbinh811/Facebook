import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://facebookfc.vercel.app', //
  'https://*.vercel.app' // Cho phép tất cả subdomain vercel
];

app.use(cors({
  origin: function(origin, callback) {
    // Cho phép requests không có origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const regex = new RegExp(allowed.replace('*', '.*'));
        return regex.test(origin);
      }
      return allowed === origin;
    })) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Serve static files (images)
app.use('/images', express.static(path.join(__dirname, '../../public/images')));

const PORT = process.env.PORT || 5000;

// Route test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Facebook Clone API - Server đang chạy! 🚀',
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route không tồn tại'
  });
});

// Chỉ listen khi chạy local, không listen trên Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
  });
}

// Export cho Vercel
export default app;
