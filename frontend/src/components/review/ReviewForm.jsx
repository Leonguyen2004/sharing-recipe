import { Camera, ThumbsUp } from 'lucide-react';
import React, { useEffect, useState, useRef, use } from 'react';
import StarRating from '../starrating/StarRating';
import IconButton from '../button/IconButton';
import './ReviewForm.css';
import { addReview, updateReview } from '../../services/reviewService';
import { uploadImage, deleteImage } from '../../services/cloudinaryService';


const ReviewForm = ({recipe, isEditReview, setIsEditReview, reviewData, isAddReview, setIsAddReview}) => {
  const [canSubmit, setCanSubmit] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [rating, setRating] = useState(0);
  const commentRef = useRef(null);

  // set data cho form neu dang trong che do edit
  useEffect(() => {
    if (isEditReview) {
      setRating(reviewData.rating || 0);
      commentRef.current.value = reviewData.comment || "";
      setPhotoPreview(reviewData.imageUrl || null);
    }
  }, [isEditReview])

  useEffect(() => {
    if (rating !== 0) setCanSubmit(true)
  }, [rating])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRatingChange = (rating) => {
    setRating(rating);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const oldImagePublicId = reviewData?.imagePublicId || "";
      let newImageUrl = reviewData?.imageUrl || "";
      let newImagePublicId = reviewData?.imagePublicId || "";
      // Upload new image if there is one
      if (photo && !photoPreview.startsWith('http')) {
        const { url, publicId } = await uploadImage(photo);
        newImageUrl = url;
        newImagePublicId = publicId;   

        if (oldImagePublicId !== "") {
          try {
            await deleteImage(oldImagePublicId);
            console.log('Old image deleted:', oldImagePublicId);
          } catch (deleteError) {
            console.error('Error deleting old image:', deleteError.message);
          }
        }       
      }

      const newReviewData = {
        rating: rating,
        comment: commentRef.current.value,
        imageUrl: newImageUrl,
        imagePublicId: newImagePublicId
      }

      if (isEditReview) {
        await updateReview(reviewData.id, newReviewData);
        setIsEditReview(false);
      } else {
        await addReview(recipe.id, newReviewData);
        setIsAddReview(!isAddReview);
      }
    } catch(error) {
      console.error('Error submit review:', error);
      alert('Error submit review. Please try again.');
    } finally {
      setIsLoading(false);
    }
    
  }

  const handleCancle = () => {
    setIsEditReview(false);
    console.log(commentRef.current.value)
    commentRef.current.value = "";
    setRating(0);
    setCanSubmit(false);
    setPhoto(null);
    setPhotoPreview(null);
  }

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="rvcom-review-form">
      <h3 className="rvcom-form-title">{recipe.title}</h3>
      
      <div className="rvcom-rating-field">
        <p className="rvcom-field-label">My Rating <span className="rvcom-required">(required)</span></p>
        <div className="rvcom-star-select">
          <StarRating 
            rating={rating} 
            count={0} 
            showCount={false} 
            onRatingChange={handleRatingChange}
          />
        </div>
      </div>
      
      <div className="rvcom-review-field">
        <p className="rvcom-field-label">My Review</p>
        <textarea 
          className="rvcom-review-textarea" 
          ref={commentRef}
          placeholder="What did you think about this recipe? Did you make any changes or notes?"
        ></textarea>
      </div>
      
      <div className="rvcom-photo-field">
        <div 
          className="rvcom-photo-upload-container"
          onClick={handlePhotoClick}
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Recipe preview" className="photo-preview" />
          ) : (
            <>
              <Camera size={20} />
              <span>Add Photo</span>
              <span className="rvcom-optional-text">(optional)</span>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png"
            style={{ display: 'none' }}
          />
        </div>
        
        
        <div className="rvcom-photo-requirements">
          <p>Images must be:</p>
          <ul>
            <li>PNG, GIF, JPEGs only</li>
            <li>Minimum dimensions 960x960</li>
            <li>Max file size: 30MB</li>
          </ul>
        </div>
      </div>
      
      <div className="rvcom-form-actions">
        <IconButton variant="cancel" onClick={handleCancle}>CANCEL</IconButton>
        {!!canSubmit ? (
          <IconButton variant="primary" onClick={handleSubmit}>SUBMIT</IconButton>
        ) : (
          <IconButton variant="disable" disabled={true}>SUBMIT</IconButton>
        )}
      </div>
    </div>
  );
};

export default ReviewForm