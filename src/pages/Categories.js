import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
//import { useForm } from "react-hook-form"; //Cette librairie permet de gérer les formulaires avec react
import { loadCategories, showCategoriesForm, selectLoadCategories, selectShowCategoriesForm } from '../features/categoriesReducer';
import CategorieForm from '../components/categories/CategorieForm';
import PencilIcon from '../images/pencil.svg';

const Categories = () => {
    //const dispatch = useDispatch();
    const user = localStorage.getItem('userId')
    const [categories, setCategories] = useState(JSON.parse(localStorage.getItem('categories')) )
    const operationsType = JSON.parse(localStorage.getItem('typeOperations')); //Liste des opérations
    const [selectedOperation, setSelectedOperation] = useState('D')
    const [showModal, setShowModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    //let loadCategoriesTrue = useSelector(selectLoadCategories)
    //const saisieCategories = useSelector(selectShowCategoriesForm)

    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const rafreshList = (datas) => {
        setCategories(datas);
    }
    const handleEditCategorie = (id) => {

    }

    const handleDeleteCategorie = (id) => {

    }
    
    return (
        <div>
            
            <div className="d-flex justify-content-between ps-2">
                <h4 className='text-center my-2'>LISTE DES CATEGORIES</h4>
            </div>
            <CategorieForm show={showModal} onClose={handleClose} rafreshList={rafreshList}/>

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
                <div className="btn btn-primary m-0 fs-1 py-0 px-3" onClick={handleOpen}>+</div>
 
            </form>


            {/* LISTE DES CATEGORIES */}
            <table className='table table-striped table-bordered col-12 col-md-10 col-lg-8 mx-auto'>   
                <tbody>         
                {categories
                .filter((categorie) => categorie.typeOps.includes(selectedOperation))
                .map((categorie, index) => (
                    <tr key={index}  className=''>
                        <td className='col-1'>{index+1}</td>
                        <td className='col-5'>{categorie.libelle}</td>
                        <td><button onClick={handleEditCategorie(categorie.id)} className='col-3 btn btn-primary'>
                                <i className="fa-solid fa-pencil text-light"></i>
                            </button>
                        </td>
                        <td><button onClick={handleDeleteCategorie(categorie.id)} className='col-2 btn btn-danger '>Supprimer</button></td>
                    </tr>
                )) }   
                </tbody>    
            </table>
        </div>
    );
};

export default Categories;