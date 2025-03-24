import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile.jsx';

const DraggableList = ({ 
  items, 
  onReorder, 
  renderItem, 
  itemClassName = "" 
}) => {
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState(null);
  const isMobile = useIsMobile();

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === index) return;
    
    setDragOverItemIndex(index);
  };

  const handleDragLeave = () => {
    // We don't clear dragOverItemIndex here as it would cause flickering
    // during drag operations between adjacent items
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    e.target.style.opacity = '1'; 

    // If we have valid indexes and they're different
    if (draggedItemIndex !== null && 
        dragOverItemIndex !== null && 
        draggedItemIndex !== dragOverItemIndex) {
      
      const newItems = [...items];
      const draggedItem = newItems[draggedItemIndex];
      
      // Remove the dragged item
      newItems.splice(draggedItemIndex, 1);
      // Insert it at the new position
      newItems.splice(dragOverItemIndex, 0, draggedItem);
      
      onReorder(newItems);
    }

    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleTouchStart = (index) => {
    setDraggedItemIndex(index);
  };

  const moveItem = (from, to) => {
    if (from === to) return;
    
    const newItems = [...items];
    const draggedItem = newItems[from];
    
    newItems.splice(from, 1);
    newItems.splice(to, 0, draggedItem);
    
    onReorder(newItems);
  };

  const moveUp = (index) => {
    if (index > 0) {
      moveItem(index, index - 1);
    }
  };

  const moveDown = (index) => {
    if (index < items.length - 1) {
      moveItem(index, index + 1);
    }
  };

  // Calculate transform style for each item
  const getItemStyle = (index) => {
    if (draggedItemIndex === null || dragOverItemIndex === null) return {};
    
    // Don't apply any transform to the dragged item itself
    if (index === draggedItemIndex) return { opacity: 0 };

    // Apply transform to items that need to move
    if (draggedItemIndex < dragOverItemIndex) {
      // Move items up
      if (index > draggedItemIndex && index <= dragOverItemIndex) {
        return { transform: 'translateY(-100%)', transition: 'transform 0.2s' };
      }
    } else if (draggedItemIndex > dragOverItemIndex) {
      // Move items down
      if (index < draggedItemIndex && index >= dragOverItemIndex) {
        return { transform: 'translateY(100%)', transition: 'transform 0.2s' };
      }
    }
    
    return {};
  };

  return (
    <div className="draggable-list">
      {items.map((item, index) => (
        <div 
          key={item.id}
          className={`draggable-item ${itemClassName} ${draggedItemIndex === index ? 'dragging' : ''} ${dragOverItemIndex === index ? 'drag-over' : ''}`}
          draggable={!isMobile}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
          onTouchStart={() => handleTouchStart(index)}
          style={getItemStyle(index)}
        > 
          <div className="item-content">
            {renderItem(item, index)}
          </div>

          {!isMobile && (
            <div className="drag-handle">
              <GripVertical size={20} />
            </div>
          )}
          
          {isMobile && (
            <div className="item-actions">
                {index > 0 && (
                    <button 
                        type="button" 
                        className="move-button up"
                        onClick={() => moveUp(index)}
                    >
                        ▲
                    </button>
                )}
                {index < items.length - 1 && (
                    <button 
                        type="button" 
                        className="move-button down"
                        onClick={() => moveDown(index)}
                    >
                        ▼
                    </button>
                )}
            </div>
           )}
        </div>
      ))}
    </div>
  );
};

export default DraggableList;