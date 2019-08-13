import { GET_DISCOUNT_AND_TURNOVER, GET_PROFILE, UNSET_PROFILE_LISTENER, SET_PLAYERID } from "./types";
import { getActualMonthDiscountAndTurnover } from "../../api/bracongoApi";
import { isEmpty } from 'lodash';
import { uiStartLoading, uiStopLoading } from './uiLoading';
import { onSnapshot } from "../../utils/firebase";
import { SALEPOINTS } from "../../models/paths";
import { decryptPass } from "../../utils/cryptoPass";

export const setProfileListener = () => (dispatch, getState) => {
    
    const uid = getState().profile.id;
    const query = {collection: SALEPOINTS, doc: uid};

    const unsubscribe = onSnapshot(
        (resp) => {
            const user = resp.data();

            dispatch({
                type: GET_PROFILE,
                value: {...user, unsubscribe: unsubscribe, id: resp.id}
            });

        },
        (error) => {},
        query
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
    }

    dispatch({
        type: UNSET_PROFILE_LISTENER
    });
}

export const getDiscountAndTurnover = (numero, encryptedPass) => (dispatch) => {
    
    dispatch(uiStartLoading());
    
    if(!isEmpty(encryptedPass)) {
        const password = decryptPass(encryptedPass);
        
        getActualMonthDiscountAndTurnover(numero, password, null, null, false)
        .then((data) => {
            
            dispatch({
                type: GET_DISCOUNT_AND_TURNOVER,
                value: {
                    turnover: data.data1.chiffreAffaire,
                    discount: data.data1.remise
                }
            });

            dispatch(uiStopLoading());

        }).catch((error) => dispatch(uiStopLoading()));

    } else {
        dispatch(uiStopLoading());
    }
    
} 