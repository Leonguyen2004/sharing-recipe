import 'dotenv/config';
import express from "express";
import cors from "cors";
import fileUpload from 'express-fileupload';
import authRoutes from "./routes/auth.routes.js";
import cloudinaryRoutes from "./routes/cloudinary.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import userRoutes from "./routes/user.routes.js";
import reviewRoutes from './routes/review.routes.js';
import adminRoutes from './routes/admin.routes.js';

const server = express();

// Middleware
server.use(cors());
server.use(express.json());
server.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Routes
server.use("/api/auth", authRoutes);
server.use("/api/cloudinary", cloudinaryRoutes);
server.use("/api/recipes", recipeRoutes);
server.use("/api/categories", categoryRoutes);
server.use("/api/users", userRoutes);
server.use('/api/reviews', reviewRoutes);
server.use('/api/admin', adminRoutes)

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});