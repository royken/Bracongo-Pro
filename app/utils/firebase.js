import firebase from 'react-native-firebase';
import { isString, isEmpty } from 'lodash';

export function getAuth(){
    return firebase.auth();
}

export function getCollection(collection) {
    return firebase.firestore().collection(collection);
}

export function getDoc(collection, id) {
    return getCollection(collection).doc(id);
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
                deleteFile(oldUrl).then(
                    () => {resolve(url);}
                ).catch((error) => {resolve(url);}); 
            }
        ).catch((error) => reject(error))
    });
}

function getStorage(){
    return firebase.storage();
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