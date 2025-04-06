import React, { useState } from 'react';
import ActionButton from '../../../components/button/ActionButton';
import { Camera } from 'lucide-react';
import './MediaSection.css';

const RecipeMedia = ({ mainImage, thumbnails = [] }) => {
  const defaultImage = "https://placehold.co/400x400";
  const [currentImage, setCurrentImage] = useState(mainImage || defaultImage);
  
  const allThumbnails = [
    ...(thumbnails.length > 0 ? thumbnails : [
      { id: 1, src: "https://placehold.co/400x400" },
      { id: 2, src: "https://placehold.co/400x400" },
      { id: 3, src: "https://placehold.co/400x400" },
      { id: 4, src: "https://placehold.co/400x400" }
    ])
  ];
  
  return (
    <div className="rdpage-recipe-media">
      <div className="rdpage-main-image-container">
        <img 
          src={currentImage} 
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
            <div className="rdpage-button-text">
              <span>Add Photo</span>
            </div>
          </ActionButton>
        </div>
        
        {allThumbnails.map((thumb) => (
          <button 
            key={thumb.id} 
            className={`rdpage-thumbnail ${currentImage === thumb.src ? 'active' : ''}`}
            onClick={() => setCurrentImage(thumb.src)}
          >
            <img src={thumb.src} alt="Recipe thumbnail" />
          </button>
        ))}
        
        <div className="rdpage-photo-count">
          <div className="rdpage-photo-icon">
            <Camera size={16} />
          </div>
          <span>7</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeMedia;