import { CircleX, Plus } from 'lucide-react';
import React from 'react';

const RecipeNotes = ({ notes, setNotes }) => {
  const addNote = () => {
    setNotes([...notes, '']);
  };

  const updateNote = (index, text) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = text;
    setNotes(updatedNotes);
  };

  const removeNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  };

  return (
    <div className="form-section">
      <h2 className="form-section-title">Notes (Optional)</h2>
      <p className="form-section-description">
        Add any helpful tips about ingredient substitutions, serving, or storage here.
      </p>
      
      {notes.map((note, index) => (
        <div className="input-container" key={index}>
          <div className="input-row">
            <textarea
              className="textarea-input"
              placeholder="Add your note here..."
              value={note}
              onChange={(e) => updateNote(index, e.target.value)}
            />
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeNote(index)}
              aria-label="Remove note"
            >
              <CircleX size={20} />
            </button>
          </div>
        </div>
      ))}
      
      <button type="button" className="add-button" onClick={addNote}>
        <Plus size={16} strokeWidth={4} className="add-button-icon"/>
        ADD NOTE
      </button>
    </div>
  );
};

export default RecipeNotes;