import { UPDATE_CART, INIT_CART } from "./types";
import { processOrder } from "../../../api/bracongoApi";
import { toast } from "../../../utils/toast";
import { uiStartLoading, uiStopLoading } from "../../../core/actions/actions";

export const updateCart = (unitPrice, amount, name, code, didIncreased = true) => (dispatch, getState) => {

    const details = getState().orders.details;

    if(didIncreased === true) {
        dispatch({
            type: UPDATE_CART,
            value: {
                total: details.total + (unitPrice * 1), 
                amount: details.amount + 1 ,  
                code: code, 
                name: name, 
                quantity: amount
            }
        });
    } else {
        dispatch({
            type: UPDATE_CART,
            value: {
                total: details.total - (unitPrice * 1), 
                amount: details.amount - 1 ,  
                code: code, 
                name: name, 
                quantity: amount
            }
        });
    }

}

export const initCart = () => dispatch => {
    dispatch({
        type: INIT_CART
    });
}

export const postCart = (numero, cart) => (dispatch, getState) => {
    dispatch(uiStartLoading());

    return new Promise((resolve, reject) => {
        const items = Object.keys(cart).map(function(key) {
            return cart[key];
        });
        
        processOrder(numero, items)
        .then(() => {
            const isLoading = getState().uiLoading.isLoading;
            if(isLoading) {
                dispatch(uiStopLoading());
                resolve();
            }
        })
        .catch((error) => {
            dispatch(uiStopLoading());
            toast("Problème de connexion", "danger", 5000);
            reject(error);
        });
    });
}