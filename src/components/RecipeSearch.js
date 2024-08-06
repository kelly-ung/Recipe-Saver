import './RecipeSearch.css';
import React, { useState, useEffect } from 'react';
import {v4 as uuid} from 'uuid';

export default function RecipeSearch({ recipes, setRecipes }) {
    const [query, setQuery] = useState('');
    const [recipeResults, setRecipeResults] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const app_id = process.env.REACT_APP_API_ID;
    const app_key = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        if (showPopup) {
        const timer = setTimeout(() => {
            setShowPopup(false);
        }, 2000); 

        return () => clearTimeout(timer);
        }
    }, [showPopup]);

    const searchRecipes = async () => {
        const url = `https://api.edamam.com/search?q=${query}&app_id=${app_id}&app_key=${app_key}`;
        const response = await fetch(url);
        const data = await response.json();
        setRecipeResults(data.hits);
        setHasSearched(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        searchRecipes();
    };

    const handleSave = (recipe) => {
        let notes = 'Ingredients: \n';

        recipe.ingredients.map(ingredient => (
            notes += '•  ' + ingredient.text + '\n'
        ))
        notes += '\n' + recipe.source

        setRecipes([
            ...recipes,
            { id: uuid(), 
              name: recipe.label, 
              notes: notes, 
              image: recipe.image,
              url: recipe.url
            }
        ]);
        setShowPopup(true);
    };

    return (
        <div className='main'>
            <div>
                {showPopup && (
                    <div className='popup-alert'>Recipe Saved!</div>
                )}
            </div>

            <div className='header'>
                <h1 className='title'>Recipe Search API </h1>
            </div>
            <img className='edamam-badge' src={`${process.env.PUBLIC_URL}/images/Edamam_Badge_White.svg`} alt="Edamam Badge Light" />


            <div className='search-recipes'>
                <form className='search-form' onSubmit={handleSearch}>
                    <input className='search-bar'
                        type='text'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Search for a recipe...'
                    />
                    <button className='search-button' type='submit'>Search</button>
                </form>

                <div className='recipe-display'>
                    {recipeResults.map(recipe => (
                        <div className='recipe result'>
                            <button className='save-button'
                                onClick={() => handleSave(recipe.recipe)}>Save
                            </button>
                            <h1>{recipe.recipe.label}</h1>
                            <img className='recipe-img' src={recipe.recipe.image} alt={recipe.recipe.label} />
                            <h3>Ingredients:</h3>
                            <ul className='ingredients'>
                                {recipe.recipe.ingredients.map(ingredient => (
                                    <li className='ingredient-item'>
                                        {ingredient.text}
                                    </li>
                                ))}
                            </ul>
                            <p>{recipe.recipe.source}</p>
                            <a className='recipe-link' href={recipe.recipe.url} target='_blank' rel='noopener noreferrer'>View Recipe</a>
                        </div>
                    ))} 
                </div>
                
                {(hasSearched === true && recipeResults.length === 0) && 
                    (<p>No recipes match your search. Please try a different keyword or check your spelling.</p>)}
            </div>
        </div>
    );
};