import React, { useState } from 'react';
import ActionButton from '../../../components/button/ActionButton';
import { Camera } from 'lucide-react';
import './MediaSection.css';

const RecipeMedia = ({ mainImage, thumbnails = [] }) => {
  const defaultImage = 'https://www.allrecipes.com/thmb/5SdUVhHTMs-rUMiOyQUkI-UvuaE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Breakfast-Fried-Rice-ddmfs-4x3-1351-cf5831e198304e559f1dbc6d202ee422.jpg';
  const [currentImage, setCurrentImage] = useState(mainImage || defaultImage);
  
  const allThumbnails = [
    ...(thumbnails.length > 0 ? thumbnails : [
      { id: 1, src: 'https://www.allrecipes.com/thmb/5SdUVhHTMs-rUMiOyQUkI-UvuaE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Breakfast-Fried-Rice-ddmfs-4x3-1351-cf5831e198304e559f1dbc6d202ee422.jpg' },
      { id: 2, src: 'https://www.allrecipes.com/thmb/9jv2hUXGptrJKPd4DmM5AZ7KHqw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/breakfast-fried-rice-ddmfs-Step1-368-812616ffb8cb4cae9d8cc0684ff1a6bc.jpg' },
      { id: 3, src: 'https://www.allrecipes.com/thmb/1y-oqzbY0gUIhS5t-RdB4jLJZ4s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/breakfast-fried-rice-ddmfs-Step3-372-592343f6fcdd45d3b1c9520c5a48e274.jpg' },
      { id: 4, src: 'https://www.allrecipes.com/thmb/A5_14OwJiFOI6mv18FHGywn9l1I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/breakfast-fried-rice-ddmfs-4x3-1351-cf5831e198304e559f1dbc6d202ee422.jpg' }
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