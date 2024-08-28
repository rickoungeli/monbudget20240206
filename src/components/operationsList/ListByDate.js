import React, { useState, useEffect } from 'react';
import SaisieForm from '../commons/SaisieForm';
import { dateParser, dateParser1 } from '../../utils/controllers';
import { BsTrash } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';


import { selectSelectedOps, selectDateFrom, selectDateTo } from "../../features/operationsReducer";
import { SHOW_SAISIE_FORM, OPERATIONS_LIST } from '../../features/operationsReducer';
import { DELETED_ID, selectDeletedId, selectFonctionnality } from '../../features/homeReducer';

//Importation des components
//import DatesAndOperationsForm from '../components/commons/DatesAndOperationsForm';    


const ListByDate = ({fonctionnalite, operationsList, selectedOps, dateFrom, dateTo}) => {
    
    const [errorMessage, setErrorMessage] = useState('') 
    const [showSaisieForm, setShowSaisieForm] = useState('')
    let totalMontant = 0
    
    
    const calculSomme = (montant) => {
        totalMontant += parseFloat(montant)
    }

    //Fonction pour afficher/fermer le formulaire de saisie/édition d'une opération
    const toggleSaisieForm = (value, operationType, operationItem) => {
        if (value==true) { 
            setShowSaisieForm({
                value:value, 
                operationType:operationType, 
                operationItem:operationItem
            })
        }

        if (value==false && operationType=="deleteItemFromStore") { 
            //On supprime l'élément dans le store du parent
            handleRemoveItemFromStore(operationItem.id)
        } 

        if (value==false && operationType=="editItemFromStore") { 
            //On modifie l'élément dans le store du parent
            //console.log(operationItem);
            let newOperationsList = []  
            
            operationsList.forEach((operation) => {
                if(operation.id !== operationItem.id){
                    newOperationsList.push(operation)
                } else {
                    let operationItem1 = {...operationItem, isconfirmed:operation.isconfirmed}                
                    newOperationsList.push(operationItem1)
                } 
            })

            setOperationsList(newOperationsList)
            setShowSaisieForm({
                value:value, 
                operationType:'', 
                operationItem:''
            })
            
        } 
        if (value==false && operationType=='' && operationItem=='') {
            setShowSaisieForm({
                ...showSaisieForm,
                value:false 
            })
            
        } 
        
    
        
    }
                
                
       
    return (
        <div className='page'>
            <div className="page-titre">
                <h4 className='ps-2 my-2'>{fonctionnalite == 'previsions'? 'Liste des prévisions' : 'Liste des dépenses'}</h4>
                <button className="btn btn-primary m-1 fs-1 pt-0" onClick={() => toggleSaisieForm(true,'newOperation',{})}>+</button>
            </div>
            
            <ul className='page-ul m-0' >                
                {errorMessage? <div className='alert alert-danger text-center mx-3 my-2 p-1'>{errorMessage}</div> : 
                
                operationsList
                .filter((operation) => fonctionnalite=='previsions'? operation.isconfirmed==0 : operation.isconfirmed==1)
                .filter((operation) => operation.idtypeops.includes(selectedOps))
                .filter((operation) => operation.dateops >= dateFrom && operation.dateops <= dateTo)
                .map((operation, index) => 
                    
                    (
                        
                        <li key={index}  className='d-flex gap-2 justify-content-between bg-success bg-opacity-25 mx-auto '>

                            <div className='ms-1'>{dateParser(operation.dateops)}</div>
                            <div className='d-flex flex-column w-50'>
                                <span className='text-success'>{operation.categorie}</span>
                                <span className=''> {operation.libelle}</span>
                            </div>
                            <div className='d-flex align-items-start'>
                                <span className='text-right text-danger'>{operation.montant} €</span>
                                <button onClick={()=>toggleSaisieForm(true, 'editOperation', operation)} className="btn col-1 py-0"><BsPencil /></button>
                                <button onClick={()=>fonctionnalite=='previsions' && toggleSaisieForm(true, 'deletePrevision', operation)} className="btn "><BsTrash /></button>
                            </div>
                            <div className="d-none">{ calculSomme(operation.montant) }</div>
                        </li>
                    )
                    
                )} 
                <div className='total-line'>
                    <span className='col-3'></span>
                    <span className='col-4'>Total</span>
                    <span className='col-3'>{parseFloat(totalMontant).toFixed(2)} €</span>
                    <span className='col-2'></span>
                </div>
            </ul>
            
            
            {showSaisieForm.value && 
                <SaisieForm 
                    fonctionnalite={fonctionnalite} 
                    toggleSaisieForm={toggleSaisieForm} 
                    showSaisieForm={showSaisieForm}
            /> }
        </div>
        
    );
};

export default ListByDate;