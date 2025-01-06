import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Attention from '../../images/attention.png'
import { confirmAlert } from 'react-confirm-alert';

const Register = () => {
    const [alert, setAlert] = useState('')
    const [isRegistered, setIsRegistered] = useState(false)
    const [errors, setErrors] = useState({
        pseudo: '',
        password: '',
        passwordConfirm: ''
    })
    const [data, setData] = useState({
        pseudo: '',
        password: '',
        passwordConfirm: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({...data, [name] : value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = {}
        //const navigate = useNavigate()
        if(!data.pseudo.trim()) newErrors.pseudo = 'Veuillez renseigner un pseudo svp'
        if(!data.password.trim()) newErrors.password = 'Veuillez renseigner le mot de passe svp'
        if(data.password & !data.passwordConfirm.trim()) newErrors.passwordConfirm = 'Veuillez confirmer le password svp'
        if(data.password & data.passwordConfirm & data.password != data.passwordConfirm) newErrors.passwordConfirm = 'Les mots de passe ne correspondent pas'
        

        if (Object.keys(newErrors).length > 0) {
            setAlert('Il y a des erreurs')     
            return
        } else {  
            setAlert('')
            const res = await axios.post('http://localhost:80/backend.monbudget/user/save', data)
            //axios.post(`${process.env.REACT_APP_API1_URL}user/save`, inputs)
            console.log(res.data);
            /*
            .then(res => {
                console.log(res)
                if(res.data==='') {
                    setAlert("Echec : l'inscription n'a pas réussi")
                } else {
                    if(res.data.includes('Vous avez été enregistré avec succès')){
                        //setAlert('Vous avez été enregistré avec succès')

                        //setTimeout(() => {
                        //    setAlert('')
                        if (YesNo("Votre inscription a réussi, vous devez vous connecter")){
                            navigate('/login')
                        }
                    }           
                    
                }
            })
            .catch(err => setAlert("Echec")) 
            */
        }
    
    }

    useEffect(() => { 
        document.title = "Inscription d'un utilisateur" 
    }, [])
    
    return (
        <div className='row no-gutters'>
            <form className='p-3 m-3 col-11 col-md-6 col-lg-4 mx-auto bg-info' onSubmit={handleSubmit}>
                <h1 className="mx-3 mt-3 text-center">S'inscrire</h1>
                <p className="text-center">Vous avez déjà un compte? <NavLink to="/login" className='link'>Se connecter</NavLink></p>
                                
                {alert && <p className='alert alert-danger'>{alert}</p> }
                <div className='d-flex flex-column gap-3 mx-4'>
                    <div className="form-group">
                        <input 
                            type="text" 
                            placeholder="Pseudo" 
                            name="pseudo"
                            value={data.pseudo}
                            onChange={handleChange}
                            className = {errors.pseudo? "form-control border border-danger" : " form-control border border-success"}
                        />
                        {errors.pseudo && <span className="text-danger">{errors.pseudo}</span> }
                    </div>

                    <div className="form-group">
                        <input 
                            type="password" 
                            placeholder="Mot de passe" 
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            className = {errors.password? "form-control border border-danger" : "form-control border border-success"}
                        />
                        {errors.password && <span className="text-danger">{errors.password}</span> }
                    </div>

                    <div className="form-group">
                        <input 
                            type="password" 
                            placeholder="Confirmer mot de passe" 
                            name="passwordConfirm"
                            value={data.passwordConfirm}
                            onChange={handleChange}
                            className = {errors.passwordConfirm? "form-control border border-danger" : "form-control border border-success"}
                        />
                        {errors.passwordConfirm && <span className="text-danger">{errors.passwordConfirm}</span> }
                    </div>
                                    
                    <div className="form-group">
                        <input type="submit" className="btn btn-primary w-100" />
                        <small>En cliquant sur envoyer, vous acceptez nos <a href='www'>conditions générales</a> et notre politique des coockies</small>
                    </div>
                </div>
            </form>

        </div>
    );
};

export default Register;