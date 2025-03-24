import React from 'react';
import StarRating from '../../../components/starrating/StarRating';
import Breadcrumb from '../../../components/breadcumb/Breadcrumb';
import ActionButton from '../../../components/button/ActionButton';
import IconButton from '../../../components/button/IconButton';
import { Heart, Printer, Share2, Star } from 'lucide-react';
import './HeaderSection.css';

const HeaderSection = ({ recipe }) => {
  const breadcrumbItems = [
    { label: 'RECIPES', url: '#' },
    { label: 'BREAKFAST AND BRUNCH', url: '#' },
    { label: 'EGGS', url: '#' },
  ];

  return (
    <div className="rdpage-recipe-header">
      <Breadcrumb items={breadcrumbItems} />
      
      <h1 className="rdpage-recipe-title">{recipe.title}</h1>
      
      <div className="rdpage-recipe-meta">
        <div className="rdpage-rating-container">
          <StarRating rating={4.4} count={14} />
          <a href="#reviews" className="rdpage-reviews-link">11 REVIEWS</a>
          <a href="#photos" className="rdpage-photos-link">7 PHOTOS</a>
        </div>
      </div>
      
      <p className="rdpage-recipe-description">
        {recipe.description || "This breakfast fried rice is a twist on bacon and eggs! My dad used to make this for me on Saturday mornings when I was a kid; it's an easy and tasty brunch option. You can substitute one bunch of broccoli for frozen peas if desired."}
      </p>
      
      <div className="rdpage-recipe-author">
        <span>Submitted by <strong>Anna J</strong></span>
        <span className="rdpage-recipe-date">Updated on February 26, 2023</span>
      </div>
      
      <div className="rdpage-recipe-tested">
        <span className="rdpage-tested-badge">✓</span> Tested by <strong>Allrecipes Test Kitchen</strong>
      </div>
      
      <div className="rdpage-recipe-actions">
        <IconButton 
          icon={<Heart size={18} />} 
          variant="primary"
        >
          SAVE
        </IconButton>
        
        <IconButton 
          icon={<Star size={18} />} 
          variant="primary"
        >
          RATE
        </IconButton>
        
        <IconButton 
          icon={<Printer size={18} />} 
          variant="primary"
        >
          PRINT
        </IconButton>
        
        <IconButton 
          icon={<Share2 size={18} />} 
          variant="primary"
        >
          SHARE
        </IconButton>
      </div>
    </div>
  );
};

export default HeaderSection;