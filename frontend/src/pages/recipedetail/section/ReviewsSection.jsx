"use client"

import { ArrowUpDown, Filter, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import Review from "../../../components/review/Review"
import ReviewForm from "../../../components/review/ReviewForm"
import ReviewStats from "../../../components/review/ReviewStats"
import { getReviewByUserAndRecipe, getReviewsByRecipe } from "../../../services/reviewService"
import FilterDropdown from "./FilterDropdown"
import styles from "./ReviewsSection.module.css"
import SortDropdown from "./SortDropdown"
import { deleteReview } from "../../../services/reviewService"
import Modal from "../../../components/modal/Modal"

const ReviewsSection = ({ recipe, stats, distribution }) => {
  const [hasReview, setHasReview] = useState(false)
  const [isEditReview, setIsEditReview] = useState(false)
  const [myReview, setMyReview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isAddReview, setIsAddReview] = useState(false)
  const [reviews, setReviews] = useState([])
  const [pagination, setPagination] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Sort and filter state
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [ratingFilters, setRatingFilters] = useState([])
  const [showWithImages, setShowWithImages] = useState(false)
  const [sortOrder, setSortOrder] = useState("desc")
  // get reviews data
  useEffect(() => {
    const fetchReviewsByRecipeId = async () => {
      try {
        const params = {
          recipeId: recipe.id,
          starsFilter: ratingFilters,
          hasImageOnly: showWithImages,
          sortOrder: sortOrder,
          limit: 1,
        }
        const response = await getReviewsByRecipe(params);
        setReviews(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Error fetching reviews data:", error)
      }
    }

    fetchReviewsByRecipeId() 
  }, [ratingFilters, showWithImages, sortOrder])

  // Get more reviews
  const fetchMoreReviews = async () => {
    try {
      const params = {
        recipeId: recipe.id,
        starsFilter: ratingFilters,
        hasImageOnly: showWithImages,
        sortOrder: sortOrder,
        limit: 1,
        startAfter: pagination.lastDocId
      }
      const response = await getReviewsByRecipe(params);
      setReviews(prev => [...prev, ...response.data]);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching reviews data:", error)
    }
  }

  // get review personal
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

  const handleDeleteReview = async () => {
    try {
      await deleteReview(reviewToDelete);
      setReviews(reviews.filter(review => review.id !== reviewToDelete));
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const openDeleteModal = (reviewId) => {
    setReviewToDelete(reviewId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  if (loading) return <div>Loading....</div>

  return (
    <div className={styles.reviewsSection} id="reviews">
      <h2 className={styles.sectionTitle}>Reviews</h2>

      {!isEditReview && hasReview ? (
        <div className={styles.myReviewContainer}>
          <div className={styles.myReviewActions}>
            <button className={styles.myReviewButton} onClick={handleEditReview}>
              Edit review
            </button>
            <button 
              className={`${styles.myReviewButton} ${styles.deleteButton}`} 
              onClick={() => openDeleteModal(myReview.id)}
            >
              <Trash2 size={16} />
              Delete review
            </button>
          </div>
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
          {reviews.length} Reviews
          {(ratingFilters.length > 0 || showWithImages) && " (filtered)"}
        </h3>
        <div className={styles.filtersActions}>
          <div className={styles.dropdown}>
            <button
              className={`${styles.filterButton} ${sortOrder !== "desc" ? styles.activeFilter : ""}`}
              onClick={toggleSortDropdown}
            >
              <ArrowUpDown size={16} />
              Sort
            </button>
            <SortDropdown
              isOpen={isSortOpen}
              onClose={() => setIsSortOpen(false)}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
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
              setRatingFilters={setRatingFilters}
              showWithImages={showWithImages}
              setShowWithImages={setShowWithImages}
            />
          </div>
        </div>
      </div>

      <div id="review-list" className="rvcom-reviews-list">
        {reviews.map((review) => (
          <Review key={review.id} myReview={review} />
        ))}

        {reviews.length === 0 && <p>No reviews match your current filters.</p>}
      </div>

      {pagination.hasNext && (
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreButton} onClick={fetchMoreReviews}>
            Load More
          </button>
        </div>
      )}

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={closeDeleteModal}
        title="Delete Review"
      >
        <div className={styles.deleteModalContent}>
          <p>Are you sure you want to delete this review?</p>
          <div className={styles.modalActions}>
            <button className={styles.cancelButton} onClick={closeDeleteModal}>
              Cancel
            </button>
            <button className={styles.deleteButton} onClick={handleDeleteReview}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ReviewsSection