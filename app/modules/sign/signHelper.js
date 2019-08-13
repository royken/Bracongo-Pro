import { signInWithApi } from "../../api/bracongoApi";
import { signIn, signUp, set } from "../../utils/firebase";
import { SALEPOINTS } from "../../models/paths";
import { getPasswordHash, encryptPass } from "../../utils/cryptoPass";

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
                
                signUp(email, passwordHash).then(
                    (resp) => { 
                        const id = resp.user.uid;
                        salepoint.id = id;

                        const query = {collection: SALEPOINTS, doc: id}
                        set(query, salepoint)
                        .then(() => resolve({id: id, ...salepoint}))
                        .catch((error) => reject(error));
                    }
                ).catch((error) => {
                    if(error.code === "auth/email-already-in-use") {
                        signIn(email, passwordHash).then(
                            (data) => {
                                const id = data.user.uid;
                                salepoint.id = id;

                                const query = {collection: SALEPOINTS, doc: id}
                                set(query, salepoint)
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