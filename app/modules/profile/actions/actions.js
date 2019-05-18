import { decryptPass } from "../../sign/signHelper";
import { GET_DISCOUNT_AND_TURNOVER, GET_PROFILE } from "./types";
import { getActualMonthDiscountAndTurnover } from "../../../api/bracongoApi";
import { isEmpty } from 'lodash';
import { uiStartLoading, uiStopLoading, setSubscriber } from '../../../core/actions/actions';
import { getDoc } from "../../../utils/firebase";
import { SALEPOINTS } from "../../../models/paths";
import { PROFILE_KEY } from "../../../core/actions/types";

export const getProfile = () => (dispatch, getState) => {
    
    const uid = getState().profile.id;

    const unsubscribe = getDoc(SALEPOINTS, uid).onSnapshot(
        (resp) => {
            const user = resp.data();

            dispatch({
                type: GET_PROFILE,
                value: {...user, id: resp.id}
            });

            dispatch(setSubscriber(unsubscribe, PROFILE_KEY));
        },
        (error) => {}
    );
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