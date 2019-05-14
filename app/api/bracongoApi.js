import axios from 'axios';

const baseURI = "https://api.bracongo-cd.com:8443/bracongo-api";

export function signInWithApi(numero, password) {
    return new Promise((resolve, reject) => {
        axios.get(`${baseURI}/pro/login/${numero}/${password}`)
        .then(
            (resp) => {
                const data = resp.data;
                if(data.status === true) {
                    resolve(data.clientDto);
                } else {
                    reject({code: 'auth/invalid-credential'});
                }   
            }
        ).catch((error) => reject(error));
    });
}

export function getActualMonthDiscountAndTurnover(numero, password) {
    return new Promise((resolve, reject) => {
        axios.get(`${baseURI}/achats/remise/${numero}/${password}`)
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
}

export function getPurchases(numero, password, isMonth) {
    const uri = isMonth ? 
            `${baseURI}/achats/${numero}/${password}` : 
            `${baseURI}/achats/annee/${numero}/${password}`
            
    return new Promise((resolve, reject) => {
        axios.get(uri).then((resp) => resolve(resp.data)).catch((error) => reject(error));
    });
}