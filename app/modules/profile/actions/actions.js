import { decryptPass } from "../../sign/signHelper";
import { GET_DISCOUNT_AND_TURNOVER, GET_PROFILE, UNSET_PROFILE_LISTENER, SET_PLAYERID } from "./types";
import { getActualMonthDiscountAndTurnover } from "../../../api/bracongoApi";
import { isEmpty } from 'lodash';
import { uiStartLoading, uiStopLoading } from '../../../core/actions/actions';
import { getDoc } from "../../../utils/firebase";
import { SALEPOINTS } from "../../../models/paths";

export const setProfileListener = () => (dispatch, getState) => {
    
    const uid = getState().profile.id;

    const unsubscribe = getDoc(SALEPOINTS, uid).onSnapshot(
        (resp) => {
            const user = resp.data();

            dispatch({
                type: GET_PROFILE,
                value: {...user, unsubscribe: unsubscribe, id: resp.id}
            });

        },
        (error) => {}
    );
}

export const setPlayerId = (playerId) => (dispatch) => {
    dispatch({
        type: SET_PLAYERID,
        value: playerId
    });
}

export const unsetProfileListener = () => (dispatch, getState) => {
    const unsubscribe = getState().profile.unsubscribe;

    if(unsubscribe) {
        unsubscribe();
        
        dispatch({
            type: UNSET_PROFILE_LISTENER
        });
    }
}

export const getDiscountAndTurnover = (numero, encryptedPass) => (dispatch) => {
    
    dispatch(uiStartLoading());
    
    if(!isEmpty(encryptedPass)) {
        const password = decryptPass(encryptedPass);
        
        getActualMonthDiscountAndTurnover(numero, password)
        .then((data) => {
            
            dispatch({
                type: GET_DISCOUNT_AND_TURNOVER,
                value: {
                    turnover: data.chiffreAffaire,
                    discount: data.remise
                }
            });

            dispatch(uiStopLoading());

        }).catch((error) => dispatch(uiStopLoading()));

    } else {
        dispatch(uiStopLoading());
    }
    
} 