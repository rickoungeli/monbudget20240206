import React, { useState, useEffect } from 'react';
import axios from 'axios';


//Import from react-icons
import { AiFillExclamationCircle } from 'react-icons/ai';
import { useCheckLibelle } from '../../utils/controllers';
import { InputText } from '../formComponents/InputText';


const SaisieForm = ({showSaisieForm, toggleSaisieForm, fonctionnalite}) => {
    const user = localStorage.getItem('userId')
    const operations = JSON.parse(localStorage.getItem('typeOperations'));
    const categories = JSON.parse(localStorage.getItem('categories'));

    
    const todaysdate = (new Date().toLocaleDateString()).split('/');
    const todays = todaysdate[2]+'-'+todaysdate[1]+'-'+todaysdate[0];
    const [libelle, setLibelle] = useState('')
    const [dateOps, setDateOps] = useState(todays)
    const [idTypeOps, setIdTypeOps] = useState('D');
    const [idCategorie, setIdCategorie] = useState(categories[0].id);
    const [libCat, setLibCat] = useState('')
    const [montant, setMontant] = useState('')
    const [jourDuMois, setJourDuMois] = useState('')
    const [nombreDeRepetition, setNombreDeRepetition] = useState('')
    const [checkbox, setCheckbox] = useState(false)
    const [alert, setAlert] = useState('')
    const [libelleMessage, setLibelleMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [dateOpsMessage, setDateOpsMessage] = useState('')
    const [montantMessage, setMontantMessage] = useState('')
    const [jourDuMoisMessage, setJourDuMoisMessage] = useState('')
    const [nombreDeRepetitionMessage, setNombreDeRepetitionMessage] = useState('')
    
    const data = new FormData()
    data.append('iduser', user)
    data.append('fonctionnalite', fonctionnalite)

    const arrayCompare = (arrayA, arrayB) => {
        for (let i = 0; i < arrayA.length; i++) {
            if (arrayA[i] !== arrayB[i]) {
                return false;
            }
        }
    };

    const checkLibelle = (libelle) => {
        if (!libelle) {
            setLibelleMessage("Le libelle est obligatoire");
            return true;
        } else if (libelle.length < 2 || libelle.length > 100) {
            setLibelleMessage("Veuillez taper un libelle valide svp");
            return true;
        } else {
            setLibelleMessage("");
            return false;
        }
    };  
    
    const checkDateOps = (dateOps) => {
        if (!dateOps) {
            setDateOpsMessage("La date est obligatoire");
            return true;
        } else {
            setDateOpsMessage("");
            return false;
        }
    };
    
    const checkMontant = (montant) => {
        if (montant=="") {
            setMontantMessage("Le montant est obligatoire");
            return true;
        } else if (montant <= 0) {
            setMontantMessage("Le montant doit être supérieur à zéro");
            return true;
        } else {
            setMontantMessage("");
            return false;
        }
    };

    const checkNombreDeRepetition = (value) => {
        setNombreDeRepetition(value)
        if(checkbox == true){ 
            if (value == '' || value <=1 || value > 25 || isNaN(value)) {
                setNombreDeRepetitionMessage('Veuillez saisir un nombre compris entre 2 et 25')
                return false
            } else {
                setNombreDeRepetitionMessage('')
                return true
            }
        } else {
            setNombreDeRepetitionMessage('')
            return true
        }
    }

    //Fonction pour tester la zone jourDuMois
    const checkJourDuMois = (value) => {
        setJourDuMois(value)
        if(checkbox == true){ 
            if (value == '' || value <1 || value > 31 || isNaN(value)) {
                setJourDuMoisMessage('Veuillez saisir un nombre compris entre 1 et 31')
                return false
            } else {
                setJourDuMoisMessage('')
                return true
            }
        } else {
            setJourDuMoisMessage('')
            return true
        }
    }
    
    useEffect(() => { 
        if (showSaisieForm.operationType=='editOperation' || showSaisieForm.operationType=='deletePrevision' || showSaisieForm.operationType=='confirmPrevision') {
            setIdCategorie(showSaisieForm.operationItem.idcategorie)
            setIdTypeOps(showSaisieForm.operationItem.idtypeops)
            setLibelle(showSaisieForm.operationItem.libelle)
            setDateOps(showSaisieForm.operationItem.dateops)
            setMontant(showSaisieForm.operationItem.montant)
        }
    }, [])

    
    //Fonction pour transformer une prévision en une opération effectuée
    const handleTransformPrevision = () => {
        const checkLibelle1 = checkLibelle(libelle)
        const checkDateOps1 = checkDateOps(dateOps)
        const checkMontant1 = checkMontant(montant)

        const checkResultArray=[checkLibelle1, checkDateOps1, checkMontant1]

        if ( arrayCompare(checkResultArray, [false, false, false]) !== false) {
            
            data.append('function', 'transformPrevision')
            data.append('idoperation', showSaisieForm.operationItem.id)
            data.append('libelle', libelle)
            data.append('dateops', dateOps)
            data.append('idtypeops', idTypeOps)
            data.append('idcategorie', idCategorie)
            data.append('montant', montant)
            //for (let [key, value] of data.entries()){console.log(key, value);}
            axios.post(`${process.env.REACT_APP_API_URL}operations.php`, data)
            .then(res => {
                if(res.data.status == 400){ 
                    setAlert('Prévision transformée avec succès')
                    //On supprime la prévision dans le store
                    setTimeout(()=> {
                        toggleSaisieForm(false, 'deleteItemFromStore', showSaisieForm.operationItem)
                    }, 2000)             
                }
            })
            .catch(err => {
                setAlert("L'opération a echoué ")
                // setTimeout(()=> {
                //     setAlert("")
                // }, 3000) 
            })
            
        }
    }

    //Fonction pour supprimer une opération de la bdd
    const handleDelete = () => {
        const operationId = showSaisieForm.operationItem.id
        data.append('function', 'deletePrevision')
        data.append('idoperation', operationId)
        axios.post(`${process.env.REACT_APP_API_URL}operations.php`, data)
        .then(res => {
            console.log(res)
            
            if(res.data.status == 300){ 
                setAlert('Opération supprimée avec succès')
               //On ferme le formulaire et on supprime l'item dans le store du parent
               setTimeout(()=> {
                    toggleSaisieForm(false, 'deleteItemFromStore', showSaisieForm.operationItem)
                }, 2000)     
           }
                
        })
        .catch(err => setAlert("L'opération a echoué "+ err))
    }
    
    //Fonction pour créer ou modifier une opération dans la bdd
    const handleSubmit = (e) => {
        e.preventDefault()
        const checkLibelle1 = checkLibelle(libelle)
        const checkDateOps1 = checkDateOps(dateOps)
        const checkMontant1 = checkMontant(montant)
        const checkJourDuMois1 = checkJourDuMois(jourDuMois)
        const checkNombreDeRepetition1 = checkNombreDeRepetition(nombreDeRepetition)
        
        //const checkResultArray=[checkLibelle1, checkDateOps1, checkMontant1, checkJourDuMois1, checkNombreDeRepetition1]
        let checkResultArray = []
        if(checkbox) {
            checkResultArray=[checkLibelle1, checkDateOps1, checkMontant1, checkJourDuMois1, checkNombreDeRepetition1]
        } else {
            checkResultArray=[checkLibelle1, checkDateOps1, checkMontant1, false, false]
        }
        
        if ( arrayCompare(checkResultArray, [false, false, false, false, false]) !== false) {
            showSaisieForm.operationType=='editOperation'? data.append('idoperation', showSaisieForm.operationItem.id):null
            data.append('libelle', libelle)
            data.append('montant', montant)
            data.append('dateops', dateOps)
            data.append('idtypeops', idTypeOps)
            data.append('idcategorie', idCategorie)
            data.append('jourDuMois', jourDuMois)
            data.append('nombreDeRepetition', nombreDeRepetition)
            showSaisieForm.operationType == 'newOperation' && !checkbox && data.append('function', 'insertOperation')
            showSaisieForm.operationType == 'newOperation' &&checkbox && data.append('function', 'insertRecursivOperation')
            showSaisieForm.operationType == 'editOperation' && data.append('function', 'editOperation')
            
            //for (let [key, value] of data.entries()){console.log(key, value);}
            axios.post(`${process.env.REACT_APP_API_URL}operations.php`, data)
            .then(res => {
                //console.log(res);
                if(res.data=='') {
                    setAlert("Echec : l'opération n'a pas réussi")
                } else {
                    let selectElement = document.querySelector('#categorie')
                    let selectedIndex = selectElement.selectedIndex
                    let selectedOption = selectElement.options[selectedIndex]
                    if(res.data.status == 201){ 
                        //c'est une création, on ajoute l'élément dans le store du parent
                        setAlert('Opération enregistrée avec succès')
                        setTimeout(()=> {
                            toggleSaisieForm(false, 'addItemToStore', {
                                id: res.data.id,
                                categorie: selectedOption.innerText,
                                libelle: libelle,
                                montant: montant,
                                dateops: dateOps,
                                idtypeops: idTypeOps,
                                idcategorie: idCategorie,
                                isconfirmed: 0
                            })
                            setAlert('')
                        }, 2000)  
                    }    
                        
                    if(res.data.status == 200){ 
                        //c'est une modification
                        //On ferme le formulaire et on modifie l'item dans le store du parent
                        setAlert('Opération modifiée avec succès')
                        setTimeout(()=> {
                            toggleSaisieForm(false, 'editItemFromStore', {
                                id:showSaisieForm.operationItem.id,
                                categorie: selectedOption.innerText,
                                libelle:libelle,
                                dateops:dateOps,
                                idcategorie:idCategorie,
                                idtypeops:idTypeOps,
                                montant:montant
                            }) 
                        }, 2000)                
                    }   
                }
            })
            .catch(err => setAlert("L'opération a echoué "+ err))
        }
    }



    return (
        <div className="saisie-form overlay">
            <div className="modal-dialog bg-dark w-100 mx-auto">
                <div className="modal-content">
                    <div className="modal-header bg-light p-1">
                        <div>
                            <h5 className="modal-title text-center text-dark">
                                {showSaisieForm.operationType == 'newOperation' && fonctionnalite=='previsions'&& "Saisie d'une prévision"} 
                                {showSaisieForm.operationType == 'newOperation' && fonctionnalite=='depenses' && "Saisie d'une opération effectuée"} 
                                {showSaisieForm.operationType == 'editOperation' && fonctionnalite=='previsions' && "Modification d'une prévision" }
                                {showSaisieForm.operationType == 'editOperation' && fonctionnalite=='depenses' && "Modification d'une opération" }
                                {showSaisieForm.operationType == 'deletePrevision' && "Voulez-vous supprimer cette prévision ?"}
                                {showSaisieForm.operationType == 'confirmPrevision' && "Cette prévision a été réalisée ?" }
                                
                            </h5>
                            {showSaisieForm.operationType == 'deletePrevision' ? <small className='d-block text-center mb-1 fs-6'>(si vous cliquez sur oui, la prévision sera supprimée)</small> : null}
                            {showSaisieForm.operationType == 'confirmPrevision' ? <small className='d-block text-center mb-1 fs-6'>(si vous cliquez sur oui, cette prévision va être enregistrée comme une opération effectuée)</small> : null}

                        </div>
                        
                    </div>
                    <div className="modal-body">
            
                        <form onSubmit={(e) => handleSubmit(e)} className="row no-gutters m-3 px-2 py-1 mb-0 scroller">
                            {/* Choix opération */}
                            <div className='groupe-type-operation d-flex text-white mb-3'>
                                <p className='mb-0'>Types d'opérations :</p>
                                { operations.map((operation) => (
                                    <label htmlFor={operation.id} key={operation.id} className='form-check-label'>
                                        <input 
                                            type="radio" 
                                            value={operation.id} 
                                            id={operation.id} 
                                            className='form-check-input ms-3' 
                                            name = 'idTypeOps'
                                            onChange={e => setIdTypeOps(e.target.value)} 
                                            defaultChecked = {operation.id == idTypeOps? 'checked':null}
                                        />
                                        {operation.libelle}
                                    </label> 
                                )) }
                            </div>

                            {/* Choix catégorie */}
                            <div className="groupe-categorie d-flex mb-2">
                                <label htmlFor="categorie" className='text-white me-2'>Categorie :</label>
                                <select 
                                    id="categorie" 
                                    name = 'idCategorie'  
                                    value={idCategorie}
                                    onChange={(e) => {
                                        setIdCategorie(e.target.value)
                                        
                                    }}
                                    className="rounded" 
                                    >
                                    {categories
                                        .filter(categorie => categorie.typeOps.includes(idTypeOps))
                                        .map((categorie) => (
                                        <option value={categorie.id} key={categorie.id} >{categorie.libelle} </option>
                                    ))}                         
                                </select>
                            </div>

                            {/* Libellé opération */}
                            <div className='Libelle'>
                                <label htmlFor="libelle" className='text-light'>Libellé : </label> 
                                <input
                                    type='text' 
                                    id='libelle'
                                    value = {libelle}
                                    onChange={(e) => setLibelle(e.target.value)} 
                                    className={
                                        libelleMessage? "form-control border border-2 border-danger" : 
                                        ((showSaisieForm.operationType=='deletePrevision' || showSaisieForm.operationType=='deleteOperation')? "form-control disabled" : "form-control")
                                    }
                                />
                            </div>
                            {libelleMessage && <p className='text-danger'>{libelleMessage}</p>}
                            
                            {/* Date de l'opération */}
                            <div className='dateOps'>
                                <label htmlFor="dateOps" className='text-light'>Date : </label> 
                                <input
                                    type="date" 
                                    id="dateOps"
                                    value={dateOps}
                                    onChange={(e) => setDateOps(e.target.value)} 
                                    className={
                                        dateOpsMessage? "form-control border border-2 border-danger" : 
                                        ((showSaisieForm.operationType=='deletePrevision' || showSaisieForm.operationType=='deleteOperation')? "form-control disabled" : "form-control")
                                    }
                                />
                            </div>
                            {dateOpsMessage && <span className='text-danger'>{dateOpsMessage}</span>}

                            {/* Coût de l'opération */}
                            <div className='montant'>
                                <label htmlFor="montant" className='text-light'>Montant : </label> 
                                <input
                                    type='text'
                                    id="montant"
                                    value = {montant}
                                    onChange={(e) => setMontant(e.target.value)} 
                                    className={
                                        montantMessage? "form-control border border-2 border-danger" : 
                                        ((showSaisieForm.operationType=='deletePrevision' || showSaisieForm.operationType=='deleteOperation')? "form-control disabled" : "form-control")
                                    }
                                />
                            </div>
                            {montantMessage && <span className='text-danger'>{montantMessage}</span>}
                            
                            {
                                showSaisieForm.operationType=='newOperation' && 
                                <div className="form-group d-flex mb-0" >
                                    <input 
                                        type="checkbox" 
                                        id='checkbox'
                                        name = 'checkbox' 
                                        value = {checkbox}
                                        onChange={e => setCheckbox(!checkbox)} 
                                        className='text-start'
                                    />
                                    <label htmlFor="checkbox" className='text-white'>Enregistrer plusieurs fois cette opération</label>

                                </div>
                            }

                            {/* Date de l'opération récursive */}
                            {checkbox && 
                            <div className='recursive-date d-flex pt-2'>
                                <label htmlFor="recursiveDate" className='text-light pe-2'>Enregistrer tous les  </label> 
                                <input
                                    type='text'
                                    id='recursive'
                                    value = {jourDuMois}
                                    onChange={(e) => checkJourDuMois(e.target.value)} 
                                    className={checkbox == true && jourDuMois == ''? "form-control w-25 border border-2 border-danger text-center" : "form-control w-25 border border-2 border-success text-center" }
                                />
                                
                            </div>
                            }
                            {checkbox && jourDuMoisMessage && <span className='text-danger'>{jourDuMoisMessage}</span>}

                             {/* Nombre de répétition de l'opération récursive */}
                             {checkbox && 
                             <div className='recursive-number d-flex pt-2'>
                                <label htmlFor="recursiveNumber" className='text-light pe-2'>Nombre de répétition   </label> 
                                <input
                                    type='text'
                                    id='recursiveNumber'
                                    value = {nombreDeRepetition}
                                    onChange={(e) => checkNombreDeRepetition(e.target.value)} 
                                    className={checkbox == true && nombreDeRepetition != '' && nombreDeRepetition>0 && nombreDeRepetition <= 25? "form-control w-25 border border-2 border-success text-center" : "form-control w-25 border border-2 border-danger text-center" }
                                />
                            </div>}
                            {checkbox && nombreDeRepetitionMessage && <span className='text-danger'>{nombreDeRepetitionMessage}</span>}


                            <div className='d-flex justify-content-center gap-2 my-2'>
    
                                    {showSaisieForm.operationType=='confirmPrevision' && <button onClick={()=>{handleTransformPrevision()}} className='btn btn-primary'>Enregistrer</button>}
                                    {showSaisieForm.operationType=='newOperation' && <button onClick={(e)=>{handleSubmit(e)}} className='btn btn-primary'>Enregistrer</button>}
                                    {showSaisieForm.operationType=='deletePrevision' && <button onClick={()=>{handleDelete()}} className='btn btn-danger'>Oui</button>}
                                    {showSaisieForm.operationType=='editOperation' && <button onClick={()=>{handleSubmit()}} className='btn btn-primary'>Modifier</button>}

                                <button 
                                    type="button" 
                                    className="close bg-danger border border-secondary px-3 text-light rounded" 
                                    onClick={()=> toggleSaisieForm(false, '', '')}>
                                        <span aria-hidden="true">Annuler</span>
                                </button>
                            </div>
                        </form>
                        
                        
                        { alert && <p className='alert alert-success p-1'>{alert}</p> }
                            
                    </div>
                </div>
            </div>
        </div>

    );
};

export default SaisieForm;