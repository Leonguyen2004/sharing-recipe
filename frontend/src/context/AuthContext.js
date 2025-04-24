"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth"
import { auth } from "../firebase/config"
import { verifyToken } from "../services/authService"
import { setToken } from "../services/tokenService"

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Khi người dùng đăng nhập / đăng xuất
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        try {
          const existingToken = await user.getIdToken() // Không dùng true ở đây
          setToken(existingToken)
          await verifyToken(existingToken)
        } catch (error) {
          console.error("Token verification failed (login):", error)
          setToken(null)
        }
      } else {
        setToken(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Lắng nghe khi Firebase tự refresh token
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          const refreshedToken = await user.getIdToken() // ✅ token mới đã được Firebase cập nhật
          setToken(refreshedToken)
          await verifyToken(refreshedToken)
        } catch (error) {
          console.error("Token verification failed (refresh):", error)
          setToken(null)
        }
      } else {
        setToken(null)
      }
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}