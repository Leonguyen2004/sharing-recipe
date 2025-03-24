import React, { useState } from 'react';
import { CircleX, Plus, ArrowUpDown, Check } from 'lucide-react';
import DraggableList from '../DraggableList';

const IngredientsSection = ({ ingredients, setIngredients }) => {
  const [bulkIngredients, setBulkIngredients] = useState('');
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const addIngredient = () => {
    const newIngredient = {
      id: Date.now().toString(),
      text: '',
      isHeader: false
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const addHeader = () => {
    const newHeader = {
      id: Date.now().toString(),
      text: '',
      isHeader: true
    };
    setIngredients([...ingredients, newHeader]);
  };

  const updateIngredient = (id, text) => {
    setIngredients(
      ingredients.map(ingredient => 
        ingredient.id === id ? { ...ingredient, text } : ingredient
      )
    );
  };

  const removeIngredient = (id) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  const toggleBulkAdd = () => {
    setShowBulkAdd(!showBulkAdd);
  };

  const addBulkIngredients = () => {
    if (bulkIngredients.trim()) {
      const newIngredients = bulkIngredients
        .split('\n')
        .filter(text => text.trim())
        .map(text => ({
          id: Date.now().toString() + Math.random().toString().slice(2, 8),
          text: text.trim(),
          isHeader: false
        }));
      
      setIngredients([...ingredients, ...newIngredients]);
      setBulkIngredients('');
      setShowBulkAdd(false);
    }
  };

  const toggleReordering = () => {
    setIsReordering(!isReordering);
  };

  const handleReorder = (newIngredients) => {
    setIngredients(newIngredients);
  };

  const renderIngredientItem = (ingredient) => (
    <>
      <input
        type="text"
        className="text-input-reordering"
        value={ingredient.text}
        onChange={(e) => updateIngredient(ingredient.id, e.target.value)}
        style={ingredient.isHeader ? { fontWeight: 'bold' } : {}}
        disabled={isReordering} 
      />
    </>
  );

  return (
    <div className="form-section">
      <h2 className="form-section-title">Ingredients</h2>
      <p className="form-section-description">
        Enter one ingredient per line. Include the quantity (i.e. cups, tablespoons) and any
        special preparation (i.e. sifted, softened, chopped). Use optional headers to organize
        the different parts of the recipe (i.e. Cake, Frosting, Dressing).
      </p>
      
      <div className="entry-options">
        {!isReordering && (
          <div className="bulk-add-wrapper">
            <span>Enter ingredients below or </span>
            <button type="button" onClick={toggleBulkAdd} className="link-button">
              Add several at once
            </button>
          </div>
        )}
        
        <button 
          type="button" 
          className={`reorder-button ${isReordering ? 'active' : ''}`} 
          onClick={toggleReordering}
        >
          {isReordering ? (
            <>
              <Check size={16} />
              DONE
            </>
          ) : (
            <>
              <ArrowUpDown size={16} />
              REORDER
            </>
          )}
        </button>
      </div>
      
      {showBulkAdd && !isReordering ? (
        <div className="bulk-add-container">
          <textarea
            className="textarea-input"
            placeholder="Enter each ingredient on a new line"
            value={bulkIngredients}
            onChange={(e) => setBulkIngredients(e.target.value)}
            rows={5}
          />
          <button type="button" className="add-button" onClick={addBulkIngredients}>
            <Plus size={16} strokeWidth={4} className="add-button-icon"/>
            ADD INGREDIENTS
          </button>
        </div>
      ) : (
        <>
          {isReordering ? (
            <DraggableList
              items={ingredients}
              onReorder={handleReorder}
              renderItem={renderIngredientItem}
              itemClassName="ingredient-item"
            />
          ) : (
            ingredients.map(ingredient => (
              <div className="input-container" key={ingredient.id}>
                <div className="input-row">
                  <input
                    type="text"
                    className="text-input"
                    placeholder={ingredient.isHeader ? "Add a header, e.g. Cake Batter" : "Add an ingredient, e.g. 2 cups flour, sifted"}
                    value={ingredient.text}
                    onChange={(e) => updateIngredient(ingredient.id, e.target.value)}
                    style={ingredient.isHeader ? { fontWeight: 'bold' } : {}}
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeIngredient(ingredient.id)}
                    aria-label="Remove ingredient"
                  >
                    <CircleX size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
          
          {!isReordering && (
            <div className="add-buttons">
            <button type="button" className="add-button" onClick={addIngredient}>
              <Plus size={16} strokeWidth={4} className="add-button-icon"/>
              ADD INGREDIENT
            </button>
            <button type="button" className="add-button" onClick={addHeader}>
              <Plus size={16} strokeWidth={4} className="add-button-icon"/>
              ADD HEADER
            </button>
          </div>
          )}
          
        </>
      )}
    </div>
  );
};

export default IngredientsSection;