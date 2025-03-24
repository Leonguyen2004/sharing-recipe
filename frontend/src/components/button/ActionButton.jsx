import React from 'react';
import './ActionButton.css';

const ActionButton = ({ icon, children, onClick, variant = "primary", className = "" }) => {
  return (
    <button 
      className={`abcom-action-button ${variant} ${className}`}
      onClick={onClick}
    >
      {icon && <span className="abcom-action-icon">{icon}</span>}
      {children && <span className="abcom-action-text">{children}</span>}
    </button>
  );
};

export default ActionButton;