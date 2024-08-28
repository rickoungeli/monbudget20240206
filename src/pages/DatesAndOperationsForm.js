import React, {useState} from 'react';
import { dateParser1 } from '../utils/controllers';
import { setFirstDay } from '../utils/controllers';
import { setLastDay } from '../utils/controllers';
import Operations from './Operations'


const DatesAndOperationsForm = (props) => {
    const operationsType = JSON.parse(localStorage.getItem('typeOperations')); //Liste des opérations
    const todaysdate = (new Date().toLocaleDateString()).split('/');  //Date du jour
    const fmonth = JSON.parse(localStorage.getItem('fmonth'))
    const [selectedMonth, setSelectedMonth] = useState(localStorage.getItem('month'));
    const [selectedYear, setSelectedYear] = useState(localStorage.getItem('year'));
    const [selectedOps, setSelectedOps] = useState(localStorage.getItem('selectedOps'))
    const [trierPar, setTrierPar] = useState(localStorage.getItem('trierPar')?localStorage.getItem('trierPar'):'date')
    const[dateFrom, setDateFrom] = useState(dateParser1(localStorage.getItem('dateFrom')))
    const[dateTo, setDateTo] = useState(dateParser1(localStorage.getItem('dateTo')))
    const [errorMessage, setErrorMessage] = useState('') 
    const [selectedOperation, setSelectedOperation] = useState('')
    
    //Comportements   
    const onMonthClicked = e => {
            setSelectedMonth(e.target.value)
            localStorage.setItem('month', e.target.value)
            let date1 = setFirstDay(e.target.value, selectedYear)
            let date2 = setLastDay(e.target.value, selectedYear)
            localStorage.setItem('dateFrom', date1)
            localStorage.setItem('dateTo', date2)
            setDateFrom(dateParser1(date1))
            setDateTo(dateParser1(date2))
            //setLoadOperations(!loadOperations)
    }
   const onYearClicked = e => {
       setSelectedYear(e.target.value)
       localStorage.setItem('year', e.target.value)
       let date1 = setFirstDay(selectedMonth, e.target.value)
       let date2 = setLastDay(selectedMonth, e.target.value)
       localStorage.setItem('dateFrom', date1)
       localStorage.setItem('dateTo', date2)
       setDateFrom(dateParser1(date1))
       setDateTo(dateParser1(date2))
    //setLoadOperations(!loadOperations)
    }

    const onTypeOperationClicked = e => {
        localStorage.setItem('selectedOps', e.target.value)
        setSelectedOps(e.target.value)
        //setLoadOperations(!loadOperations)
    }

    const onDateFromClicked = (date1) => {
        setDateFrom(date1)
        //setLoadOperations(!loadOperations)
    }

    const onDateToClicked = (date2) => {
        setDateTo(date2)
        //setLoadOperations(!loadOperations)
    }

    const onTrierPar = e => {
        setTrierPar(e.target.value)
        localStorage.setItem('trierPar', e.target.value)
        //setLoadOperations(!loadOperations)
    }
   
    return (
        <>
            <form className='page-dates-form col-12 col-md-10 col-lg-8 bg-success text-light p-1 '>
                <div className='d-flex'>
                    {/* Groupe choix opération */}
                    <div className='groupe-type-operation d-flex flex-column col-4 p-2'>
                        <p className='mb-0'>Types d'opérations :</p>
                        {operationsType.map((typeOps) => (
                            <label htmlFor={typeOps.id} key={typeOps.id} className='form-check-label'>
                                <input 
                                    type="radio" 
                                    id={typeOps.id} 
                                    name='selectedtypeOperation'
                                    value={typeOps.id} 
                                    className='form-check-input' 
                                    defaultChecked = {(typeOps.id == 'D') && 'checked'}
                                    onChange={(e)=> onTypeOperationClicked(e)}
                                />
                                {typeOps.libelle}
                            </label> 
                        ))}  
                    </div>
                    
                    <div className="form-group d-flex flex-column flex-lg-row col-8">
                        <div className="d-flex mb-2 col-lg-6 gap-2 mb-2">
                            {/* Groupe mois */}
                            <div className="d-flex flex-column">
                                <label htmlFor="month">Mois :</label>
                                <select 
                                    id="month" 
                                    name='selectedMonth' 
                                    className="rounded" 
                                    //defaultValue={todaysdate[1]}
                                    value={selectedMonth}
                                    onChange={(e)=> onMonthClicked(e)}>
                                    {fmonth.map((month) => (
                                        <option value={month.id} key={month.id} >{month.libelle} </option>
                                    ))}   
                                                            
                                </select>
                            </div>
                            {/* Groupe année */}
                            <div className="d-flex flex-column">
                                <label htmlFor="selectedYear">Année :</label>
                                <select 
                                    id='selectedYear' 
                                    name='selectedYear'
                                    className=''
                                    value={selectedYear}
                                    onChange={(e)=>onYearClicked(e)}>
                                    {(()=>{
                                        let listbox = [];
                                        for(let i=2020; i<=(parseInt(todaysdate[2])+10); i++){ 
                                            listbox.push(<option value={i} key={i} >{i}</option>)
                                        }
                                        return listbox ;
                                    })()}

                                </select>
                            </div>
                            {/* Groupe trier par */}
                            <div className="d-flex flex-column">
                                <label htmlFor="trierPar">Trier par :</label>
                                <select 
                                    id="trierPar" 
                                    name='trierPar' 
                                    className="rounded" 
                                    //defaultValue={todaysdate[1]}
                                    value={trierPar}
                                    onChange={(e)=> onTrierPar(e)}>
                                        <option value='date'>Date </option>
                                        <option value='categorie'>Catégorie </option>
    
                                                            
                                </select>
                            </div>
                        </div>
                        
                        <div className="groupe-du-au d-flex gap-2 mb-2">
                            {/* Groupe date de début */}
                            <div className="groupe-date-debut d-flex flex-column">
                                <label htmlFor="date-debut">Du :</label>
                                <input 
                                    type="date" 
                                    id='date-debut' 
                                    name='dateFrom'
                                    value={dateFrom}
                                    onChange = {(e) => onDateFromClicked(e.target.value)}
                                />
                            </div>
                            {/* Groupe date fin */}
                            <div className="groupe-date-fin d-flex flex-column">
                                <label htmlFor="date-fin">Au :</label>
                                <input 
                                    type="date" 
                                    id="date-fin" 
                                    name='dateTo'
                                    value={dateTo}
                                    onChange = {e => onDateToClicked(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            
            <Operations 
                fonctionnalite = {props.fonctionnalite}
                selectedOps={selectedOps}
                dateFrom={dateFrom}
                dateTo={dateTo}
                trierPar={trierPar}
            />
        </>
    );
};

export default DatesAndOperationsForm;