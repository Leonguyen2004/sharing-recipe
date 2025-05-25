import { ArrowDown, ArrowUp, Check, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { RPRecipeCard } from "../../../components/recipe/RPRecipeCard";
import { getRecipesPending } from '../../../services/recipeService';
import SearchBar from '../searchbar/Searchbar';
import './ContentApproval.css';
import IconButton from '../../../components/button/IconButton';
import { setRecipeStatus } from '../../../services/recipeService';

const ContentApproval = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [isShowRejected, setIsShowRejected] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await getRecipesPending();
        setPendingRecipes(response);
      } catch (error) {
        console.error("error fectch pending data")
      }
    }

    fetchRecipe()
  }, []);

  const handleShowRejected = () => {
    setIsShowRejected(!isShowRejected)
  }
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  function toDate(obj) {
    return new Date(obj._seconds * 1000 + obj._nanoseconds / 1e6);
  }

  const sortedAndFilteredPosts = pendingRecipes
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = toDate(a.createdAt);
      const dateB = toDate(b.createdAt);
      
      if (sortOrder === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

  const handleApprove = async (id) => {
    try {
      await setRecipeStatus(id, "public");
      setPendingRecipes(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      console.error("Duyệt bài thất bại:", error);
    }
  };
  
  const handleReject = async (id) => {
    try {
      await setRecipeStatus(id, "reject");
      setPendingRecipes(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      console.error("Từ chối bài thất bại:", error);
    }
  };

  return (
    <div className="adpage-content-approval">
      <div className="adpage-section-header">
        <h1>Content Approval</h1>
      </div>
      
      <div className="adpage-content-controls">
        <SearchBar placeholder="Search posts..." onSearch={handleSearch} />
        <div className="adpage-sort-controls">
          <button 
            className={`adpage-sort-btn ${isShowRejected ? 'adpage-active' : ''}`}
            onClick={handleShowRejected}
          >
            Show Rejected
          </button>
          <button 
            className={`adpage-sort-btn ${sortOrder === 'newest' ? 'adpage-active' : ''}`}
            onClick={() => handleSortChange('newest')}
          >
            <ArrowDown size={16} /> Newest
          </button>
          <button 
            className={`adpage-sort-btn ${sortOrder === 'oldest' ? 'adpage-active' : ''}`}
            onClick={() => handleSortChange('oldest')}
          >
            <ArrowUp size={16} /> Oldest
          </button>
        </div>
      </div>

      <div className="adpage-posts-list">
        {sortedAndFilteredPosts.filter(recipe => isShowRejected || recipe.status !== 'reject').length === 0 && (
          <div className="adpage-no-posts">No posts found</div>
        )}

        <div className="admin-content-grid">
          {sortedAndFilteredPosts
            .filter(recipe => isShowRejected || recipe.status !== 'reject')
            .map((recipe) => (
            <div className='adpage-content-card' key={recipe.id}>
              <RPRecipeCard recipe={recipe} className={"horizontal"}/>
              <div className='adpage-content-button-group'>
                <IconButton variant='fullwidth primary' icon={<Check/>} onClick={(e) => handleApprove(recipe.id)}>Approve</IconButton>
                {recipe.status !== 'reject' && (
                  <IconButton
                    variant='fullwidth cancel'
                    icon={<X />}
                    onClick={(e) => handleReject(recipe.id)}
                  >
                    Reject
                  </IconButton>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ContentApproval;