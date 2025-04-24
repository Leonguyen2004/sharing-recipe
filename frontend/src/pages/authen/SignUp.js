"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Mail, KeyRound, CircleUser, Eye, EyeOff } from "lucide-react"
import styles from "./SignUp.module.scss"
import { registerUser } from "../../services/authService"
import { setToken } from "../../services/tokenService"

const SignUp = ({ onClose, onSwitch }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)

    try {
      const result = await registerUser(data.name, data.email, data.password)
      console.log("Registration successful:", result)

      // Lưu token sử dụng hàm setToken mới (luôn dùng sessionStorage cho đăng ký mới)
      setToken(result.token, false)

      // Store user info
      localStorage.setItem("user", JSON.stringify(result.user))

      // Hiển thị thông báo thành công cụ thể hơn
      alert("Đăng ký thành công! Tài khoản của bạn đã được tạo và lưu vào hệ thống. Bạn có thể đăng nhập ngay bây giờ.")
      onSwitch() // Switch to login form
    } catch (error) {
      console.error("Registration error:", error)

      // Handle different Firebase auth errors
      if (error.code === "auth/email-already-in-use") {
        setError("Email đã được sử dụng. Vui lòng dùng email khác hoặc đăng nhập.")
      } else if (error.code === "auth/weak-password") {
        setError("Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.")
      } else {
        setError("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles["login-box"]}>
        <button className={styles["close-btn"]} onClick={onClose}>
          ✖
        </button>
        <div className={styles["welcome-label"]}>
          <h2 className={styles["welcome-text"]}>Welcome to</h2>
          <h1 className={styles["brand-text"]}>LET COOK</h1>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles["input-group"]}>
            <span className={styles.icon}>
              <CircleUser />
            </span>
            <div className={styles["input-wrapper"]}>
              <label>Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="John Doe"
                disabled={loading}
              />
              {errors.name && <p className={styles.error}>{errors.name.message}</p>}
            </div>
          </div>

          <div className={styles["input-group"]}>
            <span className={styles.icon}>
              <Mail />
            </span>
            <div className={styles["input-wrapper"]}>
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
                disabled={loading}
              />
              {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>
          </div>

          <div className={styles["input-group"]}>
            <span className={styles.icon}>
              <KeyRound />
            </span>
            <div className={styles["input-wrapper"]}>
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                placeholder="********"
                disabled={loading}
              />
              {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            </div>
            <button
              type="button"
              className={styles["toggle-password"]}
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <div className={styles["input-group"]}>
            <span className={styles.icon}>
              <KeyRound />
            </span>
            <div className={styles["input-wrapper"]}>
              <label>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watch("password") || "Passwords do not match",
                })}
                placeholder="********"
                disabled={loading}
              />
              {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button type="submit" className={styles["login-button"]} disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <span className={styles["switch-link"]} onClick={onSwitch}>
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignUp
