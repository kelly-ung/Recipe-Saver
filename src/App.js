import './App.css';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Recipes from './components/Recipes';
import RecipeSearch from './components/RecipeSearch';

export default function App() {
    const [recipes, setRecipes] = useState([]);
    const [starred, setStarred] = useState([]);

    return (
        <div className='container'>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/Recipes' element={<Recipes recipes={recipes} setRecipes={setRecipes} starred={starred} setStarred={setStarred} />} />
                <Route path='/RecipeSearch' element={<RecipeSearch recipes={recipes} setRecipes={setRecipes} />} />
            </Routes>
        </div>
    );
};