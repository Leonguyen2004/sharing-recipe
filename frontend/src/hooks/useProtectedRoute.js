"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export const useProtectedRoute = (redirectPath = "/login") => {
  const { currentUser, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate(redirectPath)
    }
  }, [currentUser, loading, redirectPath, navigate])

  return { currentUser, loading }
}