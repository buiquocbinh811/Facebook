import { useState } from 'react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });

  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Facebook</h1>
        <p>Đăng nhập để tiếp tục</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit">Đăng nhập</button>
        </form>
        
        <a href="/register">Chưa có tài khoản? Đăng ký</a>
      </div>
    </div>
  );
}

export default Login;
