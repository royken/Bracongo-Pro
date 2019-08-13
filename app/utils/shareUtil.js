import { PermissionsAndroid, Platform } from 'react-native';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import { isEmpty } from 'lodash';


/*********************************/
/****    React native share   ***/
/*******************************/

function processShareToSN(options) {
    let filePath = null;

    return new Promise((resolve, reject) => {
        RNFetchBlob.config({
            fileCache : true,
            appendExt: 'png'
        })
        .fetch('GET', options.url)
        .then((res) => {
            filePath = res.path();
            return res.readFile('base64');
        })
        .then((base64Data) => { 
            const uri = `data:image/png;base64,` + base64Data;
            options.url = uri;
            
            Share.open(options).then(
                () => {
                    RNFetchBlob.fs.
                    unlink(filePath)
                    .then(() => resolve(true))
                    .catch((err) => resolve(true));
                }
            ).catch((error) => reject(error));
    
        })
        .catch((error) => reject({code: "error-network"}));
    });
    
}

export function shareToSN(options) {

    if(typeof options !== "object") {
        throw new Error("Parameter options must be an object.");
    }

    if(!isEmpty(options.url)) {

        if(Platform.OS === "android") {
            
            return new Promise((resolve, reject) => {
                PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                    ]
                ).then((granted) => { 
                    if (granted["android.permission.WRITE_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED
                        && 
                        granted["android.permission.READ_EXTERNAL_STORAGE"]  === PermissionsAndroid.RESULTS.GRANTED
                    ) {
                        processShareToSN(options)
                        .then((res) => resolve(res))
                        .catch((error) => reject(error));
                    } else {
                        reject(false);
                    }
                })
                .catch((error) => {reject(error)});
            });

        } else {
            return processShareToSN(options);
        }
    } else {
        return Share.open(options);
    }
}