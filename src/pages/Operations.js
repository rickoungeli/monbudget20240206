import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SaisieForm from '../components/commons/SaisieForm';
import { dateParser, dateParser1 } from '../utils/controllers';
import { BsTrash } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';
import { GiConfirmed } from "react-icons/gi";


const Operations = ({fonctionnalite, selectedOps, dateFrom, dateTo, trierPar}) => {
    const user = localStorage.getItem('userId')
    const [operationsList, setOperationsList] = useState([])
    const [errorMessage, setErrorMessage] = useState('') 
    const [showSaisieForm, setShowSaisieForm] = useState({}) //Permet d'afficher/fermer le formulaire de saisie
    let sortedOprationsList = []
    let totalMontant = 0
    let totalCategorie = 0
    let tableau1 = []
    let categorieLu = ""
    let categorieSauve = ""
     
    //Récupération de la liste des opérations
    useEffect(() => { 
        axios.get(`${process.env.REACT_APP_API_URL}operations.php?function=getOperations&iduser=${user}`)
        .then (res => {
            //console.log(res.data);
            if(!res.data) {
                setErrorMessage('Aucune opération trouvée')
            } else {
                setOperationsList(res.data)
                // setTimeout(()=> {
                //     console.log(operationsList.length);
                // }, 2000)    
            }
        })
        .catch(err => {
            setErrorMessage("Une erreur s'est produite" + err);
        })
    }, [])
 
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
            let newOperationsList = []
            newOperationsList = operationsList.filter((operation) => operation.id != operationItem.id)
            setOperationsList(newOperationsList)
            //toggleSaisieForm(false, '', '')
            setShowSaisieForm({value:value, operationType:'', operationItem:''})
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
                    setOperationsList(newOperationsList)
                } 
            })

            toggleSaisieForm(false, '', '')
            setOperationsList(newOperationsList)
            
        } 
        if (value==false && operationType=='' && operationItem=='') {
            setShowSaisieForm({
                value:false, 
                operationType:'', 
                operationItem:''
            })
            
        } 

        if (value==false && operationType=='addItemToStore' && operationItem !='') {
            let newOperationsList = []  
            newOperationsList = operationsList
            newOperationsList.push(operationItem)
            setOperationsList(newOperationsList)
            setShowSaisieForm({
                value:false, 
                operationType:'', 
                operationItem:''
            })
        } 
        
    
        
    }

    if(trierPar == 'date' && operationsList.length > 0) {
        sortedOprationsList = operationsList
        .filter((operation) => fonctionnalite=='previsions'? operation.isconfirmed==0 : operation.isconfirmed==1)
        .filter((operation) => operation.idtypeops.includes(selectedOps))
        .filter((operation) => operation.dateops >= dateFrom && operation.dateops <= dateTo)
        .sort((a, b) => {
            if(a.dateops > b.dateops) {
                return 1
            }
            if(a.dateops < b.dateops) {
                return -1
            }
            return 0
        })
        
    }
        
    if(trierPar == 'categorie') {
        /*
        operationsList
        .filter((operation) => fonctionnalite=='previsions'? operation.isconfirmed==0 : operation.isconfirmed==1)
        .filter((operation) => operation.idtypeops.includes(selectedOps))
        .filter((operation) => operation.dateops >= dateFrom && operation.dateops <= dateTo)
        .sort((a, b) => {
            if(a.categorie.toLowerCase() > b.categorie.toLowerCase()) {
                return 1
            }
            if(a.categorie.toLowerCase() < b.categorie.toLowerCase()) {
                return -1
            }
            return 0
        })
        // .reduce((acc, ops) => {
        //     const { id, categorie, montant } = ops
        //     if (!acc[categorie]) {
        //         acc[categorie] = []
        //     }

        //     acc[categorie].push({montant})
        //     return acc
            
        // }, {})
        .reduce((acc, current) => {
            console.log(current.categorie, ' => ', current.montant)
            categorieSauve = current.categorie
            do {
                totalCategorie += current.montant
            } while (categorieSauve == current.categorie)
            
            tableau1.push({categorie: categorieSauve, montant: totalCategorie})
            totalCategorie = 0
        }, {})
        console.log(tableau1);

        */
        
      
    }  

    
    
    return (
        <div className='page'>
            <div className="page-titre">
                <h4 className='ps-2 my-2'>{fonctionnalite == 'previsions'? 'Liste des prévisions' : 'Liste des dépenses'}</h4>
                {trierPar == 'date' && <button className="btn btn-primary m-1 fs-1 pt-0" onClick={() => toggleSaisieForm(true,'newOperation',{})}>+</button>}
            </div>
            
            <ul className='page-ul m-0' >                
                { sortedOprationsList.length == 0 || errorMessage? <div className='alert alert-danger text-center mx-3 my-2 p-1'>Aucune opération trouvée !!</div> : 
                    trierPar == 'date' ?
                    sortedOprationsList
                    .map((operation, index) => (
                        <li key={index}  className='d-flex gap-2 justify-content-between bg-success bg-opacity-25 mx-auto '>

                            <div className='ms-1' id='date'>{dateParser(operation.dateops)}</div>
                            <div className='d-flex flex-column w-50' id='operation'>
                                <span className='text-success'>{operation.categorie}</span>
                                <span className=''> {operation.libelle}</span>
                            </div>
                            <div className='d-flex align-items-start gap-1' id='montantEtBoutons'>
                                <span className='text-right text-danger'>{operation.montant} €</span>
                                <button onClick={()=>toggleSaisieForm(true, 'editOperation', operation)} className="btn col-1 py-0"><BsPencil /></button>
                                <button onClick={()=>fonctionnalite=='previsions' && toggleSaisieForm(true, 'deletePrevision', operation)} className="btn"><BsTrash /></button>
                                <button onClick={()=>fonctionnalite=='previsions' && toggleSaisieForm(true, 'confirmPrevision', operation)} className="btn"><GiConfirmed  /></button>
                            </div>
                            <div className="d-none">{ calculSomme(operation.montant) }</div>
                        </li>
                    )) : 
                    tableau1
                    .map((operation, index) => (
                        <li key={index} className ='d-flex justify-content-between p-2 bg-success bg-opacity-25 mx-auto px-3'>
                            <div className ='ms-1 bg-success  bg-opacity-10'>{operation.categorie}</div>
                            <div className ='ms-1 bg-success  bg-opacity-10'>{operation.montant.toFixed(2)}</div>
                        </li>
                    ))    
                    } 
                
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

export default Operations;