"use client"

import { useState, useMemo } from "react"

// Custom hook for filtering and sorting reviews
const useReviewFilters = (reviews) => {
  // Sort state - can only be one option
  const [sortOption, setSortOption] = useState("newest")

  // Filter states - can have multiple options selected
  const [ratingFilters, setRatingFilters] = useState([])
  const [showWithImages, setShowWithImages] = useState(false)

  // Toggle a rating filter (1-5 stars)
  const toggleRatingFilter = (rating) => {
    if (ratingFilters.includes(rating)) {
      setRatingFilters(ratingFilters.filter((r) => r !== rating))
    } else {
      setRatingFilters([...ratingFilters, rating])
    }
  }

  // Toggle show only reviews with images
  const toggleShowWithImages = () => {
    setShowWithImages(!showWithImages)
  }

  // Set sort option (newest or oldest)
  const setSorting = (option) => {
    setSortOption(option)
  }

  // Reset all filters
  const resetFilters = () => {
    setRatingFilters([])
    setShowWithImages(false)
  }

  // Apply filters and sorting to reviews
  const filteredAndSortedReviews = useMemo(() => {
    // First apply filters
    let result = [...reviews]

    // Filter by ratings if any rating filters are selected
    if (ratingFilters.length > 0) {
      result = result.filter((review) => ratingFilters.includes(review.rating))
    }

    // Filter by has image if that filter is active
    if (showWithImages) {
      result = result.filter((review) => review.imageUrl)
    }

    // Then sort the filtered results
    return result.sort((a, b) => {
      const timeA = a.createdAt._seconds * 1000 + a.createdAt._nanoseconds / 1000000
      const timeB = b.createdAt._seconds * 1000 + b.createdAt._nanoseconds / 1000000

      return sortOption === "newest" ? timeB - timeA : timeA - timeB
    })
  }, [reviews, ratingFilters, showWithImages, sortOption])

  return {
    filteredAndSortedReviews,
    sortOption,
    ratingFilters,
    showWithImages,
    toggleRatingFilter,
    toggleShowWithImages,
    setSorting,
    resetFilters,
  }
}

export default useReviewFilters