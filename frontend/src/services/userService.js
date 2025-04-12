import { 
    doc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    deleteDoc
} from "firebase/firestore"
import { db } from "../firebase/config"

// Lấy thông tin chi tiết người dùng
export const getUserProfile = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, "users", uid))
        
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() }
        } else {
            throw new Error("User not found")
        }
    } catch (error) {
        throw error
    }
}

// Cập nhật thông tin người dùng
export const updateUserProfile = async (uid, userData) => {
    try {
        await updateDoc(doc(db, "users", uid), userData)
        return true
    } catch (error) {
        throw error
    }
}

// Lưu công thức để xem sau
export const saveRecipe = async (uid, recipeId) => {
    try {
        // Tạo document mới trong collection savedRecipes
        await addDoc(collection(db, "savedRecipes"), {
            userId: uid,
            recipeId: recipeId,
            createdAt: new Date()
        });
        return true;
    } catch (error) {
        throw error;
    }
}

// Xóa công thức khỏi danh sách đã lưu
export const unSaveRecipe = async (uid, recipeId) => {
    try {
        // Tìm document trong collection savedRecipes có userId và recipeId tương ứng
        const savedRecipesQuery = query(
            collection(db, "savedRecipes"),
            where("userId", "==", uid),
            where("recipeId", "==", recipeId)
        );
        const querySnapshot = await getDocs(savedRecipesQuery);
        
        // Xóa document tìm được
        if (!querySnapshot.empty) {
            const docToDelete = querySnapshot.docs[0];
            await deleteDoc(doc(db, "savedRecipes", docToDelete.id));
        }
        
        return true;
    } catch (error) {
        throw error;
    }
}

// Kiểm tra xem người dùng đã tồn tại chưa (qua email)
export const checkUserExists = async (email) => {
    try {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("email", "==", email))
        const querySnapshot = await getDocs(q)
        
        return !querySnapshot.empty
    } catch (error) {
        throw error
    }
}

// Lấy danh sách công thức cá nhân của người dùng
export const getUserRecipes = async (uid) => {
    try {
        const recipesQuery = query(
            collection(db, 'recipes'),
            where('userId', '==', uid)
        );
        const recipesSnapshot = await getDocs(recipesQuery);
        return recipesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw error;
    }
}

// Lấy danh sách công thức đã lưu của người dùng
export const getSavedRecipes = async (uid) => {
    try {
        const savedRecipesQuery = query(
            collection(db, 'savedRecipes'),
            where('userId', '==', uid)
        );
        const savedRecipesSnapshot = await getDocs(savedRecipesQuery);
        const savedRecipesData = await Promise.all(
            savedRecipesSnapshot.docs.map(async (doc) => {
                const recipeDoc = await getDoc(doc(db, 'recipes', doc.data().recipeId));
                return {
                    id: recipeDoc.id,
                    ...recipeDoc.data()
                };
            })
        );
        return savedRecipesData;
    } catch (error) {
        throw error;
    }
}
