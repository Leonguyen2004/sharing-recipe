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

function App() {
  return (      
    <BrowserRouter>
      <div style={{ marginBottom: "150px" }}>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipeform" element={<RecipeForm />} />
        <Route path="/recipe-detail" element={<RecipeDetail/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;