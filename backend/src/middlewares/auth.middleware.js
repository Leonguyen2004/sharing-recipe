import { auth, db } from "../config/firebase.js";

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = { uid: decodedToken.uid }; // Khởi tạo req.user với uid
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const attachUserData = async (req, res, next) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      console.log("User not found in Firestore");
      return res.status(404).json({ error: "User not found" });
    }
    
    // Gán dữ liệu user vào req.user mà không ghi đè uid
    req.user = { ...req.user, ...userDoc.data() };
    next();
  } catch (err) {
    res.status(500).json({ error: "Failed to load user data" });
  }
};

export const isRecipeAuthorOrAdmin = async (req, res, next) => {
  const recipeId = req.params.recipeId; // giả sử ID nằm trong URL
  try {
    const recipeDoc = await db.collection("recipes").doc(recipeId).get();
    if (!recipeDoc.exists) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const recipeData = recipeDoc.data();
    const userId = req.user.uid;
    const userRole = req.user.role;

    if (recipeData.userId === userId || userRole === "admin") {
      next();
    } else {
      return res.status(403).json({ error: "Forbidden: Not the recipe author or admin" });
    }
  } catch (error) {
    console.error("Error checking recipe author:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const isReviewAuthorOrAdmin = async (req, res, next) => {
  const reviewId = req.params.reviewId; // giả sử ID nằm trong URL
  try {
    const reviewDoc = await db.collection("reviews").doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({ error: "Review not found" });
    }

    const reviewData = reviewDoc.data();
    const userId = req.user.uid;
    const userRole = req.user.role;

    if (reviewData.authorId === userId || userRole === "admin") {
      next();
    } else {
      return res.status(403).json({ error: "Forbidden: Not the review author or admin" });
    }
  } catch (error) {
    console.error("Error checking review author:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
};

export const isSelfOrAdmin = (req, res, next) => {
  const currentUserId = req.user.uid;
  const currentUserRole = req.user.role;
  const targetUserId = req.params.uid;

  if (currentUserId === targetUserId || currentUserRole === "admin") {
    return next();
  } else {
    return res.status(403).json({ error: "Forbidden: Not the user or admin" });
  }
};
