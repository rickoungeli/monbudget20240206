import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { checkLibelle } from '../../utils/controllers';
import { checkDateOps } from '../../utils/controllers';
import { checkMontant } from '../../utils/controllers';


const SaisieForm = ({ops, show, onClose, rafreshList, action}) => {
    if (!show) return null; //si show est false, ne rien afficher
    const user = localStorage.getItem('userId')
    const page = localStorage.getItem('page')
    const operations = JSON.parse(localStorage.getItem('typeOperations'));
    const categories = JSON.parse(localStorage.getItem('categories'));
    const todaysdate = (new Date().toLocaleDateString()).split('/');
    const todays = todaysdate[2]+'-'+todaysdate[1]+'-'+todaysdate[0];
    const [libelle, setLibelle] = useState(action=='create'? '' : ops.libelle)
    const [dateOps, setDateOps] = useState(action=='create'? todays : ops.dateops)
    const [idTypeOps, setIdTypeOps] = useState(action=='create'? 'D' : ops.idtypeops);
    const [idCategorie, setIdCategorie] = useState(action=='create'? categories[0].id : ops.idcategorie);
    const [libCat, setLibCat] = useState('')
    const [montant, setMontant] = useState(action=='create'? '' : ops.montant)
    const [checkbox, setCheckbox] = useState(false)
    const [alert, setAlert] = useState('')
    const [errors, setErrors] = useState({});
    
 
    //Fonction pour créer, confirmer, modifier ou supprimer une opération dans la bdd
    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors({});
        setAlert('');

        //Vérification des champs
        let newErrors = {};
        checkLibelle(libelle) ? newErrors.libelle = checkLibelle(libelle) : null;
        checkDateOps(dateOps) ? newErrors.dateOps = checkDateOps(dateOps) : null;
        checkMontant(montant) ? newErrors.montant = checkMontant(montant) : null;

        //Si erreurs -> on arrête
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            console.log(errors);
            return;
        }

        //Si valide, on envoie les données
        const data = new FormData()
        data.append('iduser', user)
        data.append('libelle', libelle)
        data.append('montant', montant)
        data.append('dateops', dateOps) 
        data.append('idtypeops', idTypeOps)
        data.append('idcategorie', idCategorie)

        if (action == 'create') {
            if(page == 'depenses') {
                data.append('function', 'insertOperation')
                data.append('isconfirmed', 1)
            }
            if(page == 'previsions') {
                data.append('function', 'insertPrevision')
                data.append('isconfirmed', 0)
            }
        } else {
            data.append('idops', ops.id)
            if(action == 'confirm') {
                data.append('function', 'transformPrevision')
                data.append('isconfirmed', 1)
            } else {
                action == 'edit' && data.append('function', 'editOperation')
                action == 'delete' && data.append('function', 'deletePrevision')
                data.append('isconfirmed', ops.isconfirmed)
            }
        }

        axios.post(`${process.env.REACT_APP_API_URL}operations.php`, data)
        .then(res => {
            if(res.data=='') {                          
                setAlert("Echec : l'opération n'a pas réussi")
            } else {
                let selectElement = document.querySelector('#categorie')
                let selectedIndex = selectElement.selectedIndex
                let selectedOption = selectElement.options[selectedIndex]
                data.append('categorie', selectedOption.innerText)
                if(res.data.status == 201){ 
                    //c'est une création, on ajoute l'élément dans le store du parent
                    setAlert('Opération enregistrée avec succès')
                    data.append('id', res.data.id,)
                    data.append('checkbox', checkbox)
                    rafreshList(Object.fromEntries(data.entries())); //Convertit formData en objet
                    
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
                    
                if(res.data.status == 200 || res.data.status == 400){ 
                    if(res.data.status == 200) {
                        //c'est une modification
                        setAlert('Opération modifiée avec succès')
                    } else {
                        //c'est une transformation
                        setAlert('Opération transformée avec succès')
                    }
                    //On ferme le formulaire et on modifie l'item dans le store du parent
                    data.append('id', ops.id)
                    setTimeout(()=> {
                        setAlert('');
                        rafreshList(Object.fromEntries(data.entries())); //Convertit formData en objet
                    }, 2000)                
                }  

                if(res.data.status == 300){ 
                    //c'est une suppression
                    //On ferme le formulaire et on supprimme l'item dans le state du parent
                    setAlert('Suppression effectuée avec succès')
                    setTimeout(()=> {
                        setAlert('');
                        rafreshList({'id':ops.id});
                    }, 2000)   
                }
                
                // if(res.data.status == 400){ 
                //     //c'est une transformation
                //     setAlert('Opération transformée avec succès')
                //     //On ferme le formulaire et on modifie l'item dans le store du parent
                //     data.append('id', ops.id)
                //     setTimeout(()=> {
                //         setAlert('');
                //         rafreshList(Object.fromEntries(data.entries())); //Convertit formData en objet
                //     }, 2000) 
                //     console.log(Object.fromEntries(data.entries()))
                // }            
            }
        })
        .catch(err => {
            //setAlert("L'opération a echoué "+ err)
            setErrors({ global : "L'opération a echoué" + err })
        })
    }

    return (
        <div className="saisie-form overlay m-1">
            <div className="modal-dialog bg-dark w-100 mx-auto">
                <div className="modal-content">
                    <div className="modal-header bg-light p-1">
                        <div>
                            <h5 className="modal-title text-center text-dark">
                                {action == 'create' && page=='previsions'&& "Saisie d'une prévision"} 
                                {action == 'create' && page=='depenses' && "Saisie d'une opération effectuée"} 
                                {action == 'edit' && page=='previsions' && "Modification d'une prévision" }
                                {action == 'edit' && page=='depenses' && "Modification d'une opération" }
                                {action == 'editOperation' && page=='depenses' && "Modification d'une opération" }
                                {action == 'delete' && "Voulez-vous supprimer cette prévision ?"}
                                {action == 'confirm' && "Cette prévision a été réalisée ?" }
                            </h5>
                            {action == 'delete' ? <small className='d-block text-center mb-1 fs-6'>(si vous cliquez sur oui, la prévision sera supprimée)</small> : null}
                            {action == 'confirm' ? <small className='d-block text-center mb-1 fs-6'>(si vous cliquez sur oui, cette prévision va être enregistrée comme une opération effectuée)</small> : null}
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
                                        errors.libelle? "form-control border border-2 border-danger" : 
                                        (action=='delete' ? "form-control disabled" : "form-control")
                                    }
                                />
                            </div>
                            {errors.libelle && <p className='text-danger'>{errors.libelle}</p>}
                            
                            {/* Date de l'opération */}
                            <div className='dateOps'>
                                <label htmlFor="dateOps" className='text-light'>Date : </label> 
                                <input
                                    type="date" 
                                    id="dateOps"
                                    value={dateOps}
                                    onChange={(e) => setDateOps(e.target.value)} 
                                    className={
                                        errors.dateOps? "form-control border border-2 border-danger" : 
                                        (action=='deletePrevision' ? "form-control disabled" : "form-control")
                                    }
                                />
                            </div>
                            {errors.dateOps && <span className='text-danger'>{errors.dateOps}</span>}

                            {/* Coût de l'opération */}
                            <div id='montant' className='montant'>
                                <label htmlFor="montant" className='text-light'>Montant : </label> 
                                <input
                                    type='text'
                                    id="montant"
                                    value = {montant}
                                    onChange={(e) => setMontant(e.target.value)} 
                                    className={
                                        errors.montant? "form-control border border-2 border-danger" : 
                                        (action=='deletePrevision' ? "form-control disabled" : "form-control")
                                    }
                                />
                            </div>
                            {errors.montant && <span className='text-danger'>{errors.montant}</span>}
                            
                            {
                                action=='create' && 
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
                                {action=='confirm' && <button onClick={(e)=>{handleSubmit(e)}} className='btn btn-primary'>Enregistrer</button>}
                                {action=='create' && <button onClick={(e)=>{handleSubmit(e)}} className='btn btn-primary'>Enregistrer</button>}
                                {action=='edit' && <button onClick={(e)=>{handleSubmit(e)}} className='btn btn-primary'>Modifier</button>}
                                {action=='delete' && <button onClick={(e)=>{handleSubmit(e)}} className='btn btn-danger'>Oui</button>}
                                <button 
                                    type="button" 
                                    className="close bg-danger border border-secondary px-3 text-light rounded" 
                                    onClick={onClose}>
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