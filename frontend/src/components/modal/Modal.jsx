import React, { useEffect } from 'react';
import './Modal.css';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="adpage-modal-overlay">
      <div className="adpage-modal-content">
        <div className="adpage-modal-header">
          <h3>{title}</h3>
          <button className="adpage-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="adpage-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;