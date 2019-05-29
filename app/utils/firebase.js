import firebase from 'react-native-firebase';
import { isArray, isString, isEmpty } from 'lodash';

function firestore() {
    return firebase.firestore();
}

export const PAGINATION_ITEM_PER_PAGE = 30;

export function getAuth(){
    return firebase.auth();
}

export function getCurrentUserId() {
    return firebase.auth().currentUser.uid;
}

export function getCollection(collection) {
    return firestore().collection(collection);
}

export function getDoc(collection, id) {
    return getCollection(collection).doc(id);
}

function getStorage(){
    return firebase.storage();
}

export function signOutWithFB() {
    return getAuth().signOut();
}

export function signUpWithFB(email, password) {
    return getAuth().createUserWithEmailAndPassword(email, password);
}

export function signInWithFB(email, password) {
    return getAuth().signInWithEmailAndPassword(email, password);
}

function deleteFile(url) {
    return new Promise((resolve, reject) => {
        if(isString(url) && !isEmpty(url)) {
            getStorage().refFromURL(url).delete().then(
                () => resolve(true)
            ).catch((error) => {reject(error);});
        } else {
            resolve(true);
        }
    });
}

export function uploadFile(uri, storagePath){

    return new Promise((resolve, reject) => {
        getStorage().ref().child(storagePath).putFile(uri).then(
            (snapshot) => { 
                resolve(snapshot.downloadURL); 
            }
        ).catch(
            (error) => reject(error)
        )
    });

}

export function updateFile(newUri, storagePath, oldUrl) {
    return new Promise((resolve, reject) => {
        uploadFile(newUri, storagePath).then(
            (url) => {
                if(isString(oldUrl) && !isEmpty(oldUrl)) {
                    deleteFile(oldUrl).then(
                        () => {resolve(url);}
                    ).catch((error) => {resolve(url);}); 
                } else {
                    resolve(url);
                }
            }
        ).catch((error) => reject(error))
    });
}

export function createQuery(context) {
    if((typeof context) !== "object") {
        throw new Error("Parameter must be an object !");
    }

    if(!context.collection) {
        throw new Error("Parameter must have at least collection field !");
    }

    const query = {
        collection: context.collection,
        doc: context.doc ? context.doc : null,
        orderBy: context.orderBy ? context.orderBy : null,
        where: context.where ? context.where : null,
        startAt: context.startAt ? context.startAt : null,
        startAfter: context.startAfter ? context.startAfter : null,
        endBefore: context.endBefore ? context.endBefore : null,
        endAt: context.endAt ? context.endAt : null,
        limit: context.limit ? context.limit : null,
        storeAs: context.storeAs,
    };

    return query;

}

export function add(query, data) {
    if((typeof query) !== "object" || (typeof data) !== "object") {
        throw new Error("Parameters must be an object !");
    }

    return getCollection(query.collection).add(data);
}

export function get(query) {
    if((typeof query) !== "object") {
        throw new Error("Parameter must be an object !");
    }

    return parseQuery(query).get();
}

export function set(query, data) {
    if((typeof query) !== "object" || (typeof data) !== "object") {
        throw new Error("Parameters must be an object !");
    }

    return getDoc(query.collection, query.doc).set(data);
}

export function onSnapshot(callBackSuccess, callBackError, query) {
    if((typeof callBackSuccess) !== "function" || 
        (typeof callBackError) !== "function" || 
        (typeof query) !== "object"
    ) {
        throw new Error("Parameters must have two functions and one object !");
    }

    return parseQuery(query).onSnapshot(callBackSuccess, callBackError);
}

export function paginate(callBackSuccess, callBackError, query) {
    if((typeof callBackSuccess) !== "function" || 
        (typeof callBackError) !== "function" || 
        (typeof query) !== "object"
    ) {
        throw new Error("Parameters must have two functions and one object !");
    }
    
    const context = {
        ...query, 
        limit: query.limit ? query.limit : PAGINATION_ITEM_PER_PAGE
    };

    return parseQuery(context).onSnapshot(callBackSuccess, callBackError);
}

export function runTransaction(callBackPromise) {
    return firestore().runTransaction(callBackPromise);
}

export function update(query, data) {
    if((typeof query) !== "object" || (typeof data) !== "object") {
        throw new Error("Parameters must be an object !");
    }

    return getDoc(query.collection, query.doc).update(data);
}

function parseQuery(query) {
    if((typeof query) !== "object") {
        throw new Error("Parameter must be an object !");
    }

    const { 
        collection,
        doc,
        orderBy,
        where,
        startAt,
        startAfter,
        endBefore,
        endAt,
        limit
    } = query;

    let ref = getCollection(collection);

    if(doc) {
        ref = ref.doc(doc);
    }

    if(isArray(orderBy)) {
        for(let i = 0; i < orderBy.length; i++) {
            ref = ref.orderBy(orderBy[i][0], orderBy[i][1]);
        }
    }
    
    if(isArray(where)) {
        for(let i = 0; i < where.length; i++) {
            ref = ref.where(where[i][0], where[i][1], where[i][2]);
        }
    }

    if(startAt) {
        ref = ref.startAt(startAt);
    }

    if(startAfter) {
        ref = ref.startAfter(startAfter);
    }

    if(endBefore) {
        ref = ref.endBefore(endBefore); 
    }

    if(endAt) {
        ref = ref.endAt(endAt);
    }

    if(limit) {
        ref = ref.limit(limit);
    }

    return ref;
}