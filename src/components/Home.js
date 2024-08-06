import './Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <body className='home-page'>
            <h1 className='home-title'>Welcome to <i>Recipe Saver</i></h1>
            <h3 className='description'>Create Your Recipe Collection and Discover New Recipes</h3>
            <div className='space-buttons'>
                <button className='home-buttons' onClick={() => navigate('/Recipes')}>Save Recipes</button>
                <button className='home-buttons' onClick={() => navigate('/RecipeSearch')}>Explore Recipes</button>
            </div>
        </body>
    );
};