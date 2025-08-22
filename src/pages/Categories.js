import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategorieForm from '../components/categories/CategorieForm';
import PencilIcon from '../images/pencil.svg';

const Categories = () => {
    const user = localStorage.getItem('userId')
    const [categories, setCategories] = useState(JSON.parse(localStorage.getItem('categories')) );
    const operationsType = JSON.parse(localStorage.getItem('typeOperations')); //Liste des opérations
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedOperation, setSelectedOperation] = useState('D')
    const [fonctionnality, setFonctionnality] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const rafreshList = (datas) => {
        setShowModal(false);
        
        
        if(fonctionnality == 'deleteCategorie') {
            //On supprime ce produit dans le state
            setCategories(categories.filter((cat) => cat.id !== datas.id));
            localStorage.setItem('categories', JSON.stringify(categories))
        }
        //setCategories(datas);
    }

    //Fonction pour ouvrir la modale de création
    const handleCreateCategory = ({}) => {
        setSelectedCategory(null)
        setFonctionnality('createCategorie')
        setShowModal(true);        
    }

    //Fonction pour ouvrir la modale de modification
    const handleEditCategory = (category) => {
        setSelectedCategory(category)
        setFonctionnality('editCategorie')
        setShowModal(true);        
    }

    const handleDeleteCategory = (category) => {
        setSelectedCategory(category)
        setFonctionnality('deleteCategorie')
        setShowModal(true); 
    }

    
    
    return (
        <div>
             
            <div className="d-flex justify-content-between ps-2">
                <h4 className='text-center my-2'>LISTE DES CATEGORIES</h4>
            </div>
            {/*<CategorieForm show={showModal} onClose={handleClose} rafreshList={rafreshList}/>*/}

            <CategorieForm 
                category={selectedCategory} 
                fonctionnality = {fonctionnality}
                onClose = {handleClose}
                rafreshList={rafreshList}
                show = {showModal}
            />

            {/* Choix opération */}
            <form className='d-flex col-12 col-md-10 col-lg-8 bg-success text-light p-1 '>
                <div className="col-10">
                    <p className='col mb-0'>Types d'opérations :</p>
                    <div className="d-flex gap-5">
                        {operationsType.map((typeOps) => (
                            <label htmlFor={typeOps.id} key={typeOps.id} className='form-check-label'>
                                <input 
                                    type="radio" 
                                    id={typeOps.id} 
                                    name='selectedtypeOperation'
                                    value={typeOps.id} 
                                    className='form-check-input' 
                                    defaultChecked = {(typeOps.id == 'D') && 'checked'}
                                    onChange={(e)=> setSelectedOperation(e.target.value)}
                                />
                                {typeOps.libelle}
                            </label> 
                        ))}  
                    </div>
                </div>
                <div className="btn btn-primary m-0 fs-1 py-0 px-3" onClick={handleCreateCategory}>+</div>
 
            </form>


            {/* LISTE DES CATEGORIES */}
            <table className='table table-striped table-bordered col-12 col-md-10 col-lg-8 mx-auto'>   
                <tbody>         
                {categories
                .filter((cat) => cat.typeOps.includes(selectedOperation))
                .map((cat, index) => (
                    <tr key={index}  className=''>
                        <td className='col-1'>{index+1}</td>
                        <td className='col-5'>{cat.libelle}</td>
                        <td><button onClick={() => handleEditCategory(cat)} className='col-3 btn btn-primary'>
                                <i className="fa-solid fa-pencil text-light"></i>
                            </button>
                        </td>
                        <td><button onClick={() => handleDeleteCategory(cat)} className='col-2 btn btn-danger '>Supprimer</button></td>
                    </tr>
                )) }   
                </tbody>    
            </table>


        </div>
    );
};

export default Categories;