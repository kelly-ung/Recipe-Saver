import './RecipeSearch.css';
import React, { useState, useEffect } from 'react';
import {v4 as uuid} from 'uuid';
import axios from 'axios'; // for making API requests


export default function RecipeSearch({ recipes, setRecipes }) {
    const [query, setQuery] = useState('');
    const [recipeResults, setRecipeResults] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Effect to show the popup for 2 seconds
    useEffect(() => {
        if (showPopup) {
        const timer = setTimeout(() => {
            setShowPopup(false);
        }, 2000); 

        return () => clearTimeout(timer);
        }
    }, [showPopup]);

    // Search recipes based on query using the Edamam API 
    const searchRecipes = () => {
        axios.get('https://recipe-saver-server.vercel.app/', { params: { search: query } })
        .then(function (response) {
            const data = response.data; // response.data is an array of recipe objects
            setRecipeResults(data);
            setHasSearched(true);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault(); // prevent page reload on form submission
        searchRecipes(); 
    };

    // Handle saving a recipe and adds it to the Recipes page
    const handleSave = (recipe) => {
        let notes = 'Ingredients: \n';

        // Create a formatted string of ingredients
        recipe.ingredients.map(ingredient => (
            notes += '•  ' + ingredient.text + '\n'
        ))
        notes += '\n' + recipe.source

        // Add the recipe to the recipes state with a unique ID
        setRecipes([
            ...recipes,
            { id: uuid(), 
              name: recipe.label, 
              notes: notes, 
              image: recipe.image,
              url: recipe.url
            }
        ]);
        setShowPopup(true); // Show the popup alert that the recipe was saved
    };

    return (
        <div className='main'>
            <div>
                {showPopup && (
                    <div className='popup-alert'>Recipe Saved!</div> // notify user that the recipe was successfully saved 
                )}
            </div>

            <div className='header'>
                <h1 className='title'>Recipe Search API </h1>
            </div>
            <img className='edamam-badge' src={`${process.env.PUBLIC_URL}/images/Edamam_Badge_White.svg`} alt="Edamam Badge Light" />
            
            {/* form for searching recipes */}
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
                {/* display the search results */}
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
                
                {/* if no recipes match the search query */}
                {(hasSearched === true && recipeResults.length === 0) && 
                    (<p>No recipes match your search. Please try a different keyword or check your spelling.</p>)}
            </div>
        </div>
    );
};