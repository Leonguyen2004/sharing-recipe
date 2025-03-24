import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import RecipeDetail from "./pages/recipedetail/RecipeDetail";
import RecipeForm from "./pages/recipeform/RecipeForm";

function App() {
  return (      
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/recipeform" element={<RecipeForm />} />
        <Route path="/recipe-detail" element={<RecipeDetail/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;