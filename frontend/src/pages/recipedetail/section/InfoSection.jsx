import React from 'react';
import './InfoSection.css';

const RecipeInfo = ({ recipe }) => {
  const { prepTime, prepTimeUnit, cookTime, cookTimeUnit, totalTime, servings, additionalTimers } = recipe;
  
  return (
    <div className="rdpage-recipe-info">
      <div className="rdpage-recipe-info-grid">
        <div className="rdpage-info-column">
          <h3 className="rdpage-info-title">Prep Time:</h3>
          <p className="rdpage-info-value">{prepTime} {prepTimeUnit}</p>
        </div>
        
        <div className="rdpage-info-column">
          <h3 className="rdpage-info-title">Cook Time:</h3>
          <p className="rdpage-info-value">{cookTime} {cookTimeUnit}</p>
        </div>
        
        <div className="rdpage-info-column">
          <h3 className="rdpage-info-title">Total Time:</h3>
          <p className="rdpage-info-value">{totalTime} mins</p>
        </div>

        {additionalTimers && additionalTimers.length > 0 && (
          additionalTimers.map((timer) => (
            <div key={timer.id} className="rdpage-timer-item">
              <h3 className="rdpage-info-title">{timer.type} Time:</h3>
              <p className="rdpage-info-value">{timer.time} {timer.unit}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="rdpage-info-servings">
        <h3 className="rdpage-info-title">Servings:</h3>
        <p className="rdpage-info-value">{servings}</p>
      </div>
    </div>
  );
};

export default RecipeInfo;