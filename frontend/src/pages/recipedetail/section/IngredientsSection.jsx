import React from 'react';
import './IngredientsSection.css';
import { Dot } from 'lucide-react';

const Ingredients = ({ ingredients, servings }) => {
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
                <div className='rdpage-ingredient-item-wrapper'>
                  <Dot size={30} className='rdpage-icon'/> <span>{item.text}</span>
                </div>
              )}
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default Ingredients;