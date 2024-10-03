import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { FaCreativeCommonsRemix } from "react-icons/fa";

const Home = () => {
    const [page, setPage] = useState('')
    const [user, setUser] = useState(localStorage.getItem('userId'))
    const [login, setLogin] = useState(localStorage.getItem('userPseudo')?localStorage.getItem('userPseudo'):'')
    

    return (
        <div>
            <h1 className='text-center mt-1'>BIENVENUE {login.toUpperCase()}</h1>
            <section className='mt-4 p-3'>
                
                {user && <>
                    <div className='d-flex flex-column w-75 mx-auto gap-3' >
                        <Link to = '/previsions' className="btn btn-primary">GERER LES PREVISIONS</Link>

                        <Link to = '/depenses' className="btn btn-primary">GERER LES DEPENSES</Link>

                        <Link to = '/categories' className="btn btn-primary">GERER LES CATEGORIES</Link>
                    </div>

                    </>
                }
            </section>
            
        </div>
    );
};

export default Home;