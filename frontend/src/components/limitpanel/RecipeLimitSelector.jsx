import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './RecipeLimitSelector.module.css';

const RecipeLimitSelector = ({ selectedLimit, setSelectedLimit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const options = [4, 10, 20, 30, 50, 100];
  
  const handleOptionClick = (option) => {
    setSelectedLimit(option);
    setIsOpen(false);
  };
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className={styles.container} ref={dropdownRef}>
      <button 
        className={styles.button} 
        onClick={toggleDropdown}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        Show {selectedLimit} recipes
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      <div className={`${styles.dropdown} ${isOpen ? '' : styles.hidden}`}>
        <ul className={styles.optionsList} role="listbox">
          {options.map((option) => (
            <li
              key={option}
              className={`${styles.option} ${selectedLimit === option ? styles.selected : ''}`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={selectedLimit === option}
            >
              {option} recipes
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeLimitSelector;