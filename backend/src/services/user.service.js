import { db } from '../config/firebase.js';

// Lấy thông tin chi tiết người dùng
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (userDoc.exists) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Cập nhật thông tin người dùng
export const updateUserProfile = async (uid, userData) => {
  try {
    await db.collection('users').doc(uid).update(userData);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Kiểm tra xem người dùng đã tồn tại chưa (qua email)
export const checkUserExists = async (email) => {
  try {
    const usersRef = db.collection('users');
    const q = usersRef.where('email', '==', email);
    const querySnapshot = await q.get();
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking user exists:', error);
    throw error;
  }
}; 

export const getAllUsers = async () => {
  try {
    const usersCollection = db.collection('users');
    const snapshot = await usersCollection.get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return users;
  } catch (error) {
    console.error('Error checking user exists:', error);
    throw error;
  }
}

export const updateUserBanStatus = async (userId, banned) => {
  try {
    const userRef = db.collection('users').doc(userId);
    await userRef.update({ banned });

    return { message: 'User ban status updated successfully' };
  } catch (error) {
    console.error('Error updating user ban status:', error);
    throw error;
  }
};

