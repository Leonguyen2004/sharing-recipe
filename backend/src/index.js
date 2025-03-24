const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json()); // Middleware để đọc dữ liệu JSON
app.use(cors());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.log("❌ Lỗi kết nối MongoDB:", err));

// API thêm User
app.post("/api/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/recipe", async (req, res) => {
  
});

// Chạy server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});