import React, { useEffect, useState } from 'react';
import DirectionsSection from './section/DirectionsSection';
import IngredientsSection from './section/IngredientsSection';
import DetailSection from './section/DetailSection';
import IntroSection from './section/IntroSection';
import NoteSection from './section/NoteSection';
import TimeSection from './section/TimeSection';
import './RecipeForm.css';

const RecipeForm = () => {
  const [ingredients, setIngredients] = useState([
    { id: '1', text: '', isHeader: false },
    { id: '2', text: '', isHeader: false },
    { id: '3', text: '', isHeader: false }
  ]);

  const [directions, setDirections] = useState([
    { id: '1', text: '', isHeader: false },
    { id: '2', text: '', isHeader: false },
    { id: '3', text: '', isHeader: false }
  ]);

  const [notes, setNotes] = useState([]);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [servings, setServings] = useState('');
  const [categories, setCategories] = useState([]);
  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [prepTimeUnit, setPrepTimeUnit] = useState('mins');
  const [cookTimeUnit, setCookTimeUnit] = useState('mins');
  const [totalTime, setTotalTime] = useState(0);
  const [additionalTimers, setAdditionalTimers] = useState([]);

  // Calculate total time when prep or cook time changes
  useEffect(() => {
    const prepMinutes = prepTimeUnit === 'hours' ? prepTime * 60 : prepTime;
    const cookMinutes = cookTimeUnit === 'hours' ? cookTime * 60 : cookTime;
    
    let additionalMinutes = 0;
    additionalTimers.forEach(timer => {
      additionalMinutes += timer.unit === 'hours' ? timer.time * 60 : timer.time;
    });
    
    setTotalTime(prepMinutes + cookMinutes + additionalMinutes);
  }, [prepTime, cookTime, prepTimeUnit, cookTimeUnit, additionalTimers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US');
    
    // Create recipe object with all form data
    const recipeData = {
      title: recipeTitle,
      description,
      photo,
      ingredients,
      directions,
      servings,
      categories,
      prepTime,
      prepTimeUnit,
      cookTime,
      cookTimeUnit,
      totalTime,
      additionalTimers,
      notes,
      createdAt: formattedDate
    };
    
    console.log('Recipe submitted:', recipeData);
    
    // In a real application, you would send this data to a server
    alert('Recipe submitted successfully!');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
      setRecipeTitle('');
      setDescription('');
      setPhoto(null);
      setPhotoPreview(null);
      setIngredients([{ id: '1', text: '', isHeader: false }, { id: '2', text: '', isHeader: false }, { id: '3', text: '', isHeader: false }]);
      setDirections([{ id: '1', text: '', isHeader: false }, { id: '2', text: '', isHeader: false }, { id: '3', text: '', isHeader: false }]);
      setNotes([]);
      setServings('');
      setCategories([]);
      setPrepTime(0);
      setCookTime(0);
      setPrepTimeUnit('mins');
      setCookTimeUnit('mins');
      setTotalTime(0);
      setAdditionalTimers([]);
    }
  };

  return (
    <div className="recipe-form-container">
      <form onSubmit={handleSubmit}>
        <IntroSection
          recipeTitle={recipeTitle}
          setRecipeTitle={setRecipeTitle}
          description={description}
          setDescription={setDescription}
          photo={photo}
          setPhoto={setPhoto}
          photoPreview={photoPreview}
          setPhotoPreview={setPhotoPreview}
        />
        
        <div className="form-divider"></div>
        
        <IngredientsSection
          ingredients={ingredients}
          setIngredients={setIngredients}
        />
        
        <div className="form-divider"></div>
        
        <DirectionsSection
          directions={directions}
          setDirections={setDirections}
        />
        
        <div className="form-divider"></div>
        
        <DetailSection
          servings={servings}
          setServings={setServings}
          categories={categories}
          setCategories={setCategories}
        />
        
        <div className="form-divider"></div>
        
        <TimeSection
          prepTime={prepTime}
          setPrepTime={setPrepTime}
          cookTime={cookTime}
          setCookTime={setCookTime}
          prepTimeUnit={prepTimeUnit}
          setPrepTimeUnit={setPrepTimeUnit}
          cookTimeUnit={cookTimeUnit}
          setCookTimeUnit={setCookTimeUnit}
          totalTime={totalTime}
          additionalTimers={additionalTimers}
          setAdditionalTimers={setAdditionalTimers}
        />
        
        <div className="form-divider"></div>
        
        <NoteSection
          notes={notes}
          setNotes={setNotes}
        />
        
        <div className="form-divider"></div>
        
        <div className="form-disclaimer">
          Allrecipes is all about cooks like you. If you found this recipe in a magazine, cookbook, or on a
          website, we can't publish it.
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            CANCEL
          </button>
          <button type="submit" className="submit-button">
            Submit Recipe
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;