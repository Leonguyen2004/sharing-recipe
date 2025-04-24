"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, Filter } from "lucide-react"
import ReviewForm from "../../../components/review/ReviewForm"
import ReviewStats from "../../../components/review/ReviewStats"
import Review from "../../../components/review/Review"
import { getReviewByUserAndRecipe } from "../../../services/reviewService"
import useReviewFilters from "../../../hooks/useReviewFilters"
import SortDropdown from "./SortDropdown"
import FilterDropdown from "./FilterDropdown"
import styles from "./ReviewsSection.module.css"

const ReviewsSection = ({ recipe, stats, distribution, reviews }) => {
  const [hasReview, setHasReview] = useState(false)
  const [isEditReview, setIsEditReview] = useState(false)
  const [myReview, setMyReview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isAddReview, setIsAddReview] = useState(false)

  // Sort and filter state
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Use our custom hook
  const {
    filteredAndSortedReviews,
    sortOption,
    ratingFilters,
    showWithImages,
    toggleRatingFilter,
    toggleShowWithImages,
    setSorting,
    resetFilters,
  } = useReviewFilters(reviews || [])

  useEffect(() => {
    const fetchMyReview = async () => {
      try {
        setLoading(true)
        const response = await getReviewByUserAndRecipe(recipe.id)
        if (response.review) setHasReview(true)
        setMyReview(response.review)
        console.log("lay lai reveiw cua toi")
      } catch (error) {
        console.error("Error fetching my review data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyReview()
  }, [isEditReview, isAddReview])

  const handleEditReview = () => {
    setIsEditReview(true)
  }

  // Toggle sort dropdown
  const toggleSortDropdown = () => {
    setIsSortOpen(!isSortOpen)
    if (isFilterOpen) setIsFilterOpen(false)
  }

  // Toggle filter dropdown
  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen)
    if (isSortOpen) setIsSortOpen(false)
  }

  if (loading) return <div>Loading....</div>

  return (
    <div className={styles.reviewsSection} id="reviews">
      <h2 className={styles.sectionTitle}>Reviews</h2>

      {!isEditReview && hasReview ? (
        <div className={styles.myReviewContainer}>
          <button className={styles.myReviewButton} onClick={handleEditReview}>
            Edit review?
          </button>
          <Review myReview={myReview} />
        </div>
      ) : (
        <ReviewForm
          recipe={recipe}
          isEditReview={isEditReview}
          setIsEditReview={setIsEditReview}
          reviewData={myReview}
          isAddReview={isAddReview}
          setIsAddReview={setIsAddReview}
        />
      )}

      <div className={styles.reviewsDivider}></div>

      <ReviewStats stats={stats} distribution={distribution} />

      <div className={styles.reviewsDivider}></div>

      <div className={styles.reviewsFilters}>
        <h3 className={styles.filtersTitle}>
          {filteredAndSortedReviews.length} Reviews
          {(ratingFilters.length > 0 || showWithImages) && " (filtered)"}
        </h3>
        <div className={styles.filtersActions}>
          <div className={styles.dropdown}>
            <button
              className={`${styles.filterButton} ${sortOption !== "newest" ? styles.activeFilter : ""}`}
              onClick={toggleSortDropdown}
            >
              <ArrowUpDown size={16} />
              Sort
            </button>
            <SortDropdown
              isOpen={isSortOpen}
              onClose={() => setIsSortOpen(false)}
              sortOption={sortOption}
              setSorting={setSorting}
            />
          </div>

          <div className={styles.dropdown}>
            <button
              className={`${styles.filterButton} ${ratingFilters.length > 0 || showWithImages ? styles.activeFilter : ""}`}
              onClick={toggleFilterDropdown}
            >
              <Filter size={16} />
              Filter
            </button>
            <FilterDropdown
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              ratingFilters={ratingFilters}
              showWithImages={showWithImages}
              toggleRatingFilter={toggleRatingFilter}
              toggleShowWithImages={toggleShowWithImages}
              resetFilters={resetFilters}
            />
          </div>
        </div>
      </div>

      <div id="review-list" className="rvcom-reviews-list">
        {filteredAndSortedReviews.map((review) => (
          <Review key={review.id} myReview={review} />
        ))}

        {filteredAndSortedReviews.length === 0 && <p>No reviews match your current filters.</p>}
      </div>
    </div>
  )
}

export default ReviewsSection