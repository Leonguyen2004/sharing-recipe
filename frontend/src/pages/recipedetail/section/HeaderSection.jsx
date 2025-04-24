import { Heart, Printer, Share2, Star, Bookmark } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../../components/breadcumb/Breadcrumb';
import IconButton from '../../../components/button/IconButton';
import StarRating from '../../../components/starrating/StarRating';
import './HeaderSection.css';
import { getUserProfile } from '../../../services/userService';
import { useSavedRecipe } from '../../../context/SavedRecipeContext';
import { useAuth } from '../../../context/AuthContext';
import { saveRecipe, unSaveRecipe } from "../../../services/recipeService"
import { toast } from "react-toastify"
import { formatTimestampToDateTime } from '../../../services/timeService';

const HeaderSection = ({ recipe, stats }) => {
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null);
  const [isSaved, setIsSaved] = useState(false)
  const { savedRecipes, refreshSavedRecipes } = useSavedRecipe();
  const { currentUser } = useAuth();
  
  // Kiểm tra xem recipe đã được lưu hay chưa
  useEffect(() => {
    const checkIfRecipeIsSaved = async () => {
      if (!currentUser  || !savedRecipes) return;
      
      try {
        const isRecipeSaved = savedRecipes.some(savedRecipe => savedRecipe.id === recipe.id);
        setIsSaved(isRecipeSaved);
        console.log("check")
      } catch (error) {
        console.error('Error checking if recipe is saved:', error);
      }
    };

    checkIfRecipeIsSaved();
  }, [currentUser, savedRecipes]);
  
  // Lấy tên tác giả
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile(recipe.userId);
        setAuthor(userData);
      } catch(error) {
        console.error('Lỗi khi tải dữ liệu author', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [])

  if (loading) {
    return <div className="rdpage-container">Đang tải...</div>;
  }

  // Xử lý sự kiện lưu/hủy lưu recipe
  const handleSaveRecipe = async () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để lưu công thức');
      return;
    }

    if(loading) {
      console.log("dang load cho khac")
      return;
    };

    setLoading(true);
    try {
      if (isSaved) {
        await unSaveRecipe(recipe.id);
        setIsSaved(false);
        refreshSavedRecipes();
        toast.success('Đã xóa công thức khỏi danh sách đã lưu');
      } else {
        await saveRecipe(recipe.id);
        setIsSaved(true);
        refreshSavedRecipes();
        toast.success('Đã lưu công thức thành công');
      }
    } catch (error) {
      console.error('Error saving/unsaving recipe:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="rdpage-recipe-header">
      <Breadcrumb items={recipe.categories} />
      
      <h1 className="rdpage-recipe-title">{recipe.title}</h1>
      
      <div className="rdpage-recipe-meta">
        <div className="rdpage-rating-container">
          <StarRating rating={stats.average} count={stats.total}/>
          <a className="rdpage-reviews-link" onClick={(e) => scrollToSection("review-list")}>{stats.total} REVIEWS</a>
          <a href="#photos" className="rdpage-photos-link">0 PHOTOS</a>
        </div>
      </div>
      
      <p className="rdpage-recipe-description">
        {recipe.description || "This breakfast fried rice is a twist on bacon and eggs! My dad used to make this for me on Saturday mornings when I was a kid; it's an easy and tasty brunch option. You can substitute one bunch of broccoli for frozen peas if desired."}
      </p>
      
      <div className="rdpage-recipe-author">
        <span>Submitted by <strong>{author.displayName}</strong></span>
        <span className="rdpage-recipe-date">Updated on {formatTimestampToDateTime(recipe.updatedAt || recipe.createdAt)}</span>
      </div>
      
      <div className="rdpage-recipe-actions">
        {isSaved ? (
          <IconButton 
            icon={<Heart size={18} />} 
            variant="saved"
            onClick={handleSaveRecipe}
          >
            SAVE
          </IconButton>
        ) : (
          <IconButton 
            icon={<Heart size={18} />} 
            variant="primary"
            onClick={handleSaveRecipe}
          >
            SAVE
          </IconButton>
        )}
        
        <IconButton 
          icon={<Star size={18} />} 
          variant="primary"
          onClick={(e) => scrollToSection("reviews")}
        >
          RATE
        </IconButton>
        
        <IconButton 
          icon={<Share2 size={18} />} 
          variant="primary"
        >
          SHARE
        </IconButton>
      </div>
    </div>
  );
};

export default HeaderSection;