import { isString, isEmpty} from 'lodash';
import { getStorage } from "../factory";
import uuid from 'uuid';

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
    const random = uuid();

    return new Promise((resolve, reject) => {
        getStorage().ref().child(storagePath + "/" + random + ".png").putFile(uri).then(
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