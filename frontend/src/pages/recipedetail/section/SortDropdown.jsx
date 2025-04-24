"use client"
import { X } from "lucide-react"
import styles from "./ReviewsSection.module.css"

const SortDropdown = ({ isOpen, onClose, sortOption, setSorting }) => {
  if (!isOpen) return null

  return (
    <div className={styles.dropdownContent}>
      <div className={styles.dropdownHeader}>
        <span>Sort by</span>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div
        className={styles.dropdownItem}
        onClick={() => {
          setSorting("newest")
          onClose()
        }}
      >
        <div className={styles.radioContainer}>
          <input
            type="radio"
            id="newest"
            name="sort"
            className={styles.radio}
            checked={sortOption === "newest"}
            onChange={() => {}}
          />
          <label htmlFor="newest">Newest first</label>
        </div>
      </div>

      <div
        className={styles.dropdownItem}
        onClick={() => {
          setSorting("oldest")
          onClose()
        }}
      >
        <div className={styles.radioContainer}>
          <input
            type="radio"
            id="oldest"
            name="sort"
            className={styles.radio}
            checked={sortOption === "oldest"}
            onChange={() => {}}
          />
          <label htmlFor="oldest">Oldest first</label>
        </div>
      </div>
    </div>
  )
}

export default SortDropdown