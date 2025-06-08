import './Navbar.css';
import { Link } from 'react-router-dom';
import Auth from './Auth'

// Navbar component
export default function Navbar({ user }) {
    return (
        <nav className='nav'>
            <div className='site-title'>Recipe Saver</div>
                {/* only show the Recipes and RecipeSearch if user is signed in */}
                <ul>
                    {user && 
                        <li>
                            <Link to='/Recipes'>Recipes</Link>
                        </li>
                    }
                    {user && 
                        <li>
                            <Link to='/RecipeSearch'>Search</Link>
                        </li>
                    }
                    <li>
                        <Auth />
                    </li>
                </ul>
        </nav>
    );
};