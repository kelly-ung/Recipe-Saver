import './Home.css';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Landing page for the application
export default function Home() {
    const navigate = useNavigate();

    // Function to handle sign-in with Google and navigate to the specified path
    const handleSignIn = async (path) => {
        const provider = new GoogleAuthProvider();
        try {
          await signInWithPopup(auth, provider);
          navigate(path); 
        } catch (error) {
          console.error("Error signing in: ", error);
        }
    };

    // Render the landing page with 'Save Recipes' and 'Explore Recipes' buttons
    // The buttons will trigger the sign-in process and redirect to the appropriate page
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