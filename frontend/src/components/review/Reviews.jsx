import { Camera, ThumbsUp } from 'lucide-react';
import React, { useState } from 'react';
import StarRating from '../starrating/StarRating';
import IconButton from '../button/IconButton';
import './Reviews.css';

const ReviewForm = () => {
  const [userRating, setUserRating] = useState(0);
  
  const handleRatingChange = (rating) => {
    setUserRating(rating);
  };
  
  return (
    <div className="rvcom-review-form">
      <h3 className="rvcom-form-title">Breakfast Fried Rice</h3>
      
      <div className="rvcom-rating-field">
        <p className="rvcom-field-label">My Rating <span className="rvcom-required">(required)</span></p>
        <div className="rvcom-star-select">
          <StarRating 
            rating={userRating} 
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
          placeholder="What did you think about this recipe? Did you make any changes or notes?"
        ></textarea>
      </div>
      
      <div className="rvcom-photo-field">
        <button className="rvcom-photo-upload-button">
          <Camera size={20} />
          <span>Add Photo</span>
          <span className="rvcom-optional-text">(optional)</span>
        </button>
        
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
        <IconButton variant="cancel">CANCEL</IconButton>
        <IconButton variant="submit">SUBMIT</IconButton>
      </div>
    </div>
  );
};

const ReviewsList = ({ reviews }) => {
  // Sample reviews data for demonstration
  const sampleReviews = [
    {
      id: 1,
      user: {
        name: 'CrispVeal2467',
        avatar: 'https://placehold.co/400x400'
      },
      rating: 5,
      date: '08/05/2024',
      badges: ['A keeper!', 'Easy to follow'],
      text: 'Awesome! Great flavor and very filling. Loved the breakfast twist to a favorite staple in our house.',
      helpful: 0
    },
    {
      id: 2,
      user: {
        name: 'Lynnie Slade',
        avatar: 'https://www.allrecipes.com/img/userphotos/60x60/5831057.jpg'
      },
      rating: 3,
      date: '02/02/2021',
      badges: [],
      text: 'The rice was difficult to make.',
      helpful: 0
    },
    {
      id: 3,
      user: {
        name: 'ratcpa',
        avatar: 'https://www.allrecipes.com/img/userphotos/60x60/7888990.jpg'
      },
      rating: 5,
      date: '01/01/2021',
      badges: [],
      text: 'Super easy and very tasty!',
      helpful: 1
    }
  ];
  
  const [reviewList, setReviewList] = useState(reviews || sampleReviews);

  const handleHelpfulClick = (reviewId) => {
    setReviewList((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
  };
  
  return (
    <div className="rvcom-reviews-list">
      {reviewList.map(review => (
        <div key={review.id} className="rvcom-review-item">
          <div className="rvcom-review-user">
            <img 
              src={review.user.avatar} 
              alt={review.user.name} 
              className="rvcom-user-avatar" 
            />
            <h3 className="rvcom-user-name">{review.user.name}</h3>
          </div>
          
          <div className="rvcom-review-content">
            <div className="rvcom-review-header">
              <StarRating rating={review.rating} count={0} showCount={false} size="small" />
              <span className="rvcom-review-date">{review.date}</span>
            </div>
            
            {review.badges.length > 0 && (
              <div className="rvcom-review-badges">
                {review.badges.map((badge, i) => (
                  <span key={i} className="rvcom-badge">{badge}</span>
                ))}
              </div>
            )}
            
            <p className="rvcom-review-text">{review.text}</p>
            
            <IconButton icon={<ThumbsUp size={16}/>} variant="helpful" onClick={() => handleHelpfulClick(review.id)} disabled={review.helpful >= 10}>
              <span>Helpful ({review.helpful})</span>
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
};

const ReviewsStats = ({ rating, counts }) => {
  // Sample data for demonstration
  const sampleRating = {
    average: 4.4,
    total: 14,
    distribution: [
      { stars: 5, count: 7 },
      { stars: 4, count: 5 },
      { stars: 3, count: 2 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 }
    ]
  };
  
  const ratingData = rating || sampleRating;
  
  return (
    <div className="rvcom-reviews-stats">
      <div className="rvcom-stats-summary">
        <StarRating rating={ratingData.average} count={0} showCount={false} />
        <p className="rvcom-stats-text">
          {ratingData.average} out of 5
          <br />
          {ratingData.total} Ratings
        </p>
      </div>
      
      <div className="rvcom-stats-breakdown">
        {ratingData.distribution.map(item => (
          <div key={item.stars} className="rvcom-stats-row">
            <span className="rvcom-stars-label">{item.stars} star</span>
            <div className="rvcom-stats-bar-container">
              <div 
                className="rvcom-stats-bar" 
                style={{ width: `${(item.count / ratingData.total) * 100}%` }}
              ></div>
            </div>
            <span className="rvcom-stats-count">{item.count}</span>
          </div>
        ))}
      </div>
      
      <div className="rvcom-stats-made-it">
        <div className="rvcom-made-it-icon">
          <span role="img" aria-label="Made it icon">👨‍🍳</span>
        </div>
        <span className="rvcom-made-it-count"><strong>40</strong> home cooks made it!</span>
      </div>
    </div>
  );
};

const Reviews = ({ reviewsData }) => {
  return (
    <div className="rvcom-reviews-section" id="reviews">
      <h2 className="rvcom-section-title">Reviews</h2>
      <p className="rvcom-reviews-intro">Check out our <a href="#">Community Guidelines</a> about reviews.</p>
      
      <ReviewForm />
      
      <div className="rvcom-reviews-divider"></div>
      
      <ReviewsStats />
      
      <div className="rvcom-reviews-divider"></div>
      
      <div className="rvcom-reviews-filters">
        <h3 className="rvcom-filters-title">11 Reviews</h3>
        <div className="rvcom-filters-actions">
          <button className="rvcom-filter-button">Sort</button>
          <button className="rvcom-filter-button">Filter</button>
        </div>
      </div>
      
      <ReviewsList />
    </div>
  );
};

export default Reviews;