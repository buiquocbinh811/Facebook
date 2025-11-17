
## React + Vite + Node.js + Express + MongoDB + JWT

---


```
facebook-clone/
│
├── client/                          # FRONTEND (React + Vite)
│   ├── public/
│   │   └── assets/
│   │       ├── images/
│   │       └── icons/
│   │
│   ├── src/
│   │   ├── main.jsx                 # Entry point
│   │   ├── App.jsx
│   │   ├── App.css
│   │   │
│   │   ├── components/              # Component nhỏ
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.css
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Sidebar.css
│   │   │   ├── Post/
│   │   │   │   ├── Post.jsx
│   │   │   │   └── Post.css
│   │   │   ├── CreatePost/
│   │   │   │   ├── CreatePost.jsx
│   │   │   │   └── CreatePost.css
│   │   │   └── Comment/
│   │   │       ├── Comment.jsx
│   │   │       └── Comment.css
│   │   │
│   │   ├── pages/                   # Trang chính
│   │   │   ├── Home/
│   │   │   │   ├── Home.jsx
│   │   │   │   └── Home.css
│   │   │   ├── Login/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Login.css
│   │   │   ├── Register/
│   │   │   │   ├── Register.jsx
│   │   │   │   └── Register.css
│   │   │   ├── Profile/
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── Profile.css
│   │   │   └── Messages/
│   │   │       ├── Messages.jsx
│   │   │       └── Messages.css
│   │   │
│   │   ├── context/                 # Context API
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── api/                     # API calls
│   │   │   ├── axios.js             # Axios config
│   │   │   ├── auth.js              # Auth API
│   │   │   ├── posts.js             # Posts API
│   │   │   └── users.js             # Users API
│   │   │
│   │   └── styles/
│   │       ├── index.css
│   │       └── variables.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # BACKEND (Node.js + Express)
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── models/                      # MongoDB Models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   └── Message.js
│   │
│   ├── routes/                      # API Routes
│   │   ├── auth.js                  # Login/Register
│   │   ├── posts.js                 # CRUD Posts
│   │   ├── users.js                 # User profile
│   │   ├── comments.js              # Comments
│   │   └── messages.js              # Chat
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT verify
│   │   └── upload.js                # Upload ảnh
│   │
│   ├── controllers/                 # Logic xử lý
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── userController.js
│   │   └── messageController.js
│   │
│   ├── .env                         # Biến môi trường
│   ├── server.js                    # Entry point
│   └── package.json
│
└── README.md

```

---

## 🎯 LỘ TRÌNH 30 NGÀY (CHI TIẾT)

### ✅ TUẦN 1: SETUP & AUTHENTICATION (Ngày 1-7)

#### **Ngày 1-2: Setup Project**
- [ ] Setup Frontend (React + Vite) ✅ (Đã xong!)
- [ ] Setup Backend (Node.js + Express + MongoDB)
- [ ] Kết nối MongoDB Compass
- [ ] Cài đặt dependencies

**Backend Dependencies:**
```bash
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors
npm install nodemon --save-dev
```

**Frontend Dependencies:**
```bash
npm install axios react-router-dom
```

#### **Ngày 3-4: Authentication Backend**
- [ ] Tạo User Model (MongoDB Schema)
- [ ] API Register (POST /api/auth/register)
- [ ] API Login (POST /api/auth/login)
- [ ] JWT Token generation
- [ ] Middleware xác thực JWT

#### **Ngày 5-7: Authentication Frontend**
- [ ] Trang Login UI
- [ ] Trang Register UI
- [ ] AuthContext (lưu user info)
- [ ] Kết nối API login/register
- [ ] Protected Routes
- [ ] LocalStorage lưu token

---

### ✅ TUẦN 2: POSTS & FEED (Ngày 8-14)

#### **Ngày 8-10: Posts Backend**
- [ ] Post Model (MongoDB)
- [ ] API tạo post (POST /api/posts)
- [ ] API lấy tất cả posts (GET /api/posts)
- [ ] API xóa post (DELETE /api/posts/:id)
- [ ] API like/unlike post
- [ ] Upload ảnh (multer)

#### **Ngày 11-14: Posts Frontend**
- [ ] Component CreatePost (tạo bài viết)
- [ ] Component Post (hiển thị 1 bài)
- [ ] Component Feed (danh sách bài viết)
- [ ] Like/Unlike functionality
- [ ] Upload ảnh từ máy tính
- [ ] Navbar + Sidebar cơ bản

---

### ✅ TUẦN 3: COMMENTS & PROFILE (Ngày 15-21)

#### **Ngày 15-17: Comments**
- [ ] Comment Model
- [ ] API thêm comment (POST /api/posts/:id/comments)
- [ ] API lấy comments
- [ ] API xóa comment
- [ ] Component Comment (Frontend)
- [ ] Hiển thị comments trong Post

#### **Ngày 18-21: User Profile**
- [ ] API lấy thông tin user (GET /api/users/:id)
- [ ] API update profile (PUT /api/users/:id)
- [ ] API upload avatar
- [ ] Trang Profile (Frontend)
- [ ] Hiển thị posts của user
- [ ] Edit profile form

---

### ✅ TUẦN 4: MESSAGES & POLISH (Ngày 22-30)

#### **Ngày 22-25: Real-time Chat**
- [ ] Message Model
- [ ] API gửi message (POST /api/messages)
- [ ] API lấy conversations
- [ ] Socket.io setup (real-time)
- [ ] Chat UI (Frontend)
- [ ] Hiển thị tin nhắn real-time

#### **Ngày 26-28: Friends & Polish**
- [ ] Friend requests (nếu còn thời gian)
- [ ] Responsive design (mobile)
- [ ] Loading states
- [ ] Error handling
- [ ] UI/UX improvements

#### **Ngày 29-30: Testing & Deployment**
- [ ] Test tất cả features
- [ ] Fix bugs
- [ ] Deploy Backend (Render/Railway)
- [ ] Deploy Frontend (Vercel/Netlify)

---

## 💾 MONGODB SCHEMAS

### User Schema
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  avatar: String,
  coverPhoto: String,
  bio: String,
  friends: [ObjectId],
  createdAt: Date
}
```

### Post Schema
```javascript
{
  userId: ObjectId (ref: User),
  content: String,
  image: String,
  likes: [ObjectId],
  createdAt: Date
}
```

### Comment Schema
```javascript
{
  postId: ObjectId (ref: Post),
  userId: ObjectId (ref: User),
  content: String,
  createdAt: Date
}
```

### Message Schema
```javascript
{
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  content: String,
  read: Boolean,
  createdAt: Date
}
```

---

## 🛠️ TECH STACK

### Frontend
- ⚛️ React 18
- ⚡ Vite
- 🎨 CSS thuần
- 🔄 Axios
- 🧭 React Router

### Backend
- 🟢 Node.js
- 🚂 Express.js
- 🍃 MongoDB + Mongoose
- 🔐 JWT (jsonwebtoken)
- 🔒 Bcrypt (mã hóa password)
- 📁 Multer (upload file)
- ⚡ Socket.io (real-time chat)

---

## 📦 FILE .ENV MẪU (Backend)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/facebook-clone
JWT_SECRET=your_super_secret_key_here_change_this
NODE_ENV=development
```

---

## 🚀 LỆNH CHẠY PROJECT

### Backend
```bash
cd server
npm run dev      # Chạy với nodemon
```

### Frontend
```bash
cd client
npm run dev      # Vite dev server
```

---

## 🎨 FEATURES CỐT LÕI (MỨC TỐI THIỂU)

✅ **PHẢI CÓ (30 ngày):**
1. ✅ Login/Register với JWT
2. ✅ Tạo, xem, xóa posts
3. ✅ Like/Unlike posts
4. ✅ Comments
5. ✅ User Profile
6. ✅ Upload ảnh
7. ✅ Messages cơ bản

❌ **BỎ QUA (nếu hết thời gian):**
- Stories
- Friend requests/suggestions
- Groups
- Marketplace
- Video calls
- Notifications real-time

---

## 💡 TIPS QUAN TRỌNG

### 1. **Làm Backend trước, Frontend sau**
   - Backend xong 1 API → Test ngay bằng Postman
   - Rồi mới làm Frontend gọi API đó

### 2. **MongoDB Compass**
   - Cài MongoDB Community Server
   - Dùng Compass để xem data trực quan
   - Connection string: `mongodb://localhost:27017`

### 3. **JWT Flow**
   ```
   Login → Backend tạo token → Gửi về Frontend
   → Frontend lưu localStorage → Mỗi request gửi kèm token
   → Backend verify token → Cho phép/Từ chối
   ```

### 4. **Tránh perfectionism**
   - UI không cần đẹp như Facebook thật
   - Chỉ cần đủ dùng, responsive cơ bản
   - Tập trung vào chức năng

### 5. **Git commit mỗi ngày**
   ```bash
   git add .
   git commit -m "Day X: Completed authentication"
   git push
   ```

---

## 📚 TÀI LIỆU THAM KHẢO NHANH

- **MongoDB**: https://mongoosejs.com/docs/
- **JWT**: https://jwt.io/
- **Express**: https://expressjs.com/
- **React Router**: https://reactrouter.com/

---

## 🎯 MỤC TIÊU HÀNG NGÀY

- **Mỗi ngày code tối thiểu 3-4 giờ**
- **Hoàn thành 1-2 tasks nhỏ mỗi ngày**
- **Commit code mỗi tối**
- **Test feature ngay sau khi làm xong**

---

**BයයY GIỜ BẮT TAY VÀO LÀM THÔI! 💪🔥**

_"Done is better than perfect" - Ship it!_
