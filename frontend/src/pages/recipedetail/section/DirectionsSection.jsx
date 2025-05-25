import React, { useState } from 'react';
import IconButton from '../../../components/button/IconButton';
import { Printer, Utensils } from 'lucide-react';
import './DirectionsSection.css';

const Directions = ({ recipe }) => {
  let cntStep = 1;

  return (
    <div className="rdpage-directions-section">
      <h2 className="rdpage-section-title">Directions</h2>
      
      <div className="rdpage-directions-list">
        {recipe.directions.map((step, index) => {
          if (!step.text) return null; 
          
          if (step.isHeader) {
            return (
              <h1 key={step.id || index} className="rdpage-direction-header">
                {step.text}
              </h1>
            );
          }

          const titleStep = `Step ${cntStep}`;
          cntStep++;
          
          return (
            <div className="rdpage-direction-step" key={step.id || index}>
              <h3 className="rdpage-step-title">{titleStep}</h3>
              <p className="rdpage-step-instruction">{step.text}</p>
            </div>
          );
        })}
      </div>
      
      <div className="rdpage-directions-footer">
        {/* <IconButton
          icon={<Utensils size={18} />} 
          variant="primary"
          size="fullwidth"
        >
          I MADE IT
        </IconButton> */}
        
        {/* <IconButton 
          icon={<Printer size={18} />} 
          variant="primary"
          size="fullwidth"
        >
          PRINT
        </IconButton> */}
      </div>
    </div>
  );
};

export default Directions;