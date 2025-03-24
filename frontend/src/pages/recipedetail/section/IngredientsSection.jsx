import React, { useState } from 'react';
import './IngredientsSection.css';

const Ingredients = ({ ingredients, servings }) => {
  const [multiplier, setMultiplier] = useState(1);
  
  return (
    <div className="rdpage-ingredients-section">
      <h2 className="rdpage-section-title">Ingredients</h2>
      
      <ul className="rdpage-ingredients-list">
        {ingredients.map((item, index) => (
          item.text && (
            <li key={item.id || index} className={item.isHeader ? 'rdpage-ingredient-header' : 'rdpage-ingredient-item'}>
              {item.isHeader ? (
                <h3>{item.text}</h3>
              ) : (
                <span>{item.text}</span>
              )}
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default Ingredients;