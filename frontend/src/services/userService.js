import { getToken } from "./tokenService";
// API base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Get all user
export const getAllUsers = async (params) => {
    try {
        const token = getToken();
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/users/admin/all${queryString ? `?${queryString}` : ''}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');                        
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error getting all user:', error);
        throw error;
    }
}

// update ban status
export const updateUserBanStatus = async (uid, bannedStatus) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/users/ban/${uid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ banned: bannedStatus })
        });

        if (!response.ok) {
        throw new Error('Failed to update user ban status');
        }
    } catch (error) {
        console.error('Error updating user ban status:', error);
    }
};

// Lấy thông tin chi tiết người dùng
export const getUserProfile = async (uid) => {
    try {
        const token = getToken();
        //console.log(token);
        
        const response = await fetch(`${API_URL}/users/${uid}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');                        
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
}

// Cập nhật thông tin người dùng
export const updateUserProfile = async (uid, userData) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/users/${uid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update user profile');
        }
        
        return true;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

// Kiểm tra xem người dùng đã tồn tại chưa (qua email)
export const checkUserExists = async (email) => {
    try {
        const response = await fetch(`${API_URL}/users/check-exists?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
            throw new Error('Failed to check user existence');
        }
        
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error('Error checking user exists:', error);
        throw error;
    }
}