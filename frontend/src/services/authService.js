import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
} from "firebase/auth"
import { auth, db } from "../firebase/config"
import { doc, setDoc } from "firebase/firestore"

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Register a new user
export const registerUser = async (name, email, password) => {
    try {
        // Create user in Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)

        // Update profile with name
        await updateProfile(userCredential.user, {
            displayName: name,
        })

        // Lưu thông tin người dùng vào Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            displayName: name,
            email: email,
            photoURL: "",
            role: "user",
            createdAt: new Date(),
            lastLoginAt: new Date(),
            recipes: [],
            savedRecipes: []
        })

        // Get ID token
        const token = await userCredential.user.getIdToken()

        // Return user data
        return {
            user: {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: name,
            },
            token,
        }
    } catch (error) {
        throw error
    }
}

// Login user
export const loginUser = async (email, password, rememberMe = false) => {
    try {
        // Set persistence based on rememberMe option
        const userCredential = await signInWithEmailAndPassword(auth, email, password)

        // Cập nhật thời gian đăng nhập cuối cùng trong Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            lastLoginAt: new Date()
        }, { merge: true })

        // Get ID token
        const token = await userCredential.user.getIdToken()

        // Return user data
        return {
            user: {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName,
            },
            token,
        }
    } catch (error) {
        throw error
    }
}

// Logout user
export const logoutUser = async () => {
    try {
        await signOut(auth)
        return true
    } catch (error) {
        throw error
    }
}

// Reset password
export const resetPassword = async (email) => {
try {
    await sendPasswordResetEmail(auth, email)
    return true
} catch (error) {
    throw error
}
}

// Verify token with backend
export const verifyToken = async (token) => {
try {
    const response = await fetch(`${API_URL}/auth/verify-token`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        throw new Error("Token verification failed")
    }

    return await response.json()
} catch (error) {
    throw error
}
}  