"use client"

import { Bookmark } from 'lucide-react';
import { useRef, useState } from "react";
import defaultImage from "../../assets/img/recipe-image.jpeg";
import styles from "./RPRecipeCard.module.css";
import { RPRecipeModal } from "./RPRecipeModal";
import Portal from '../common/Portal';

export const RPRecipeCard = ({ recipe, className }) => {
  const [showModal, setShowModal] = useState(false)
  const cardRef = useRef(null)

  const handleCardClick = () => {
    setShowModal(true)
  }

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <div className={styles.container} ref={cardRef}>
      <div className={`${styles.recipeCard} ${styles[className] || ""}`}>
        <div className={styles.imageContainer} onClick={handleCardClick}>
          <img src={recipe.imageUrl || defaultImage} alt={recipe.title} className={styles.image} />

          {/* Overlay boxes */}
          <div className={styles.infoBoxContainer}>
            <div className={`${styles.infoBox} ${styles.starsBox}`}>
              ★ {recipe.averageRating} {/* Star icon và số sao */}
            </div>
            <div className={`${styles.infoBox} ${styles.savesBox}`}>
              <Bookmark size={14}/> {recipe.saveCount} {/* Save icon và số lưu */}
            </div>
          </div>
        </div>

        <div className={styles.content} onClick={handleCardClick}>
          <h3 className={styles.title}>{recipe.title}</h3>
        </div>
      </div>

      <div className={styles.recipeModal}>
        {showModal && (
            <RPRecipeModal
              recipe={recipe}
              onClose={closeModal}
              isOpen={showModal}
              modalContainerClass={styles.modalContainer}
            />
        )}
      </div>
    </div>
  )
}
