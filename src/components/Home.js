import './Home.css';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function Home() {
    const navigate = useNavigate();

    const handleSignIn = async (path) => {
        const provider = new GoogleAuthProvider();
        try {
          await signInWithPopup(auth, provider);
          navigate(path); 
        } catch (error) {
          console.error("Error signing in: ", error);
        }
    };

    return (
        <body className='home-page'>
            <h1 className='home-title'>Welcome to <i>Recipe Saver</i></h1>
            <h3 className='description'>Create Your Recipe Collection and Discover New Recipes</h3>
            <div className='space-buttons'>
                <button className='home-buttons' onClick={() => handleSignIn('/Recipes')}>Save Recipes</button>
                <button className='home-buttons' onClick={() => handleSignIn('/RecipeSearch')}>Explore Recipes</button>
            </div>
        </body>
    );
};