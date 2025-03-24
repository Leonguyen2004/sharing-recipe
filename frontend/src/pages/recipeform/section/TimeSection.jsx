import { CircleX, Plus } from 'lucide-react';
import React from 'react';

const RecipeTimers = ({
  prepTime,
  setPrepTime,
  cookTime,
  setCookTime,
  prepTimeUnit,
  setPrepTimeUnit,
  cookTimeUnit,
  setCookTimeUnit,
  totalTime,
  additionalTimers,
  setAdditionalTimers
}) => {

  const handleAddAdditionalTimer = () => {
    const newTimer = {
      id: Date.now().toString(),
      type: "",
      time: 0,
      unit: 'mins'
    };
    
    setAdditionalTimers([...additionalTimers, newTimer]);
  };

  const updateAdditionalTimer = (index, field, value) => {
    const updatedTimers = [...additionalTimers];
    updatedTimers[index] = { ...updatedTimers[index], [field]: value };
    setAdditionalTimers(updatedTimers);
  };

  const removeAdditionalTimer = (id) => {
    setAdditionalTimers(additionalTimers.filter(timer => timer.id !== id));
  };

  // Format total time to hours and minutes
  const formatTotalTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours} hr ${minutes > 0 ? `${minutes} min` : ''}`;
    }
    return `${minutes} min`;
  };

  return (
    <div className="form-section">
      <div className="input-row input-time-row">
        <label htmlFor="prep-time">Prep Time</label>
        <div className="input-with-select">
          <input
            id="prep-time"
            type="number"
            min="0"
            value={prepTime}
            onChange={(e) => setPrepTime(Number(e.target.value))}
          />
          <select
            value={prepTimeUnit}
            onChange={(e) => setPrepTimeUnit(e.target.value)}
          >
            <option value="mins">mins</option>
            <option value="hours">hours</option>
          </select>
        </div>
      </div>
      
      <div className="input-row input-time-row">
        <label htmlFor="cook-time">Cook Time (optional)</label>
        <div className="input-with-select">
          <input
            id="cook-time"
            type="number"
            min="0"
            value={cookTime}
            onChange={(e) => setCookTime(Number(e.target.value))}
          />
          <select
            value={cookTimeUnit}
            onChange={(e) => setCookTimeUnit(e.target.value)}
          >
            <option value="mins">mins</option>
            <option value="hours">hours</option>
          </select>
        </div>
      </div>
      
      {additionalTimers.map((timer, index) => (
        <div className="input-row input-additional-timer">
          <select
            value={timer.type}
            placeholder="Select Time"
            onChange={(e) => updateAdditionalTimer(index, "type", e.target.value)}
          >
            <option value="Time" disabled>--Time--</option>
            <option value="Additional">Additional</option>
            <option value="Cool">Cool</option>
            <option value="Freeze">Freeze</option>
            <option value="Marinate">Marinate</option>
            <option value="Rest">Rest</option>
            <option value="Rise">Rise</option>
            <option value="Soak">Soak</option>
          </select>
          <div className="input-with-select">
            <input
              type="number"
              min="0"
              value={timer.time}
              onChange={(e) => updateAdditionalTimer(index, "time", Number(e.target.value))}
            />
            <select
              value={timer.unit}
              onChange={(e) => updateAdditionalTimer(index, "unit", e.target.value)}
            >
              <option value="mins">mins</option>
              <option value="hours">hours</option>
            </select>
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeAdditionalTimer(timer.id)}
            >
              <CircleX size={20} />
            </button>
          </div>
        </div>
      ))}
      
      <div className="input-row input-time-row">
        <label>Total Time</label>
        <div className="timer-display">{formatTotalTime(totalTime)}</div>
      </div>

      <button type="button" className="add-button" onClick={handleAddAdditionalTimer}>
        <Plus size={16} strokeWidth={4} className="add-button-icon"/>
        ADD TIME
      </button>
    </div>
  );
};

export default RecipeTimers;