import { auth, db } from "../firebase/config"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, updateDoc, serverTimestamp  } from 'firebase/firestore';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Register a new user
export const registerUser = async (name, email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw {
                code: data.code || 'auth/unknown',
                message: data.message || 'Đăng ký thất bại'
            };
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// Login user
export const loginUser = async (email, password, rememberMe = false) => {
    try {
        // Sử dụng Firebase Auth SDK để đăng nhập
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Lấy token ID của người dùng
        const idToken = await user.getIdToken();

        // ✅ Cập nhật lastLoginAt vào Firestore (dùng new Date())
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            lastLoginAt: serverTimestamp()
        });
        
        // Trả về thông tin người dùng và token
        return {
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            },
            token: idToken
        };
    } catch (error) {
        console.error('Login error:', error);
        throw (error)
    }
}

// Logout user
export const logoutUser = async () => {
    try {
        // Sử dụng Firebase Auth SDK để đăng xuất
        await signOut(auth);
        return true;
    } catch (error) {
        throw error;
    }
}

// Verify token with backend
export const verifyToken = async (token) => {
    try {
        const response = await fetch(`${API_URL}/auth/verify-token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Token verification failed');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}  