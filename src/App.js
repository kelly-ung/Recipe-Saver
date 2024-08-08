import './App.css';
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Recipes from './components/Recipes';
import RecipeSearch from './components/RecipeSearch';
import { auth, firestore } from './components/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

export default function App() {
    const [recipes, setRecipes] = useState([]);
    const [starred, setStarred] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const recipesRef = doc(firestore, 'recipes', user.uid);
            const unsubscribeRecipes = onSnapshot(
                recipesRef,
                (doc) => {
                    if (doc.exists()) {
                        setRecipes(doc.data().recipes || []);
                    } else {
                        setRecipes([]);
                    }
                },
                (error) => {
                    console.error("Error fetching recipes: ", error);
                }
            );
            return () => unsubscribeRecipes();
        } else {
            setRecipes([]); 
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            if (recipes.length > 0) {
                const updateRecipesInDB = async () => {
                    try {
                        const recipesRef = doc(firestore, 'recipes', user.uid);
                        await setDoc(recipesRef, { recipes }, { merge: true });
                    } catch (error) {
                        console.error("Error updating recipes: ", error);
                    }
                };
                updateRecipesInDB();
            }
        }
    }, [recipes, user]);

    return (
        <div className='container'>
            <Navbar user={user} />
            {user ?
                <Routes>
                    <Route path='/' element={<Recipes recipes={recipes} setRecipes={setRecipes} starred={starred} setStarred={setStarred} />} />
                    <Route path='/Recipes' element={<Recipes recipes={recipes} setRecipes={setRecipes} starred={starred} setStarred={setStarred} />} />
                    <Route path='/RecipeSearch' element={<RecipeSearch recipes={recipes} setRecipes={setRecipes} />} />
                </Routes>
                :
                <Home />
            }
        </div>
    );
}