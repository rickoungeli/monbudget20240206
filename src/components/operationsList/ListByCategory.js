import React, { useState, useEffect } from 'react';
import SaisieForm from '../commons/SaisieForm';
import { dateParser, dateParser1 } from '../../utils/controllers';
import { BsTrash } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';

const ListByCategory = ({fonctionnalite, operationsList, selectedOps, dateFrom, dateTo, loadOperations}) => {
    
    const [errorMessage, setErrorMessage] = useState('') 
    const [showSaisieForm, setShowSaisieForm] = useState(false)
    let totalMontant = 0
    let totalCategorie = 0
    let zCategorie = ''
    let newTableau = []
    
    //useEffect(()=>{
        document.querySelector('.page-ul').innerHTML+=''
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
        .forEach((operation, index) => {
            let element = {}
            zCategorie = operation.categorie
            if(zCategorie == operation.categorie){
                totalCategorie = (totalCategorie + parseFloat(operation.montant))
                element = {
                    idcategorie: operation.idcategorie,
                    categorie: operation.categorie,
                    totalCategorie: totalCategorie
                }
                
                newTableau.push(element)
            } else {
                
                
                
                //zCategorie = operation.categorie
                //totalCategorie = 0 
            }

        })
        console.log(newTableau);
            
            // console.log(operationsList)
            /* <div className='total-line'>
                <span className='col-3'></span>
                <span className='col-4'>Total</span>
                <span className='col-3'>{parseFloat(totalMontant).toFixed(2)} €</span>
                <span className='col-2'></span>
            </div> */
    //},[loadOperations])
    //errorMessage? <div className='alert alert-danger text-center mx-3 my-2 p-1'>{errorMessage}</div> : 


  return (
    <div className='page'>
        <div className="page-titre">
            <h4 className='ps-2 my-2'>{fonctionnalite == 'previsions'? 'Liste des prévisions ' : 'Liste des dépenses '}par catégorie</h4>
            
        </div>

        <ul className='page-ul d-flex flex-column gap-2 m-0' >                
            {newTableau
            .map((operation, index) => (
                <li  key={index} class='d-flex justify-content-between p-2 bg-danger bg-opacity-25 mx-auto p-1'>
                    <div class ='ms-1 bg-success  bg-opacity-10'>{operation.idcategorie}</div>
                    <div class ='ms-1 bg-success  bg-opacity-10'>{operation.categorie}</div>
                    <div class ='ms-1 bg-success  bg-opacity-10'>{totalCategorie}</div>
                </li>
            ))}
        </ul>

    </div>
  )
}

export default ListByCategory 
