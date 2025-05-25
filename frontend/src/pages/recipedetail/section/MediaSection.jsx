import React, { useState } from 'react';
import ActionButton from '../../../components/button/ActionButton';
import { Camera } from 'lucide-react';
import './MediaSection.css';
import defaultImage from "../../../assets/img/recipe-image.jpeg";

const RecipeMedia = ({ recipe }) => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="rdpage-recipe-media">
      <div className="rdpage-main-image-container">
        <img 
          src={recipe.imageUrl || defaultImage} 
          alt="Recipe prepared dish" 
          className="rdpage-main-image"
        />
      </div>
      
      <div className="rdpage-thumbnails-container">
        <div className="rdpage-add-photo-button">
          <ActionButton
            icon={<Camera size={24} />}
            variant="secondary"
            className="rdpage-photo-button"
          >
            <div className="rdpage-button-text" onClick={(e) => scrollToSection("reviews")}>
              <span>Add Photo</span>
            </div>
          </ActionButton>
        </div>
        
        {/* {allThumbnails.map((thumb) => (
          <button 
            key={thumb.id} 
            className={`rdpage-thumbnail ${currentImage === thumb.src ? 'active' : ''}`}
            onClick={() => setCurrentImage(thumb.src)}
          >
            <img src={thumb.src} alt="Recipe thumbnail" />
          </button>
        ))} */}
        
        {/* <div className="rdpage-photo-count">
          <div className="rdpage-photo-icon">
            <Camera size={16} />
          </div>
          <span>7</span>
        </div> */}
      </div>
    </div>
  );
};

export default RecipeMedia;