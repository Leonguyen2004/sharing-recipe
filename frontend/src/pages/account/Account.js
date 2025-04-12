import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RecipeCard from '../../components/recipe/RecipeCard';
import './Account.css';
import SocialLinks from './components/SocialLinks';
import { getUserProfile, getUserRecipes, getSavedRecipes } from '../../services/userService';

const Account = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [personalRecipes, setPersonalRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Lấy thông tin người dùng
        const userData = await getUserProfile(userId);
        setUser(userData);

        // Lấy công thức cá nhân
        const personalRecipesData = await getUserRecipes(userId);
        setPersonalRecipes(personalRecipesData);

        // Lấy công thức đã lưu
        const savedRecipesData = await getSavedRecipes(userId);
        setSavedRecipes(savedRecipesData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div className="account-loading">Loading user profile...</div>;
  }

  if (!user) {
    return <div className="account-not-found">User not found</div>;
  }

  // Helper function to render recipe cards in rows of 4
  const renderRecipeRows = (recipes) => {
    const rows = [];
    for (let i = 0; i < recipes.length; i += 4) {
      const rowItems = recipes.slice(i, i + 4);
      rows.push(
        <div key={`row-${i}`} className="recipe-row">
          {rowItems.map(recipe => (
            <RecipeCard key={recipe.id} variant="saved" recipe={recipe} />
          ))}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="account-container">
      <div className="account-header">
        <div className="account-avatar">
          <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.displayName}`} alt={`${user.displayName}'s avatar`} />
        </div>
        <div className="account-info">
          <h1 className="account-name">{user.displayName}</h1>
          <p className="account-bio">{user.description}</p>
          <SocialLinks socialLinks={user.socialLinks} />
        </div>
      </div>

      <div className="account-recipes">
        <section className="recipes-section">
          <h2 className="section-title">Personal Recipes</h2>
          <div className="recipes-grid">
            {renderRecipeRows(personalRecipes)}
          </div>
        </section>

        <section className="recipes-section">
          <h2 className="section-title">Saved Recipes</h2>
          <div className="recipes-grid">
            {renderRecipeRows(savedRecipes)}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Account;