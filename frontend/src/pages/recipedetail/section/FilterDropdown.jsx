"use client"
import { X, Star } from "lucide-react"
import styles from "./ReviewsSection.module.css"

const FilterDropdown = ({
  isOpen,
  onClose,
  ratingFilters,
  showWithImages,
  toggleRatingFilter,
  toggleShowWithImages,
  resetFilters,
}) => {
  if (!isOpen) return null

  return (
    <div className={styles.dropdownContent}>
      <div className={styles.dropdownHeader}>
        <span>Filter reviews</span>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className={styles.dropdownItem}>
        <span>Rating</span>
      </div>

      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className={styles.dropdownItem} onClick={() => toggleRatingFilter(rating)}>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id={`rating-${rating}`}
              className={styles.checkbox}
              checked={ratingFilters.includes(rating)}
              onChange={() => {}}
            />
            <label htmlFor={`rating-${rating}`} className={styles.starContainer}>
              {Array(rating)
                .fill()
                .map((_, i) => (
                  <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
                ))}
              {Array(5 - rating)
                .fill()
                .map((_, i) => (
                  <Star key={i} size={16} fill="none" color="#D3D3D3" />
                ))}
            </label>
          </div>
        </div>
      ))}

      <div className={styles.dropdownItem} onClick={toggleShowWithImages}>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="with-images"
            className={styles.checkbox}
            checked={showWithImages}
            onChange={() => {}}
          />
          <label htmlFor="with-images">With images</label>
        </div>
      </div>

      <div className={styles.dropdownItem}>
        <button className={styles.resetButton} onClick={resetFilters}>
          Reset filters
        </button>
      </div>
    </div>
  )
}

export default FilterDropdown
