import React from 'react';
import IconButton from '../../../components/button/IconButton';
import { Printer, Utensils } from 'lucide-react';
import './DirectionsSection.css';

const Directions = ({ directions, madeCounts }) => {
  return (
    <div className="rdpage-directions-section">
      <h2 className="rdpage-section-title">Directions</h2>
      
      <div className="rdpage-directions-list">
        {directions.map((step, index) => {
          if (!step.text) return null;
          
          if (step.isHeader) {
            return (
              <h3 key={step.id || index} className="rdpage-direction-header">
                {step.text}
              </h3>
            );
          }
          
          return (
            <div className="rdpage-direction-step" key={step.id || index}>
              <h3 className="rdpage-step-title">Step {index + (directions[0].isHeader ? 0 : 1)}</h3>
              <p className="rdpage-step-instruction">{step.text}</p>
            </div>
          );
        })}
      </div>
      
      <div className="rdpage-directions-footer">
        <IconButton
          icon={<Utensils size={18} />} 
          variant="primary"
          size="fullwidth"
        >
          I MADE IT
        </IconButton>
        
        <IconButton 
          icon={<Printer size={18} />} 
          variant="primary"
          size="fullwidth"
        >
          PRINT
        </IconButton>
      </div>
      
      <div className="rdpage-made-it-counter">
        <strong style={{ marginRight: "5px" }}>{madeCounts || 40}</strong> home cooks made it!
      </div>
    </div>
  );
};

export default Directions;