import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RPRecipeCard } from '../../components/recipe/RPRecipeCard';
import { getSavedRecipes, getUserRecipes } from '../../services/recipeService';
import { getUserProfile } from '../../services/userService';
import './Account.css';
import SocialLinks from './components/SocialLinks';

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
        const filteredPersonalRecipes = personalRecipesData.filter(recipe => recipe.status === 'public');
        setPersonalRecipes(filteredPersonalRecipes);

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
    return (
      <div className="accpage-recipe-grid">
        {recipes.map((recipe) => (
          <RPRecipeCard key={recipe.id} recipe={recipe} className={"horizontal"}/>
        ))}
      </div>
    )
  };

  return (
    <div className="account-container">
      <div className="account-header">
        <div className="account-avatar">
          <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt={`${user.displayName}'s avatar`} />
        </div>
        <div className="account-info">
          <h1 className="account-name">{user.displayName}</h1>
          <p className="account-bio">{user.description}</p>
          <SocialLinks facebook={user.facebook} instagram={user.instagram}/>
        </div>
      </div>

      <div className="account-recipes">
        <section className="recipes-section">
          <h2 className="section-title">Personal Recipes</h2>
          <div>
            {renderRecipeRows(personalRecipes)}
          </div>
        </section>

        <section className="recipes-section">
          <h2 className="section-title">Saved Recipes</h2>
          <div>
            {renderRecipeRows(savedRecipes)}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Account;