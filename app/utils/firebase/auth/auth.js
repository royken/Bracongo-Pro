import { getAuth } from "../factory";

export function getCurrentUserId() {
    const user = getAuth().currentUser;
    
    if(user) {
        return user.uid;
    }

    return null;
}

export function signOut() {
    return getAuth().signOut();
}

export function signUp(email, password) {
    return getAuth().createUserWithEmailAndPassword(email, password);
}

export function signIn(email, password) {
    return getAuth().signInWithEmailAndPassword(email, password);
}