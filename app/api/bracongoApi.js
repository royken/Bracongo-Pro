import axios from 'axios';
import { getToken } from '../utils/buildTruckUrl';
import { isFinite } from 'lodash';

const baseURI = "https://api.bracongo-cd.com:8443/bracongo-api";
const baseVODACOMURI = "https://ivtrackaz.vodacom.cd/ivtwcf/IVTrSvc.svc/GetCircInfoJS/BRC";

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

export function getActualMonthDiscountAndTurnover(numero, password, year = null, month = null) {
    const uri = !isFinite(year) && !isFinite(month) ? 
                `${baseURI}/achats/remise/${numero}/${password}/${year}/${month}` : 
                `${baseURI}/achats/remise/${numero}/${password}`;

    return new Promise((resolve, reject) => {
        axios.get(uri)
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
}

export function getPurchases(numero, password, isMonth) {
    const uri = isMonth === true ? 
            `${baseURI}/achats/${numero}/${password}` : 
            `${baseURI}/achats/annee/${numero}/${password}`;
    
    if(isMonth === true) {

        return new Promise((resolve, reject) => {
            axios.all([
                axios.get(uri),
                axios.get(`${baseURI}/achats/produits/${numero}/${password}`)
            ]).then(axios.spread((resp1, resp2) => {
                resolve({data1: resp1.data, data2: resp2.data});
            })).catch((error) => reject(error));
        });

    } else {

        return new Promise((resolve, reject) => {
            axios.get(uri)
            .then((resp) => resolve(resp.data))
            .catch((error) => reject(error));
        });

    }       
    
}

export function getTrucks(deviceId, ccode) {
    const currentDate = (new Date()).getTime().toString();
    const token = getToken(deviceId, ccode, currentDate);

    return new Promise((resolve, reject) => {
        axios.get(`${baseVODACOMURI}|${deviceId}|${ccode}|${currentDate}|${token}`)
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
}