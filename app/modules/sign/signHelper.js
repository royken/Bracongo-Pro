import CryptoJS from 'crypto-js';
import { signInWithApi } from "../../api/bracongoApi";
import { signUpWithFB, signInWithFB, getDoc } from "../../utils/firebase";
import { SALEPOINTS } from "../../models/paths";
import { SECRET_CRYPTOJS_KEY } from '../../core/constants';

export function signInHelper(numero, password) {

    return new Promise((resolve, reject) => {
        signInWithApi(numero, password).then(
            (data) => { 
                const passwordHash = getPasswordHash(password);
                const email = "" + numero + "@bracongopro.cd"; 
                
                const salepoint = {
		            id: "",
                    numero: numero, 
                    raisonSociale: data.raisonSociale,
                    cover: 'undefined', 
                    description: '',
                    latitude: data.latitude,
                    longitude: data.longitude,
                    categorie: data.categorie,
                    ventes: data.ventes,
                    yaka: data.yaka,
                    top: false,
                    kin: data.kin,
                    password: encryptPass(password)
                };
                
                signUpWithFB(email, passwordHash).then(
                    (resp) => { 
                        const id = resp.user.uid;
                        salepoint.id = id;

                        getDoc(SALEPOINTS, id)
                        .set(salepoint)
                        .then(() => resolve({id: id, ...salepoint}))
                        .catch((error) => reject(error));
                    }
                ).catch((error) => {
                    if(error.code === "auth/email-already-in-use") {
                        signInWithFB(email, passwordHash).then(
                            (data) => {
                                const id = data.user.uid;
                                salepoint.id = id;

                                getDoc(SALEPOINTS, id)
                                .set(salepoint)
                                .then(() => resolve({id: id, ...salepoint}))
                                .catch((error) => reject(error));
                            }
                        ).catch((error) => reject(error));
                    } else {
                        reject(error);
                    }
                }); 
            }
        ).catch((error) => reject(error));
    });
}

export function encryptPass(password) {
    const wordArray = CryptoJS.enc.Utf8.parse(password + "-" + SECRET_CRYPTOJS_KEY);
    return CryptoJS.enc.Hex.stringify(wordArray);
}

export function decryptPass(encrypted) {
    
    const parsedWordArray = CryptoJS.enc.Hex.parse(encrypted);
    const parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
    
    return parsedStr.split("-")[0];
}

function getPasswordHash(numero) {

    let numeroStr = (new String(numero)).valueOf();
    let hash = 0;

    for (i = 0; i < numeroStr.length; i++) {
        hash = hash * 34 + parseInt(numeroStr[i]);
    }

    return CryptoJS.SHA256((new String(hash)).valueOf()).toString();
}
