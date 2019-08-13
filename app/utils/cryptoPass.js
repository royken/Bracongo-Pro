import CryptoJS from 'crypto-js';

// Secret key for CryptoJS Library : Beware
const SECRET_CRYPTOJS_KEY = "lung6Ie1aiTh2che";

export function encryptPass(password) {
    const wordArray = CryptoJS.enc.Utf8.parse(password + "-" + SECRET_CRYPTOJS_KEY);
    return CryptoJS.enc.Hex.stringify(wordArray);
}

export function decryptPass(encrypted) {
    
    const parsedWordArray = CryptoJS.enc.Hex.parse(encrypted);
    const parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
    
    return parsedStr.split("-")[0];
}

export function getPasswordHash(numero) {

    let numeroStr = (new String(numero)).valueOf();
    let hash = 0;

    for (i = 0; i < numeroStr.length; i++) {
        hash = hash * 34 + parseInt(numeroStr[i]);
    }

    return CryptoJS.SHA256((new String(hash)).valueOf()).toString();
}