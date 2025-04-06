import { ArrowRight, Search as SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeCard from "../../components/recipe/RecipeCard";
import './Search.css';
import Pagination from '../../components/pagination/Pagination';
import {recipesList} from "../../resource/recipe-data";


const Search = () => {
    const location = useLocation();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 21 // 3 cards per row × 10 rows

    // Calculate total pages
    const totalPages = Math.ceil(recipesList.length / itemsPerPage)

    // Get current recipes
    const indexOfLastRecipe = currentPage * itemsPerPage
    const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage
    const currentRecipes = recipesList.slice(indexOfFirstRecipe, indexOfLastRecipe)

    // Lấy query từ URL và làm state ban đầu cho input
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get('q') || '';

    const [inputValue, setInputValue] = useState(initialQuery);

    // Theo dõi thay đổi query từ URL
    useEffect(() => {
        const newSearchParams = new URLSearchParams(location.search);
        const newQuery = newSearchParams.get('q') || '';
        setInputValue(newQuery); // Cập nhật giá trị input khi URL thay đổi
    }, [location.search]);

    console.log("re-render in search page");

    const handleChange = (e) => {     
        setInputValue(e.target.value); // Cập nhật giá trị input khi người dùng nhập
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Searching for:', inputValue);
        if (inputValue.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(inputValue)}`;
        }
    }

    // Change page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
        // Scroll to top when changing page
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <div className='srchpage-container'>
            <div className="srchpage-search">
                <p className='srchpage-title'>
                    Search Result For
                </p>
                <form onSubmit={handleSubmit} className="srchpage-search-bar">
                    <div className="srchpage-search-input-container">
                        <span className="srchpage-search-icon">
                            <SearchIcon size={18} />
                        </span>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="srchpage-go-button">
                        <ArrowRight size={20} strokeWidth={3}/>
                    </button>
                </form>
            </div>

            <div className='srchpage-recipes'>
                {currentRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} variant="fresh" recipe={recipe} />
                ))}
            </div>

            {/* Use the Pagination component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="srchpage-pagination"
            />
        </div>
    );
};

export default Search;