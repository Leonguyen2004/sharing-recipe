import React from 'react';
import './SideButton.css';

const SideButton = ({ icon, children, onClick, variant = "primary", size = "" , disabled = false}) => {
  return (
    <button 
      className={`ibcom-icon-button ${variant} ${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="sbcom-icon-button-icon">{icon}</span>}
      {children && <span className="sbcom-icon-button-text">{children}</span>}
    </button>
  );
};

export default SideButton;