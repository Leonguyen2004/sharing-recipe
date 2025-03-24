import React, { useState } from 'react';
import { CircleX, Plus, ArrowUpDown, Check } from 'lucide-react';
import DraggableList from '../DraggableList';

const DirectionsSection = ({ directions, setDirections }) => {
  const [bulkDirections, setBulkDirections] = useState('');
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const addStep = () => {
    const newStep = {
      id: Date.now().toString(),
      text: '',
      isHeader: false
    };
    console.log(newStep);
    setDirections([...directions, newStep]);
  };

  const addHeader = () => {
    const newHeader = {
      id: Date.now().toString(),
      text: '',
      isHeader: true
    };
    setDirections([...directions, newHeader]);
  };

  const updateDirection = (id, text) => {
    setDirections(
      directions.map(direction => 
        direction.id === id ? { ...direction, text } : direction
      )
    );
  };

  const removeDirection = (id) => {
    setDirections(directions.filter(direction => direction.id !== id));
  };

  const toggleBulkAdd = () => {
    setShowBulkAdd(!showBulkAdd);
  };

  const addBulkDirections = () => {
    if (bulkDirections.trim()) {
      const newDirections = bulkDirections
        .split('\n')
        .filter(text => text.trim())
        .map((text) => ({
          id: Date.now().toString() + Math.random().toString().slice(2, 8),
          text: text.trim(),
          isHeader: false
        }));
      
      setDirections([...directions, ...newDirections]);
      setBulkDirections('');
      setShowBulkAdd(false);
    }
  };

  const toggleReordering = () => {
    setIsReordering(!isReordering);
  };

  const handleReorder = (newDirections) => {
    setDirections(newDirections);
  };

  const renderDirectionItem = (direction, index) => (
    <div className="reordering-item">
      {!direction.isHeader && (
        <div className="step-number">Step {directions.filter(d => !d.isHeader).findIndex(d => d.id === direction.id) + 1}</div>
      )}

      <input
        type="text"
        className="text-input-reordering"
        value={direction.text}
        onChange={(e) => updateDirection(direction.id, e.target.value)}
        style={direction.isHeader ? { fontWeight: 'bold' } : {}}
        disabled={isReordering}
      />
    </div>
  );

  return (
    <div className="form-section">
      <h2 className="form-section-title">Directions</h2>
      <p className="form-section-description">
        Explain how to make your recipe, including oven temperatures, baking or cooking
        times, and pan sizes, etc. Use optional headers to organize the different parts of the
        recipe (i.e. Prep, Bake, Decorate).
      </p>
      
      <div className="entry-options">
        {!isReordering && (
          <div className="bulk-add-wrapper">
            <span>Enter directions below or </span>
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
            placeholder="Enter each direction on a new line"
            value={bulkDirections}
            onChange={(e) => setBulkDirections(e.target.value)}
            rows={5}
          />
          <button type="button" className="add-button" onClick={addBulkDirections}>
            <Plus size={16} strokeWidth={4} className="add-button-icon"/>
            ADD STEPS
          </button>
        </div>
      ) : (
        <>
          {isReordering ? (
            <DraggableList
              items={directions}
              onReorder={handleReorder}
              renderItem={renderDirectionItem}
              itemClassName="direction-item"
            />
          ) : (
            directions.map((direction, index) => (
              <div className="input-container" key={direction.id}>
                {!direction.isHeader && (
                  <div className="step-number">Step {directions.filter(d => !d.isHeader).findIndex(d => d.id === direction.id) + 1}</div>
                )}

                <div className="input-row">
                  <textarea
                    className="textarea-input"
                    placeholder={direction.isHeader 
                      ? "e.g. Preparation" 
                      : "e.g. Preheat oven to 350 degrees F..."}
                    value={direction.text}
                    onChange={(e) => updateDirection(direction.id, e.target.value)}
                    style={direction.isHeader ? { fontWeight: 'bold' } : {}}
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeDirection(direction.id)}
                    aria-label="Remove direction"
                  >
                    <CircleX size={20} />
                  </button>
                </div>  
              </div>
            ))
          )}

          {!isReordering && (
            <div className="add-buttons">
            <button type="button" className="add-button" onClick={addStep}>
              <Plus size={16} strokeWidth={4} className="add-button-icon"/>
              ADD STEP
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

export default DirectionsSection;