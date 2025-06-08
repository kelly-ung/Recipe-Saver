import './Recipes.css';
import { useCallback, useState, useEffect } from 'react'; // useCallback to avoid unnecessary re-renders
import {v4 as uuid} from 'uuid'; // for unique IDs
import ReactQuill from 'react-quill'; // for rich text editing
import 'react-quill/dist/quill.snow.css'; // for quill styles
import DOMPurify from 'dompurify'; // for sanitizing HTML content
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage for image uploads

// Recipes page for displaying, adding, editing, and deleting recipes
export default function Recipes({ recipes, setRecipes, starred, setStarred }) {
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [image, setImage] = useState(null);
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);
    const [recipeToEdit, setRecipeToEdit] = useState(null);
    const [view, setView] = useState('All'); // view all recipes or starred recipes

    // Handle adding a new recipe
    const handleAdd = () => {
        setAdd(true);
        setEdit(false);
        setRecipeToEdit(null);
        setName('');
        setNotes('');
        setImage(null);
    };

    // Handle submitting a new recipe
    const handleAddSubmit = () => {
        setRecipes([
            ...recipes,
            { id: uuid(), name: name, notes: notes, image: image, url: null, star: false }
        ])
        setAdd(false);
        setName('');
        setNotes('');
        setImage(null);
    };
    
    // Handle canceling the add mode
    const handleCancel = () => {
        setAdd(false);
        setName('');
        setNotes('');
        setImage(null);
    };

    // Handle editing a recipe
    const handleEdit = (recipe) => {
        setAdd(false);
        setEdit(true);
        setRecipeToEdit(recipe);
        setName(recipe.name);
        setNotes(recipe.notes);
        setImage(recipe.image);
    };

    // Handle submitting the edited recipe
    const handleEditSubmit = (recipe) => {
        const editedRecipes = recipes.map(r => {
            if (r.id === recipe.id) { // find the recipe to edit based on ID
                return {
                    ...r, // preserve other properties
                    name: name, notes: notes, image: image // update the name, notes, and image
                }
            } 
            return r; // return the recipe unchanged if it's not the one being edited
        });
        setRecipes(editedRecipes);
        setEdit(false);
        setRecipeToEdit(null);
        setName('');
        setNotes('');
        setImage(null);
    };

    // Handle file upload for recipe images
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // get the first file from the input
        if (!file) return;

        const storage = getStorage(); // get Firebase storage instance
        const fileRef = ref(storage, `images/${file.name}`); // create a reference to the file in storage

        // Upload the file to the specified reference in Firebase Storage
        uploadBytes(fileRef, file).then(function(snapshot) { 
            getDownloadURL(snapshot.ref).then((downloadURL) => { // snapshot contains metadata about the uploaded file
                setImage(downloadURL);  // get the download URL of the uploaded file
            });
        });
    };

    // Handle starring a recipe
    const handleStarred = useCallback((recipe) => {
        let toStar = !recipe.star; // toggle the star status

        // If the recipe is being starred, move it to the top of the list
        if (toStar) {
            setRecipes((prevRecipes) => {
                const updatedRecipes = (prevRecipes.filter(r =>  // filter out the starred recipe
                    r.id !== recipe.id)
                );
                return [{...recipe, star: true}, ...updatedRecipes]; // add the starred recipe to the top of the list
            });
        }

        // If the recipe is being unstarred, move it to the bottom of the list
        else {
            setRecipes((prevRecipes) => {
                const updatedRecipes = (prevRecipes.filter(r => // filter out the unstarred recipe
                    r.id !== recipe.id)
                );
                return [...updatedRecipes, {...recipe, star: false}]; // add the unstarred recipe to the bottom of the list
            });
        }

        const starredRecipes = recipes.filter(recipe => recipe.star); // filter the recipes to get only the starred ones
        setStarred(starredRecipes); 
    },[]);

    // Effect to update the starred recipes whenever the recipes change or handleStarred is called
    useEffect(() => {
        const starredRecipes = recipes.filter(recipe => recipe.star);
        setStarred(starredRecipes);
    }, [recipes, handleStarred]);


    return (
        <>
        <div className='main'>
            <div className='header'>
                <h1 className='title'>Saved Recipes</h1>
            </div>
            {/* view all recipes or starred recipes */}
            <div className='view-buttons'>
                <button className={view === 'All' && 'selected-view'} onClick={() => setView('All')}>All</button>
                <button className={view === 'Starred' && 'selected-view'} onClick={() => setView('Starred')}>Starred</button>
            </div>
            {/* Add button to add a new recipe, only visible when viewing all recipes */}
            {view ==='All' && <button className='add-button' onClick={handleAdd}>+ Add</button>}
            {add && 
                <AddMode 
                    name={name} 
                    setName={setName} 
                    notes={notes}
                    setNotes={setNotes}
                    handleAddSubmit={handleAddSubmit} 
                    handleCancel={handleCancel}
                    handleFileChange={handleFileChange}
                    image={image}
                />
            }
            {/* Display the recipes, either all or starred based on the view */}
            <div className='recipes'>
                {(view === 'All' ? recipes : starred).map(recipe => (
                    // Edit mode for the recipe being edited
                    <div> {edit && recipe.id === recipeToEdit.id ?
                        <EditMode 
                            recipe={recipeToEdit}
                            name={name} 
                            setName={setName} 
                            notes={notes}
                            setNotes={setNotes}
                            handleEditSubmit={handleEditSubmit}
                            handleFileChange={handleFileChange}
                            image={image}
                        />
                        :
                        // else display the recipe in view mode
                        <div className='recipe'>
                            <li style={{ listStyleType: 'none', whiteSpace: 'pre-wrap' }} key={recipe.id}> {/* whitespace is preserved and text will wrap */ }
                                <button onClick={() => handleStarred(recipe)} className={recipe.star && 'star-button'}>★</button> {/* star button  */}
                                <h2>{recipe.name}</h2>
                                {recipe.image && (<img className='recipe-img' src={recipe.image} alt={recipe.label} />)}
                                <div className='notes' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(recipe.notes)}} /> {/* cleans HTML to prevent harmful attacks */}
                                {recipe.url !== null && (
                                    <a className='recipe-link' href={recipe.url} target='_blank' rel='noopener noreferrer'>
                                        View Recipe</a>)
                                }
                                
                                <div className='style-buttons'>
                                    {/* Delete and Edit buttons for the recipe */}
                                    <button onClick={() => {
                                        setRecipes(recipes.filter(r => r.id !== recipe.id))
                                    }}>Delete</button>
                                    <button onClick={() => {handleEdit(recipe)}}>Edit</button>
                                </div>
                            </li>
                        </div>}
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

// AddMode component for adding recipes
function AddMode({ name, setName, notes, setNotes, handleAddSubmit, handleCancel, handleFileChange, image }) {
    return (
        <div className='recipe'>
            <div>
                <h2>Recipe Name: </h2>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            {/* ReactQuill is a rich text editor for React, allowing users to format text, add links, and more. */}
            <div>
                <h2>Notes: </h2>
                <ReactQuill 
                    value={notes}
                    onChange={(value) => setNotes(value)}
                />
            </div>
            {/* display the uploaded image and allow the user to upload a new one */}
            {image && (<img className='recipe-img' src={image} alt={name} /> )}
            <input type='file' accept='image/*' onChange={handleFileChange} />

            <div className='style-buttons'>
                <button onClick={handleAddSubmit}>Submit</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    );
};

// EditMode component for editing recipes
function EditMode({ recipe, name, setName, notes, setNotes, handleEditSubmit, handleFileChange, image }) {
    return (
        <div className='recipe'>
            <div>
                <h2>Recipe Name: </h2>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div>
                <h2>Notes: </h2>
                <ReactQuill 
                    value={notes}
                    onChange={value => setNotes(value)}
                />
            </div>
            {/* if image is provided, display it; else, check if the recipe already has an image */}
            {image ? (
                <img className='recipe-img' src={image} alt={name} />
            ) : recipe.image ? (
                <img className='recipe-img' src={recipe.image} alt={name} />
            ) : null}
            <input type='file' accept='image/*' onChange={handleFileChange} /> {/* input for uploading a new image */}

            <div className='recipe_footer'>
                <button onClick={() => handleEditSubmit(recipe)}>Submit</button>
            </div>
        </div>
    );
};