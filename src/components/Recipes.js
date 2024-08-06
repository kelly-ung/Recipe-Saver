import './Recipes.css';
import { useState, useEffect } from 'react';
import {v4 as uuid} from 'uuid';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

export default function Recipes({ recipes, setRecipes, starred, setStarred }) {
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [image, setImage] = useState(null);
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);
    const [recipeToEdit, setRecipeToEdit] = useState(null);
    const [view, setView] = useState('All');

    const handleAdd = () => {
        setAdd(true);
        setEdit(false);
        setRecipeToEdit(null);
        setName('');
        setNotes('');
        setImage(null);
    };

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
    
    const handleCancel = () => {
        setAdd(false);
        setName('');
        setNotes('');
        setImage(null);
    };

    const handleEdit = (recipe) => {
        setAdd(false);
        setEdit(true);
        setRecipeToEdit(recipe);
        setName(recipe.name);
        setNotes(recipe.notes);
        setImage(recipe.image);
    };

    const handleEditSubmit = (recipe) => {
        const editedRecipes = recipes.map(r => {
            if (r.id === recipe.id) {
                return {
                    ...r,
                    name: name, notes: notes, image: image
                }
            } 
                return r;
        });
        setRecipes(editedRecipes);
        setEdit(false);
        setRecipeToEdit(null);
        setName('');
        setNotes('');
        setImage(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(reader.result);
            console.log(reader.result)
          };
          reader.readAsDataURL(file);
        }
    };

    const handleStarred = (recipe) => {
        let toStar = !recipe.star; 

        if (toStar) {
            setRecipes((prevRecipes) => {
                const updatedRecipes = (prevRecipes.filter(r => 
                    r.id !== recipe.id)
                );
                return [{...recipe, star: true}, ...updatedRecipes];
            });
        }
        else {
            setRecipes((prevRecipes) => {
                const updatedRecipes = (prevRecipes.filter(r => 
                    r.id !== recipe.id)
                );
                return [...updatedRecipes, {...recipe, star: false}];
            });
        }

        const starredRecipes = recipes.filter(recipe => recipe.star);
        setStarred(starredRecipes);
    };

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

            <div className='view-buttons'>
                <button className={view === 'All' && 'selected-view'} onClick={() => setView('All')}>All</button>
                <button className={view === 'Starred' && 'selected-view'} onClick={() => setView('Starred')}>Starred</button>
            </div>

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

            <div className='recipes'>
                {(view === 'All' ? recipes : starred).map(recipe => (
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
                        <div className='recipe'>
                            <li style={{ listStyleType: 'none', whiteSpace: 'pre-wrap' }} key={recipe.id}>
                                <button onClick={() => handleStarred(recipe)} className={recipe.star && 'star-button'}>★</button>
                                <h2>{recipe.name}</h2>
                                {recipe.image && (<img className='recipe-img' src={recipe.image} alt={recipe.label} />)}
                                <div className='notes' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(recipe.notes)}} />
                                {recipe.url !== null && (
                                    <a className='recipe-link' href={recipe.url} target='_blank' rel='noopener noreferrer'>
                                        View Recipe</a>)
                                }
                                
                                <div className='style-buttons'>
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
            <div>
                <h2>Notes: </h2>
                <ReactQuill 
                    value={notes}
                    onChange={(value) => setNotes(value)}
                />
            </div>

            {image && (<img className='recipe-img' src={image} alt={name} /> )}
            <input type='file' accept='image/*' onChange={handleFileChange} />

            <div className='style-buttons'>
                <button onClick={handleAddSubmit}>Submit</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    );
};

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

            {image ? (
                <img className='recipe-img' src={image} alt={name} />
            ) : recipe.image ? (
                <img className='recipe-img' src={recipe.image} alt={name} />
            ) : null}
            <input type='file' accept='image/*' onChange={handleFileChange} />

            <div className='recipe_footer'>
                <button onClick={() => handleEditSubmit(recipe)}>Submit</button>
            </div>
        </div>
    );
};