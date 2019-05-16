import { decryptPass } from "../../sign/signHelper";
import { GET_DISCOUNT_AND_TURNOVER } from "./types";
import { getActualMonthDiscountAndTurnover } from "../../../api/bracongoApi";
import { isEmpty } from 'lodash';
import { uiStartLoading, uiStopLoading } from '../../../core/actions/actions';

export const getDiscountAndTurnover = (numero, encryptedPass) => dispatch => {

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