"use client"

import { useState, useRef, useEffect } from "react"
import { RPRecipeModal } from "./RPRecipeModal"
import styles from "./RPRecipeCard.module.css"
import defaultImage from "../../assets/img/recipe-image.jpeg";

export const RPRecipeCard = ({ recipe, className }) => {
  const [showModal, setShowModal] = useState(false)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const hoverTimerRef = useRef(null)
  const cardRef = useRef(null)

  const calculateModalPosition = () => {
    if (!cardRef.current) return { top: 0, left: 0 }

    const cardRect = cardRef.current.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    // Center the modal over the card
    const top = cardRect.top + scrollTop + cardRect.height / 2
    const left = cardRect.left + scrollLeft + cardRect.width / 2

    return { top, left }
  }

  const handleImageHover = () => {
    setModalPosition(calculateModalPosition())
    setShowModal(true)
  }

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false)
  }

  // Update position if window is resized
  useEffect(() => {
    const handleResize = () => {
      if (showModal) {
        setModalPosition(calculateModalPosition())
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [showModal])

  return (
    <div className={styles.container} ref={cardRef}>
      <div className={`${styles.recipeCard} ${styles[className] || ""}`}>
        <div className={styles.imageContainer} onClick={handleImageHover}>
          <img src={recipe.imageUrl || defaultImage} alt={recipe.title} className={styles.image} />
        </div>
        <div className={styles.content} onClick={handleImageHover}>
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
            position={modalPosition}

          />
        )}
      </div>
    </div>
  )
}
