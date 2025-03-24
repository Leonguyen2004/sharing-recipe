import React, { useRef } from 'react';

const RecipeIntro = ({
  recipeTitle,
  setRecipeTitle,
  description,
  setDescription,
  photo,
  setPhoto,
  photoPreview,
  setPhotoPreview
}) => {
  const fileInputRef = useRef(null);

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

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="form-section">
      <h1 className="form-section-title">
        <span className="plus-icon">+</span>Add a Recipe
      </h1>
      <p className="form-section-description">
        Uploading personal recipes is easy! Add yours to your favorites, share with friends,
        family, or the Allrecipes community.
      </p>
      
      <div className="form-divider"></div>
      
      <div className="recipe-intro">
        <div className="recipe-text-inputs">
          <div className="input-group">
            <label htmlFor="recipe-title">Recipe Title</label>
            <input
              id="recipe-title"
              type="text"
              className="text-input"
              placeholder="Give your recipe a title"
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="recipe-description">Description</label>
            <textarea
              id="recipe-description"
              className="textarea-input"
              placeholder="Share the story behind your recipe and what makes it special."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        
        <div className="photo-section">
          <label>Photo (optional)</label>
          <div 
            className="photo-upload-container"
            onClick={handlePhotoClick}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Recipe preview" className="photo-preview" />
            ) : (
              <>
                <div>your photo here</div>
                <p className="photo-upload-text">
                  Use JPEG or PNG. Must be at least 960 x 960.<br />
                  Max file size: 30MB
                </p>
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
        </div>
      </div>
    </div>
  );
};

export default RecipeIntro;