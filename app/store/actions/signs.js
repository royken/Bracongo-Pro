import { signInHelper } from "../../modules/sign/signHelper";
import { toast } from "../../utils/toast";
import { CONNEXION_PROBLEM_MSG } from "../../modules/core/constants";
import { GET_PROFILE, CLEAR_PROFILE } from "./types";
import { signOut as signOutWithFB } from "../../utils/firebase";
import { uiStartLoading, uiStopLoading } from "./uiLoading";

export const signIn = (numero, password) => dispatch => {
    dispatch(uiStartLoading());

    signInHelper(numero, password)
        .then((user) => {
            dispatch({
                type: GET_PROFILE,
                value: user
            });
            dispatch(uiStopLoading());
            toast.success("Vous êtes connectés !");
        })
        .catch((error) => {
            dispatch(uiStopLoading());
            
            if(error.code && error.code === 'auth/unknown'){
                toast.danger(CONNEXION_PROBLEM_MSG);
            } else {
                toast.danger("Login ou mot de passe incorrect !");
            }
        });
}

export const signOut = () => dispatch => {
    return new Promise((resolve, reject) => {
        signOutWithFB()
        .then(() => {  
            dispatch({
                type: CLEAR_PROFILE
            });

            resolve(true);
        })
        .catch((error) => {
            dispatch({
                type: CLEAR_PROFILE
            });

            resolve(false);
        });
    });
}