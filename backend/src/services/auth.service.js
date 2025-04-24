import { auth, db } from '../config/firebase.js';

export const registerUser = async ({ name, email, password }) => {
  try {
    // Tạo user trong Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });

    // Lưu thông tin user vào Firestore
    await db.collection('users').doc(userRecord.uid).set({
      displayName: name,
      description: "",
      socialLinks: {
        facebook: "",
        instagram: "",
        twitter: "",
      },
      email,
      photoURL: "",
      photoPublicId: "",
      role: "user",
      banned: false,
      createdAt: new Date(),
      lastLoginAt: new Date()
    });

    // Tạo custom token để frontend có thể đăng nhập
    const token = await auth.createCustomToken(userRecord.uid);

    return {
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: name
      },
      token
    };
  } catch(error) {
    console.error('Error register user:', error);
    throw error;
  }
};