// import admin from 'firebase-admin';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Cấu hình dotenv
// dotenv.config();

// // Lấy đường dẫn hiện tại của file
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Khởi tạo Firebase Admin
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// const db = admin.firestore();

// // Mảng chứa dữ liệu recipes mẫu
// const sampleRecipes = [
//   {
//     title: "Phở Bò",
//     description: "Món phở bò truyền thống Việt Nam",
//     ingredients: [
//       "400g bò thái mỏng",
//       "200g bánh phở",
//       "2 củ gừng",
//       "2 củ hành tây",
//       "Gia vị: hồi, quế, thảo quả, đinh hương"
//     ],
//     instructions: [
//       "Nướng gừng và hành tây",
//       "Nấu nước dùng với xương bò và gia vị",
//       "Trần bánh phở qua nước sôi",
//       "Xếp bánh phở vào tô, thêm thịt bò tái",
//       "Chan nước dùng nóng vào"
//     ],
//     cookingTime: 120,
//     servings: 4,
//     difficulty: "Trung bình",
//     category: "Món chính",
//     imageUrl: "https://example.com/pho.jpg",
//     createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     updatedAt: admin.firestore.FieldValue.serverTimestamp()
//   },
//   // Thêm các recipe khác vào đây
// ];

// // Hàm upload recipes
// async function uploadRecipes() {
//   try {
//     const batch = db.batch();
//     const recipesRef = db.collection('recipes');

//     sampleRecipes.forEach((recipe) => {
//       const docRef = recipesRef.doc();
//       batch.set(docRef, recipe);
//     });

//     await batch.commit();
//     console.log('Đã upload thành công các recipes!');
//   } catch (error) {
//     console.error('Lỗi khi upload recipes:', error);
//   } finally {
//     // Đóng kết nối Firebase
//     admin.app().delete();
//   }
// }

// // Chạy hàm upload
// uploadRecipes(); 