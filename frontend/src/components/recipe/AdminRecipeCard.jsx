import { Bookmark, Clock, Eye, Star, Trash, Pen, MoreVertical } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../context/CategoryContext';
import styles from './AdminRecipeCard.module.css';
import Modal from "../../pages/adminpage/modal/Modal";
import { deleteRecipe } from "../../services/recipeService";
import { useState, useEffect, useRef } from "react";

const AdminRecipeCard = ({recipe}) => {
    const {categories} =  useCategories();
    const navigate = useNavigate()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId)
        return category ? category.name : categoryId
    }

    const formatTime = (minutes) => {
        if (minutes > 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0 ? `${hours} giờ ${remainingMinutes} phút` : `${hours} giờ`;
        }
        return `${minutes} phút`;
    };

    const handleViewRecipe = () => {
      navigate(`/recipe/${recipe.id}`);
    }; 

    const handleEditRecipe = () => {
      // Chuyển hướng đến trang chỉnh sửa với ID của recipe
      navigate(`/recipe-form/edit/${recipe.id}`);
    };

    const openDeleteModal = () => {
      setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
      setIsDeleteModalOpen(false);
    };

    const handleDeleteRecipe = async () => {
      try {
        await deleteRecipe(recipe.id);
        closeDeleteModal();
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Error deleting recipe. Please try again.');
      }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    if (!recipe) return <div>loading...</div>

    return (
        <div className={styles.modalContent}>
          <div className={styles.infoSection}>
              <div className={styles.titleRow}>
                <h2 className={styles.title}>{recipe.title}</h2>
                <div className={styles.menuContainer} ref={menuRef}>
                    <button className={styles.menuButton} onClick={toggleMenu}>
                        <MoreVertical size={20} />
                    </button>
                    {isMenuOpen && (
                        <div className={styles.dropdownMenu}>
                            <button className={styles.menuItem} onClick={handleViewRecipe}>
                                <Eye size={16} />
                                <span>Xem công thức</span>
                            </button>
                            <button className={styles.menuItem} onClick={handleEditRecipe}>
                                <Pen size={16} />
                                <span>Chỉnh sửa</span>
                            </button>
                            <button className={styles.menuItem} onClick={openDeleteModal}>
                                <Trash size={16} />
                                <span>Xóa</span>
                            </button>
                        </div>
                    )}
                </div>
              </div>
              
              <div className={styles.wrapper1}>
                <div className={styles.stats}>
                  <div className={styles.rating}>
                    <Star className={styles.starIcon} size={12} />
                    <span className={styles.ratingValue}>{recipe.averageRating || 0}</span>
                  </div>
                  <div className={styles.saves}>
                    <Bookmark size={12} className={styles.bookmarkIcon} />
                    <span>{recipe.saveCount || 0} saves</span>
                  </div>
                  <div className={styles.cookTime}>
                    <Clock size={12} className={styles.clockIcon} />
                    <div>
                      <p className={styles.value}>{formatTime(recipe.totalTime)}</p>
                    </div>
                  </div>
                </div>

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
              </div>
          </div>


          <Modal 
            isOpen={isDeleteModalOpen} 
            onClose={closeDeleteModal}
            title="Delete Recipe"
          >
            <div className="adpage-delete-modal-content">
              <p>Are you sure you want to delete "{recipe?.title}"?</p>
              <p className="adpage-delete-warning">This action cannot be undone.</p>
              <div className="adpage-modal-actions">
                <button className="adpage-btn adpage-cancel-btn" onClick={closeDeleteModal}>
                  Cancel
                </button>
                <button className="adpage-btn adpage-delete-btn-modal" onClick={handleDeleteRecipe}>
                  Delete Recipe
                </button>
              </div>
            </div>
          </Modal>
        </div>
    );
}

export default AdminRecipeCard;