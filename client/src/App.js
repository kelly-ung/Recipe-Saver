import './App.css';
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Recipes from './components/Recipes';
import RecipeSearch from './components/RecipeSearch';
import { auth, firestore } from './components/firebase'; // for saving and retrieving recipes based on user
import { onAuthStateChanged } from 'firebase/auth'; // for listening to authentication state changes
import { doc, setDoc, onSnapshot } from 'firebase/firestore'; // for real-time updates to recipes in Firestore

export default function App() {
    const [recipes, setRecipes] = useState([]);
    const [starred, setStarred] = useState([]);
    const [user, setUser] = useState(null);

    // Listen for authentication state changes using Firebase Auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe(); // cleanup when component unmounts
    }, []);

    // Fetch recipes from Firestore when user is authenticated
    useEffect(() => {
        if (user) {
            const recipesRef = doc(firestore, 'recipes', user.uid); // reference to the user's recipes document
            const unsubscribeRecipes = onSnapshot( // real-time listener for changes in the recipes document
                recipesRef,
                (doc) => {
                    if (doc.exists()) {
                        setRecipes(doc.data().recipes || []); // if the document exists, set the recipes data or empty array if not present
                    } else {
                        setRecipes([]); // if the document does not exist, set recipes to an empty array
                    }
                },
                (error) => {
                    console.error("Error fetching recipes: ", error); 
                }
            );
            return () => unsubscribeRecipes(); // cleanup when component unmounts
        } else {
            setRecipes([]); 
        }
    }, [user]);

    // Update recipes in Firestore when recipes state changes
    useEffect(() => {
        if (user) {
            if (recipes.length > 0) {
                const updateRecipesInDB = async () => { 
                    try {
                        const recipesRef = doc(firestore, 'recipes', user.uid); // reference to the user's recipes document
                        await setDoc(recipesRef, { recipes }, { merge: true }); // merge the recipes state into the document
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
            {/* Only allow navigation to specified pages if the user is authenticated */}
            {user ?
                <Routes>
                    <Route path='/' element={<Recipes recipes={recipes} setRecipes={setRecipes} starred={starred} setStarred={setStarred} />} />
                    <Route path='/Recipes' element={<Recipes recipes={recipes} setRecipes={setRecipes} starred={starred} setStarred={setStarred} />} />
                    <Route path='/RecipeSearch' element={<RecipeSearch recipes={recipes} setRecipes={setRecipes} />} />
                </Routes>
                :
                // Display page for when the user is not authenticated
                <Home />
            }
        </div>
    );
};