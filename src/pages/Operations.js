import { useState, useEffect } from 'react';
import axios from 'axios';
import SaisieForm from '../components/commons/SaisieForm';
import { dateParser, dateParser1 } from '../utils/controllers';
import { BsTrash } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';
import { GiConfirmed } from "react-icons/gi";


const Operations = ({selectedOps, dateFrom, dateTo, trierPar}) => {
    const user = localStorage.getItem('userId');
    const page = localStorage.getItem('page');
    const [operationsList, setOperationsList] = useState([]);
    const [Alert, setAlert] = useState('') ;
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [showModal, setShowModal] = useState(false) //Permet d'afficher/fermer le formulaire de saisie
    const [actions, setActions] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    
    let sortedList = []
    let totalMontant = 0
    let totalCategorie = 0
    let tableau1 = []
    let categorieLu = ""
    let categorieSauve = ""
     
    //Récupération de la liste des opérations
    useEffect(() => { 
        axios.get(`${process.env.REACT_APP_API_URL}operations.php?function=getOperations&iduser=${user}`)
        .then (res => {
            setOperationsList(res.data)
            setLoading(false)
        })
        .catch(err => {
            setError("Une erreur s'est produite" + err);
            setLoading(false)
        })
    }, [])



    const calculSomme = (montant) => {
        totalMontant += parseFloat(montant)
    }

    const handleClose = () => setShowModal(false);

    //Fonction pour mettre le state à jour et raffraichir l'écran
    const rafreshList = (datas) => {
        actions != 'create' && setShowModal(false);
        if(actions == 'delete') {
            //On supprime cette operation dans le state
            setOperationsList(operationsList.filter((ops) => ops.id !== datas.id))
        }
        if (actions == 'edit') { 
            //On modifie l'élément dans le store du parent
            setOperationsList((prevList) => 
                prevList.map((ops) => 
                ops.id == datas.id ? datas : ops )
            )        
        } 

        if (actions == 'create') {
            //on ajoute le nouveau produit dans le state
            setOperationsList((prevList) => [...prevList, datas])
            datas.checkbox=='false' && setShowModal(false)
        }
    }

   //Fonction pour ouvrir la modale modification, suppression et confirmation
    const handleOpenModale = (ops, action) => {
        setActions(action)
        action == 'create' ? setSelectedOperation(null) : setSelectedOperation(ops)
        // if (page == 'operations') {
        //     action == 'create' && setFonctionnalite('createOperation') 
        //     action == 'edit' && setFonctionnalite('editOperation') 
        //     action = 'confirm' && setFonctionnalite('deleteOperation') 
        // }
        // if (page == 'previsions') {
        //     action == 'create' && setFonctionnalite('createPrevison') 
        //     action == 'edit' && setFonctionnalite('editPrevision') 
        //     action == 'delete' && setFonctionnalite('deletePrevision') 
        //     action = 'confirm' && setFonctionnalite('deletePrevision') 
        // }
        setShowModal(true);        
    }
 
    if(trierPar == 'date' && operationsList.length > 0) {
        sortedList = operationsList
        .filter((operation) => page=='previsions'? operation.isconfirmed==0 : operation.isconfirmed==1)
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
                <h4 className='ps-2 my-2'>{page == 'previsions'? 'Liste des prévisions' : 'Liste des dépenses'}</h4>
                {trierPar == 'date' && <button className="btn btn-primary m-1 fs-1 pt-0" onClick={() => handleOpenModale('', 'create')}>+</button>}
            </div>
            { loading && <div className='alert alert-success text-center mx-3 my-5 p-1 text-danger'>Chargement...</div>}   
            { error && <div className='alert alert-danger text-center mx-3 my-5 p-1 text-danger'>{error}</div>}   
            
            <ul className='page-ul m-0' >  
                { sortedList.length == 0 ? <div className='alert alert-danger text-center mx-3 my-2 p-1'>Aucune opération trouvée !!</div> : 
                        
                    //trierPar == 'date' ?
                    sortedList
                    .map((ops, index) => (
                        <li key={index}  className='d-flex gap-2 justify-content-between bg-success bg-opacity-25 mx-auto '>

                            <div className='ms-1' id='date'>{dateParser(ops.dateops)}</div>
                            <div className='d-flex flex-column w-50' id='operation'>
                                <span className='text-success'>{ops.categorie}</span>
                                <span className=''> {ops.libelle}</span>
                            </div>
                            <div className='d-flex align-items-start gap-1' id='montantEtBoutons'>
                                <span className='text-right text-danger'>{ops.montant} €</span>
                                <button onClick={()=>handleOpenModale(ops, 'edit')} className="btn col-1 py-0"><BsPencil /></button>
                                <button onClick={()=>handleOpenModale(ops, 'delete')} className="btn"><BsTrash /></button>
                                <button onClick={()=>handleOpenModale(ops, 'confirm')} className="btn"><GiConfirmed  /></button>
                            </div>
                            <div className="d-none">{ calculSomme(ops.montant) }</div>
                        </li>
                    )) 
                    // tableau1
                    // .map((operation, index) => (
                    //     <li key={index} className ='d-flex justify-content-between p-2 bg-success bg-opacity-25 mx-auto px-3'>
                    //         <div className ='ms-1 bg-success  bg-opacity-10'>{operation.categorie}</div>
                    //         <div className ='ms-1 bg-success  bg-opacity-10'>{operation.montant.toFixed(2)}</div>
                    //     </li>
                    // ))    
                }
                
                <div className='total-line'>
                    <span className='col-3'></span>
                    <span className='col-4'>Total</span>
                    <span className='col-3'>{parseFloat(totalMontant).toFixed(2)} €</span>
                    <span className='col-2'></span>
                </div>
            </ul>
            
            <SaisieForm 
                ops = {selectedOperation}
                onClose = {handleClose}
                rafreshList={rafreshList}
                show = {showModal}
                action = {actions}
            /> 
        </div>
        
    );
};

export default Operations;