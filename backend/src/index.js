import 'dotenv/config';
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import cloudinaryRoutes from "./routes/cloudinary.routes.js";

const server = express();

// Middleware
server.use(cors());
server.use(express.json());

// Routes
server.use("/api/auth", authRoutes);
server.use("/api/cloudinary", cloudinaryRoutes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});