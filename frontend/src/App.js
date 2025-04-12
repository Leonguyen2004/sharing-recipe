import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import RecipeDetail from "./pages/recipedetail/RecipeDetail";
import RecipeForm from "./pages/recipeform/RecipeForm";
import HomePage from "./pages/homepage/HomePage";
import Profile from "./pages/profilepage/Profile";
import Favorites from "./pages/favorites/Favorites";
import Search from "./pages/searchpage/Search";
import AdminPage from "./pages/adminpage/AdminPage";
import CategoryPage from "./pages/categorypage/CategoryPage";
import Account from "./pages/account/Account";

// Tạo layout chính cho các trang thường
const MainLayout = () => (
  <>
    <div style={{ marginBottom: "124px" }}>
      <Navbar />
    </div>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/recipe-form" element={<RecipeForm />} />
      <Route path="/recipe-form/edit/:id" element={<RecipeForm />} />
      <Route path="/recipe-detail" element={<RecipeDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/search" element={<Search />} />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/account/:userId" element={<Account />} />
    </Routes>
    <Footer />
  </>
);

// Layout riêng cho admin (không có Navbar và Footer)
const AdminLayout = () => (
  <AdminPage/>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route cho admin (không có Navbar/Footer) */}
        <Route path="/admin/*" element={<AdminLayout />} />
        
        {/* Tất cả các route khác sử dụng MainLayout */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;