import axios from 'axios';
import { getToken } from '../utils/buildTruckUrl';
import { isNull } from 'lodash';
import { MAX_PER_PAGE_PAGINATION } from './constants';
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

export function getActualMonthDiscountAndTurnover(numero, password, year = null, month = null, withList = true) {
    const uriAmount = !isNull(year) && !isNull(month)  ? 
                `${baseURI}/achats/remise/${numero}/${password}/${year}/${month}` : 
                `${baseURI}/achats/remise/${numero}/${password}`;
    
    if(withList === true) {
        const uriList = `${baseURI}/achats/remise/histo/${numero}/${password}`;
        return new Promise((resolve, reject) => {
            axios.all([
                axios.get(uriAmount),
                axios.get(uriList)
            ]).then(axios.spread((resp1, resp2) => {
                resolve({data1: resp1.data, data2: resp2.data});
            })).catch((error) => reject(error));
        });
    }

    return new Promise((resolve, reject) => {
        axios.get(uriAmount)
        .then((resp) => resolve({data1: resp.data, data2: null}))
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

export function getMessages(numero, page = 0) {
    const uri = `${baseURI}/messages/client/${numero}/${page}/${MAX_PER_PAGE_PAGINATION}`;

    return new Promise((resolve, reject) => {
        axios.get(uri)
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
}

export function getComplaints(numero, page = 0) {
    const uri = `${baseURI}/plaintes/client/${numero}/${page}/${MAX_PER_PAGE_PAGINATION}`;

    return new Promise((resolve, reject) => {
        axios.get(uri)
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
}

export function addComplaint(complaint) {
    const uri = `${baseURI}/plaintes/add`;

    return new Promise((resolve, reject) => {
        axios.post(uri, complaint)
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
}

export function logAnalytic(numero, page) {
    const uri = `${baseURI}/logs/add`;

    return new Promise((resolve, reject) => {
        axios.post(uri, { client: numero, page: page })
        .then((resp) => resolve(true))
        .catch((error) => reject(error));
    });
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

export function processOrder(numero, products) {
    const uri = `${baseURI}/commandes`;

    return new Promise((resolve, reject) => {
        axios.post(uri, { client: numero, items: products })
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
}