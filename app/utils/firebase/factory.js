import firebase from 'react-native-firebase';

export function getAuth(){
    return firebase.auth();
}

export function firestore() {
    return firebase.firestore();
}

export function getStorage(){
    return firebase.storage();
}