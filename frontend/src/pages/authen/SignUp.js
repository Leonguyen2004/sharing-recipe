import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, KeyRound, CircleUser, Eye, EyeOff } from "lucide-react";
import "./SignUp.scss";

const SignUp = ({ onClose, onSwitch }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    //onClose(); // Đóng modal sau khi đăng ký
    //onSwitch();
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="overlay">
      <div className="login-box">
        <button className="close-btn" onClick={onClose}>✖</button>
        <div className="welcome-label">
          <h2 className="welcome-text">Welcome to</h2>
          <h1 className="brand-text">LET COOK</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <span className="icon"><CircleUser /></span>
            <div className="input-wrapper">
              <label>Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="John Doe"
              />
              {errors.name && <p className="error">{errors.name.message}</p>}
            </div>
          </div>

          <div className="input-group">
            <span className="icon"><Mail /></span>
            <div className="input-wrapper">
              <label>Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
                placeholder="example@gmail.com"
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>
          </div>

          <div className="input-group">
            <span className="icon"><KeyRound /></span>
            <div className="input-wrapper">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                placeholder="********"
              />
              {errors.password && <p className="error">{errors.password.message}</p>}
            </div>
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <div className="input-group">
            <span className="icon"><KeyRound /></span>
            <div className="input-wrapper">
              <label>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watch("password") || "Passwords do not match",
                })}
                placeholder="********"
              />
              {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button type="submit" className="login-button">Sign Up</button>
        </form>
        <p>
          Already have an account? <span className="switch-link" onClick={onSwitch}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;