import { queryRef } from "./query";
import moment from "moment";
import { BASEFIELD } from "../constants";
import { getCurrentDate } from "../utils/dateFormatting";
import { firestore } from "../factory";

function generateID() {
    // Alphanumeric characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 20; i++) {
        autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return autoId + moment(new Date()).format("DDMMYYHHmmSS");
} 

export function get(query) {
    return queryRef(query).get();
}

export function onSnapshot(callBackSuccess, callBackError, query) {
    if((typeof callBackSuccess) !== "function" || 
        (typeof callBackError) !== "function"
    ) {
        throw new Error("The first two parameters must be functions!");
    }

    return queryRef(query).onSnapshot(callBackSuccess, callBackError);
}

export function runTransaction(callBackPromise) {
    return firestore().runTransaction(callBackPromise);
}

export function set(query, data) {
    if((typeof data) !== "object") {
        throw new Error("Data parameter must be an object !");
    }

    if(!query.doc) {
        throw new Error("Query parameter must have a doc field !");
    }

    return queryRef(query).set(data);
}

export function add(query, data) {
    if((typeof data) !== "object") {
        throw new Error("Data parameter must be an object !");
    }

    query.doc = generateID();
    const currentDate = getCurrentDate();
    const newData = {   
        id: query.doc, 
        [BASEFIELD.createdAt]: currentDate,
        [BASEFIELD.updatedAt]: currentDate,
        [BASEFIELD.deleted]: false, 
        ...data
    };

    return new Promise((resolve, reject) => {
        set(query, newData)
        .then(() => resolve(newData))
        .catch((error) => reject(error));
    });
}

export function update(query, data) {
    if((typeof data) !== "object") {
        throw new Error("Data parameter must be an object !");
    }

    if(!query.doc) {
        throw new Error("Query parameter must have a doc field !");
    }

    return queryRef(query).update({[BASEFIELD.updatedAt]: getCurrentDate(), ...data});
}

export function remove(query) {
    return update(query, {[BASEFIELD.deleted]: true});
}

export function del(query) {
    if(!query.doc) {
        throw new Error("Query parameter must have a doc field !");
    }

    return queryRef(query).delete();
}
