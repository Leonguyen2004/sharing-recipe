"use client"

import { Bookmark, Clock, Eye, Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { useAuth } from "../../context/AuthContext"
import { useCategories } from "../../context/CategoryContext"
import { useSavedRecipe } from "../../context/SavedRecipeContext"
import { saveRecipe, unSaveRecipe } from "../../services/recipeService"
import styles from "./RPRecipeModal.module.css"
import { useNavigate } from "react-router-dom"
import { getRecipeSaveCount } from "../../services/recipeService"
import { getReviewStats } from "../../services/reviewService"
import defaultImage from "../../assets/img/recipe-image.jpeg";

export const RPRecipeModal = ({ recipe, onClose, isOpen, modalContainerClass }) => {
  const modalRef = useRef(null)
  const { categories } = useCategories()
  const { currentUser } = useAuth()
  const { savedRecipes, refreshSavedRecipes } = useSavedRecipe();
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [saveCount, setSaveCount] = useState(0);
  const [rating, setRating] = useState(0);

  const formatTime = (minutes) => {
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours} giờ ${remainingMinutes} phút` : `${hours} giờ`;
    }
    return `${minutes} phút`;
  };

  useEffect(() => {
    const fetchSaveCount = async () => {
      try {
        setIsLoading(true);
        const { saveCount } = await getRecipeSaveCount(recipe.id);
        setSaveCount(saveCount);
      } catch(error) {
        console.error('Error fetch save count:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSaveCount();
  }, [])

  useEffect(() => {
    const fetchViewStats = async () => {
      try {
        setIsLoading(true);
        const viewStats = await getReviewStats(recipe.id);
        setRating(viewStats.average);
      } catch(error) {
        console.error('Error fetch save count:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchViewStats();
  }, [])

  // Kiểm tra xem recipe đã được lưu hay chưa
  useEffect(() => {
    const checkIfRecipeIsSaved = async () => {
      if (!currentUser || !recipe) return;
      
      try {
        const isRecipeSaved = savedRecipes.some(savedRecipe => savedRecipe.id === recipe.id);
        setIsSaved(isRecipeSaved);
        console.log("check")
      } catch (error) {
        console.error('Error checking if recipe is saved:', error);
      }
    };

    checkIfRecipeIsSaved();
  }, [currentUser, recipe]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  if (!isOpen) return null

  // Handle mouse leave from the modal
  const handleModalMouseLeave = (e) => {
    onClose()
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  const handleViewRecipe = () => {
    navigate(`/recipe/${recipe.id}`);
  };  

  // Xử lý sự kiện lưu/hủy lưu recipe
  const handleSaveRecipe = async () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để lưu công thức');
      return;
    }

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.overlay} ${modalContainerClass || ""}`}>
      <div ref={modalRef} className={styles.modal} onMouseLeave={handleModalMouseLeave} >

        <div className={styles.modalContent}>
          {/* Image section at the top */}
          <div className={styles.imageWrapper}>
            <div className={styles.imageContainer}>
              <img src={recipe.imageUrl || defaultImage} alt={recipe.title} className={styles.image} />
            </div>
          </div>

          {/* Information section below */}
          <div className={styles.infoSection}>
            <div>
              <h2 className={styles.title}>{recipe.title}</h2>

              <div className={styles.categories}>
                {recipe.categories.slice(0, 4).map((categoryId, index) => (
                  <span key={index} className={styles.category}>
                    {getCategoryName(categoryId)}
                  </span>
                ))}
                {recipe.categories.length > 4 && (
                  <span className={styles.moreCategory}>+{recipe.categories.length - 4}</span>
                )}
              </div>

              <div className={styles.buttonGroup}>
                <button className={styles.viewButton} onClick={handleViewRecipe}>
                  <Eye size={18} />
                  <span>View recipe</span>
                </button>
                <button 
                  className={`${styles.bookmarkButton} ${isSaved ? styles.saved : ''}`} 
                  onClick={handleSaveRecipe}
                  disabled={isLoading}
                >
                  <Bookmark size={18} />
                </button>
              </div>

              <div className={styles.stats}>
                <div className={styles.rating}>
                  <Star size={18} className={styles.starIcon}/>
                  <span className={styles.value}>{recipe.averageRating || 0}</span>
                </div>
                <div className={styles.saves}>
                  <Bookmark size={18} className={styles.bookmarkIcon} />
                  <span className={styles.value}>{recipe.saveCount || 0} saves</span>
                </div>
                <div className={styles.cookTime}>
                  <Clock size={18} className={styles.clockIcon} />
                  <div>
                    <p className={styles.value}>{formatTime(recipe.totalTime)}</p>
                  </div>
                </div>
                {/* <div className={styles.servings}>
                  <Users size={18} className={styles.usersIcon} />
                  <div>
                    <p className={styles.value}>{recipe.servings} người</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
