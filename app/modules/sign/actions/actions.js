import { signInHelper } from "../signHelper";
import { uiStartLoading, uiStopLoading } from '../../../core/actions/actions';
import { toast } from "../../../utils/toast";
import { CONNEXION_PROBLEM_MSG } from "../../../core/constants";
import { GET_PROFILE, CLEAR_PROFILE } from "../../profile/actions/types";
import { signOutWithFB } from "../../../utils/firebase";

export const signIn = (numero, password) => dispatch => {
    dispatch(uiStartLoading());

    signInHelper(numero, password)
        .then((user) => {
            dispatch({
                type: GET_PROFILE,
                value: user
            });
            dispatch(uiStopLoading());
            toast("Vous êtes connectés !", "success", 5000);
        })
        .catch((error) => {
            dispatch(uiStopLoading());
            
            if(error.code && error.code === 'auth/unknown'){
                toast(CONNEXION_PROBLEM_MSG, "danger", 7000);
            } else {
                toast("Login ou mot de passe incorrect !", "danger", 7000);
            }
        });
}

export const signOut = () => dispatch => {
    signOutWithFB()
    .then(() => {  
        dispatch({
            type: CLEAR_PROFILE
        });
    })
    .catch((error) => {
        dispatch({
            type: CLEAR_PROFILE
        });
    });
}