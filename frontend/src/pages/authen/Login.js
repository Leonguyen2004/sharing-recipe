import { Eye, KeyRound, Mail, EyeOff } from 'lucide-react';
import React, { useState } from "react";
import "./Login.scss";


const Login = ({ onClose, onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  //if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
    onClose(); // Đóng modal sau khi login
  };

  return (
    <div className="overlay">
      <div className="login-box">
        <button className="close-btn" onClick={onClose}>✖</button>
        <div className="welcome-label">
          <h2 className="welcome-text">Welcome to</h2>
          <h1 className="brand-text">LET COOK</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="icon"> <Mail/> </span>
            <div className="input-wrapper">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <span className="icon"> <KeyRound/> </span>
            <div className="input-wrapper">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <div className="options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
        <p>
          Don't have an account? <span className="switch-link" onClick={onSwitch}>SignUp</span>
        </p>
      </div>
    </div>
  );
};

export default Login;