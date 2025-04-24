"use client"

import { Eye, KeyRound, Mail, EyeOff } from "lucide-react"
import { useState } from "react"
import styles from "./Login.module.scss"
import { loginUser } from "../../services/authService"
import { setToken } from "../../services/tokenService"

const Login = ({ onClose, onSwitch }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await loginUser(email, password, rememberMe)
      console.log("Login successful:", result)

      // Lưu token sử dụng hàm setToken mới
      setToken(result.token, rememberMe)

      // Store user info
      localStorage.setItem("user", JSON.stringify(result.user))

      // Close modal after successful login
      onClose()
    } catch (error) {
      console.error("Login error:", error)

      // Handle different Firebase auth errors
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setError("Invalid email or password")
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later.")
      } else {
        setError("An error occurred during login. Please try again.")
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
        <form onSubmit={handleSubmit}>
          <div className={styles["input-group"]}>
            <span className={styles.icon}>
              {" "}
              <Mail />{" "}
            </span>
            <div className={styles["input-wrapper"]}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles["input-group"]}>
            <span className={styles.icon}>
              {" "}
              <KeyRound />{" "}
            </span>
            <div className={styles["input-wrapper"]}>
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                disabled={loading}
              />
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

          <div className={styles.options}>
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={loading}
              />
              Remember me
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                // You can implement forgot password functionality here
                alert("Forgot password functionality will be implemented")
              }}
            >
              Forgot Password?
            </a>
          </div>

          <button type="submit" className={styles["login-button"]} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <span className={styles["switch-link"]} onClick={onSwitch}>
            SignUp
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login