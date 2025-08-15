import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { arrayCompare } from '../../utils/controllers';
import { checkLibelle } from '../../utils/controllers';
import { checkDateOps } from '../../utils/controllers';
import { checkMontant } from '../../utils/controllers';


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
    const [checkbox, setCheckbox] = useState(false)
    const [alert, setAlert] = useState('')
    const [libelleMessage, setLibelleMessage] = useState('')
    const [dateOpsMessage, setDateOpsMessage] = useState('')
    const [montantMessage, setMontantMessage] = useState('')
    
    const data = new FormData()
    data.append('iduser', user)
    data.append('fonctionnalite', fonctionnalite)
   
    useEffect(() => { 
        if (showSaisieForm.operationType=='editOperation' || showSaisieForm.operationType=='deletePrevision' || showSaisieForm.operationType=='confirmPrevision') {
            setIdCategorie(showSaisieForm.operationItem.idcategorie)
            setIdTypeOps(showSaisieForm.operationItem.idtypeops)
            setLibelle(showSaisieForm.operationItem.libelle)
            setDateOps(showSaisieForm.operationItem.dateops)
            setMontant(showSaisieForm.operationItem.montant)
        }
    }, [])

    //Fonction pour supprimer une opération de la bdd
    const handleDelete = () => {
        const operationId = showSaisieForm.operationItem.id
        data.append('function', 'deletePrevision')
        data.append('idoperation', operationId)
        axios.post(`${process.env.REACT_APP_API_URL}operations.php`, data)
        .then(res => {
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
    
    //Fonction pour créer, confirmer ou modifier une opération dans la bdd
    const handleSubmit = (e) => {
        e.preventDefault()
        const checkLibelle1 = checkLibelle(libelle)
        setLibelleMessage(checkLibelle1.message)
        const checkDateOps1 = checkDateOps(dateOps)
        setDateOpsMessage(checkDateOps1.message)
        const checkMontant1 = checkMontant(montant)
        setMontantMessage(checkMontant1.message)

        let checkResultArray = []
        checkResultArray=[checkLibelle1.value, checkDateOps1.value, checkMontant1.value]
        if ( arrayCompare(checkResultArray, [false, false, false]) !== false) {
            showSaisieForm.operationType == 'newOperation' && data.append('function', 'insertOperation')
            showSaisieForm.operationType == 'editOperation' && data.append('function', 'editOperation')
            showSaisieForm.operationType == 'confirmPrevision' && data.append('function', 'transformPrevision')
            showSaisieForm.operationType!='newOperation' && data.append('idoperation', showSaisieForm.operationItem.id)
            data.append('libelle', libelle)
            data.append('montant', montant)
            data.append('dateops', dateOps)
            data.append('idtypeops', idTypeOps)
            data.append('idcategorie', idCategorie)
            axios.post(`${process.env.REACT_APP_API_URL}operations.php`, data)
            .then(res => {
                if(res.data=='') {
                    setAlert("Echec : l'opération n'a pas réussi")
                } else {
                    let selectElement = document.querySelector('#categorie')
                    let selectedIndex = selectElement.selectedIndex
                    let selectedOption = selectElement.options[selectedIndex]
                    if(res.data.status == 201){ 
                        //c'est une création, on ajoute l'élément dans le store du parent
                        setAlert('Opération enregistrée avec succès')
                        
                        toggleSaisieForm(true, 'addItemToStore', {
                            id: res.data.id,
                            categorie: selectedOption.innerText,
                            libelle: libelle,
                            montant: montant,
                            dateops: dateOps,
                            idtypeops: idTypeOps,
                            idcategorie: idCategorie,
                            isconfirmed: 0
                        })
                        if(!checkbox){
                            setLibelle('')
                            setMontant('')
                        } else {
                            setDateOps('')
                        }
                        setTimeout(()=> {
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
                    
                    if(res.data.status == 400){ 
                        //c'est une transformation
                        //On supprime la prévision dans le store
                    setAlert('Prévision transformée avec succès')
                    setTimeout(()=> {
                        toggleSaisieForm(false, 'deleteItemFromStore', showSaisieForm.operationItem)
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
                            <div id='montant' className='montant'>
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

                            <div id='boutons' className='d-flex justify-content-center gap-2 my-2'>
                                {showSaisieForm.operationType=='confirmPrevision' && <button onClick={(e)=>{handleSubmit(e)}} className='btn btn-primary'>Enregistrer</button>}
                                {showSaisieForm.operationType=='newOperation' && <button onClick={(e)=>{handleSubmit(e)}} className='btn btn-primary'>Enregistrer</button>}
                                {showSaisieForm.operationType=='editOperation' && <button onClick={(e)=>{handleSubmit(e)}} className='btn btn-primary'>Modifier</button>}
                                {showSaisieForm.operationType=='deletePrevision' && <button onClick={()=>{handleDelete()}} className='btn btn-danger'>Oui</button>}
                                <button 
                                    type="button" 
                                    className="close bg-danger border border-secondary px-3 text-light rounded" 
                                    onClick={()=> toggleSaisieForm(false, '', '')}>
                                        <span aria-hidden="true">Fermer</span>
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