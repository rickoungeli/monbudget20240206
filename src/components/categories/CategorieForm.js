import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
//import { useSelector, useDispatch } from "react-redux";
//Import from features
//import { loadCategories, selectShowCategoriesForm, showCategoriesForm } from '../../features/categoriesReducer';
//Import from react-icons
import { AiFillExclamationCircle } from 'react-icons/ai';


const CategorieForm = ({ show, onClose }) => {
    if (!show) return null; //si show est false, ne rien afficher
    //const dispatch = useDispatch();
    const user = localStorage.getItem('userId')
    const operationsType = JSON.parse(localStorage.getItem('typeOperations')); //Liste des opérations
    const [selectedOperation, setSelectedOperation] = useState('D')
    const [libelle, setLibelle] = useState('')
    const [alert, setAlert] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    
    const handleSubmit = (e) => {
        e.preventDefault()
    
        const data = new FormData()
        data.append('function', 'insertCategorie')
        data.append('userId', user) 
        data.append('libelle', libelle)
        data.append('typeOps', selectedOperation)

        axios.post(`${process.env.REACT_APP_API_URL}categories.php`, data)
        .then(res => {
            if(res.data=='') {
               setAlert("Echec : l'opération n'a pas réussi")
            } else {
                if(res.data==='Categorie enregistrée !' || res.data==='La modification est enregistrée avec succèss'){
                    setAlert(res.data)
                    //dispatch(loadCategories(true))
                }
                setAlert(res.data)
            }
        })
        .catch(err => setAlert("L'opération a echoué "+ err)) 
        console.log({
         'libelle :' : libelle,
         'idTypeOps :' : selectedOperation
        })   
        
            
    }

    return (
        <div className="modal fade show" style={{ display: 'block'}}>
            <div className="modal-dialog">
                <div className="modal-content bg-dark text-light">
                    <div className="modal-header">
                        <h5 className="modal-title">Saisie d'une categorie</h5>
                    </div>
                    <div className="modal-body bg-dark ">
                        {alert && <p className='alert alert-danger p-1'>{alert}</p> }
                        <form onSubmit={(e) => handleSubmit(e)} className="row no-gutters m-3 px-2 py-1 mb-0 scroller">
                            {/* Choix opération */}
                            <div className='groupe-type-operation text-white mb-3'>
                                <p className='mb-0'>Types d'opérations :</p>
                                <div className='d-flex gap-5'>                                
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
                            
                            {/* Libellé catégorie */}
                            <div className="form-group d-flex flex-column mb-0">
                                <label htmlFor="libelle" className='text-white me-2'>Libellé :</label>
                                <input 
                                    type="text" 
                                    id='libelle'
                                    name = 'libelle' 
                                    onChange={(e)=> setLibelle(e.target.value)}
                                    className={errorMessage? "form-control border border-2 border-danger" : "form-control"}/>
                            </div>
                            {errorMessage && <p className='text-danger'>{errorMessage}</p>}
                            
                            <input 
                                type="hidden" 
                                id='userId'
                                value={user.id}
                                name = 'userId' 
                            />
                            {/*
                            <div className="col-12 text-center mb-3 " id="form-group3">
                                <button className="btn btn-primary" >Enregistrer</button>
                            </div>
                            */}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" class="btn btn-secondary" onClick={onClose}>Annuler</button>
                        <button type="button" class="btn btn-primary" onClick={handleSubmit}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CategorieForm;