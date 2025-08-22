import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { checkLibelle } from '../../utils/controllers';
//Import from react-icons
import { AiFillExclamationCircle } from 'react-icons/ai';


const CategorieForm = ({ category, fonctionnality, show, onClose, rafreshList }) => {
    if (!show) return null; //si show est false, ne rien afficher

    const user = localStorage.getItem('userId')
    const operationsType = JSON.parse(localStorage.getItem('typeOperations')); //Liste des opérations
    const [selectedOperation, setSelectedOperation] = useState(fonctionnality == 'createCategorie'? 'D' : category.typeOps)
    const [libelle, setLibelle] = useState(fonctionnality=='createCategorie'? '' : category.libelle)
    const [alert, setAlert] = useState('');
    const [errors, setErrors] = useState({});
    

    const data = new FormData()
    fonctionnality == 'createCategorie' && data.append('function', 'insertCategorie')
    fonctionnality == 'editCategorie' && data.append('function', 'updateCategorie')
    fonctionnality == 'deleteCategorie' && data.append('function', 'deleteCategorie')
    fonctionnality != 'createCategorie' && data.append('idcategorie', category.id)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({});
        setAlert('');

        //Vérification des champs
        let newErrors = {};
        checkLibelle(libelle) ? newErrors.libelle = checkLibelle(libelle) : null;

        //Si erreurs -> on arrête
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            console.log(errors);
            return;
        }

        //Si valide, on envoie les données
        data.append('userId', user) 
        data.append('libelle', libelle)
        data.append('idtypeOps', selectedOperation)
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}categories.php`, data)
            console.log(res.data);
            if(res.data=='') {
               setAlert("Echec : l'opération n'a pas réussi")
            } else {
                if(fonctionnality == 'createCategorie'){
                    setAlert("Votre saisie est entregistrée avec succès")
                    categories = [...categories, {
                        id: res.data.id,
                        libelle: libelle,
                        userId: user,
                        typeOps: selectedOperation
                    }] 
                    setLibelle('');
                    localStorage.setItem('categories', JSON.stringify(categories));
                    rafreshList(categories);
                }

                if(fonctionnality == 'editCategorie'){ 
                    //c'est une modification
                    //On ferme le formulaire et on modifie l'item dans le store du parent
                    setAlert('Opération modifiée avec succès')
                    setTimeout(()=> {
                        setAlert('');
                        rafreshList(categories);
                    }, 2000)   
                }

                if(fonctionnality == 'deleteCategorie'){ 
                    //c'est une modification
                    //On ferme le formulaire et on modifie l'item dans le store du parent
                    setAlert('Suppression effectuée avec succès')
                    setTimeout(()=> {
                        setAlert('');
                        rafreshList({'id':category.id});
                    }, 2000)   
                }
            }
        
        } catch(err) {
            //setAlert("L'opération a echoué "+ err)
            setErrors({ global : "L'opération a echoué" + err })
        }  
        
            
    }

    return (
        <div className="modal fade show" style={{ display: 'block'}}>
            <div className="modal-dialog">
                <div className="modal-content bg-dark text-light">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {fonctionnality == 'createCategorie' && "Saisie d'une categorie"}
                            {fonctionnality == 'editCategorie' && "Modification d'une categorie"}
                            {fonctionnality == 'deleteCategorie' && "Suppression d'une categorie"}

                        </h5>
                    </div>
                    <div className="modal-body bg-dark ">
                        {alert && <p className={alert[0]=='V'?'alert alert-success p-1 text-center': 'alert alert-danger p-1 text-center'}>{alert}</p> }
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
                                            defaultChecked = {typeOps.id == selectedOperation && 'checked' }
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
                                    value={libelle}
                                    onChange={(e)=> setLibelle(e.target.value)}
                                    className={errors.Libelle? "form-control border border-2 border-danger" : "form-control"}/>
                            </div>
                            {errors.Libelle && <p className='text-danger'>{errorMessage}</p>}
                            
                            <input 
                                type="hidden" 
                                id='userId'
                                value={user.id}
                                name = 'userId' 
                            />
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={onClose}>Annuler</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            {fonctionnality == 'createCategorie' && "Enregistrer"}
                            {fonctionnality == 'editCategorie' && "Modifier"}
                            {fonctionnality == 'deleteCategorie' && "Supprimer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CategorieForm;