
import React, { useState } from 'react';
import { calculateNewValue } from '@testing-library/user-event/dist/utils';
import axios from 'axios';



//Fonction pour formater une date
export const dateParser = (date) => {
    let newDate = new Date(date).toLocaleDateString('fr-Fr', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })
    return newDate
}

//Fonction pour formater une date en anglais
export const dateParser1 = (frenchDate) => {
    let newDate = frenchDate.split('/', 3)
    let englishDate = `${newDate[2]}-${newDate[1]}-${newDate[0]}`
    return englishDate
}

//Foction pour retourner le premier jour du mois fourni
export const setFirstDay = (month, year) => {
    let date = new Date(year, month-1, 1) //Crée le premier jour du mois avec le mois et l'année fournis
    let firstDay = date.toLocaleDateString('fr-FR')
    return firstDay
    // date.setMonth(parseInt(month, 10) -1) //détermine le mois de cette date
    // date.setFullYear(year) //détermine l'année de cette date
    // date.setDate(1) //retourne le premier jour de ce mois

    // //Setting dateFrom
    // let firstDay = date.toLocaleDateString('fr-FR')
    // localStorage.setItem('dateFrom', firstDay)
    // setDateFrom(dateParser1(firstDay))
    // //setting dateTo
    // date.setMonth(date.getMonth() + 1)
    // date.setDate(0)
    // let lastDay = date.toLocaleDateString('fr-FR')
    // console.log(lastDay);
    // localStorage.setItem('dateTo', lastDay)
    //setDateTo(dateParser1(lastDay))
    // //showOperationsList()
}

export const setLastDay = (month, year) => {
    const firstDay = new Date(year, month, 1)
    const date = new Date(firstDay - 1)
    const lastDay = date.toLocaleDateString('fr-FR')
    return lastDay
}

export const htmlEntities = (str) => {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
};


export const useCheckLibelle = (libelle) => {
    const [libelleMessage, setLibelleMessage] = useState('')
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

//Fonction pour récupérer la valeur de l'élément sélectionné dans un combobox
export const valueReturner = (id, liste) => {
    let newTable = ''
    return newTable
}

 