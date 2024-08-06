import './Navbar.css';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className='nav'>
            <div className='site-title'>Recipe Saver</div>
                <ul>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/Recipes'>Recipes</Link>
                    </li>
                    <li>
                        <Link to='/RecipeSearch'>Search</Link>
                    </li>
                </ul>
        </nav>
    );
};