import React from 'react';
import './IconButton.css';

const IconButton = ({ icon, children, onClick, variant = "primary", size = "" , disabled = false}) => {
  return (
    <button 
      className={`ibcom-icon-button ${variant} ${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="ibcom-icon-button-icon">{icon}</span>}
      {children && <span className="ibcom-icon-button-text">{children}</span>}
    </button>
  );
};

export default IconButton;