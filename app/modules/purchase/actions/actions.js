import { decryptPass } from '../../sign/signHelper';
import { getPurchases, getActualMonthDiscountAndTurnover } from '../../../api/bracongoApi';
import { 
    GET_MONTH_PURCHASE, 
    GET_YEAR_PURCHASE,
    GET_DISCOUNT_AND_TURNOVER_BY_DATE
} from './types';
import { isEmpty } from 'lodash';
import { uiStartLoading, uiStopLoading } from '../../../core/actions/actions';
import { toast } from '../../../utils/toast';
import { CONNEXION_PROBLEM_MSG } from '../../../core/constants';

export const getMonthPurchases = (numero, encryptedPass) => (dispatch, getState) => {

    dispatch(uiStartLoading());

    if(!isEmpty(encryptedPass)) {
        const password = decryptPass(encryptedPass);
        
        getPurchases(numero, password, true).then(
            (data) => {
                const isLoading = getState().uiLoading.isLoading;

                if(isLoading) {
                    // ["bi" 0, bg: 0, pet: 0, ca: 0, products: []]
                    const data1 = data.data1;
                    const data2 = data.data2;

                    const dayOfMonth = (new Date()).getDate();
                    const purchases = [];
                    const products = [];

                    for(let i = 0; i < dayOfMonth; i++) {
                        purchases[i] = [0, 0, 0, 0, []]; 
                    }
                    
                    data1.forEach(element => {
                        switch (element.famille) {
                            case "BI":
                            case "BIERE":
                                purchases[element.jour - 1][0] += element.quantite;   
                                break;

                            case "BG":
                                purchases[element.jour - 1][1] += element.quantite;

                                break;

                            case "PET":
                                    purchases[element.jour - 1][2] += element.quantite;
                                break;
                            case "PEG":
                                purchases[element.jour - 1][2] += element.quantite;
                                break;

                            default:
                                break;
                        }
                        
                        purchases[element.jour - 1][3] += element.montant;
                        purchases[element.jour - 1][4].push({
                            name: element.produit,
                            amount: element.quantite
                        });
                        
                    });

                    data2.forEach(element => {
                        products.push({
                            name: element.nomProduit,
                            amount: element.quantite
                        });
                    });
                        
                    dispatch({
                        type: GET_MONTH_PURCHASE,
                        value: {
                            purchases: purchases,
                            products: products
                        }
                    });

                    dispatch(uiStopLoading());
                }
            }
        ).catch((error) => {
            dispatch(uiStopLoading());
            toast(CONNEXION_PROBLEM_MSG, "danger", 7000);
        });

    } else {
        dispatch(uiStopLoading());
    }
    
}


export const getYearPurchases = (numero, encryptedPass) => (dispatch, getState) => {
    
    dispatch(uiStartLoading());
    
    if(!isEmpty(encryptedPass)) {
        const password = decryptPass(encryptedPass);

        getPurchases(numero, password, false).then(
            (data) => {
                const isLoading = getState().uiLoading.isLoading;

                if(isLoading) {
                    const monthOfYear = (new Date()).getMonth() + 1;
                    // ["bi" 0, bg: 0, pet: 0, ca: 0]
                    const purchases = [];
                    for(let i = 0; i < monthOfYear; i++) {
                        purchases[i] = [0, 0, 0, 0]; 
                    }

                    data.forEach(element => {
                        switch (element.famille) {
                            case "BI":
                            case "BIERE":
                                purchases[element.jour - 1][0] += element.quantite;   
                                break;

                            case "BG":
                                purchases[element.jour - 1][1] += element.quantite;
                                break;

                            case "PET":
                            case "PEG":
                                purchases[element.jour - 1][2] += element.quantite;
                                break;

                            default:
                                break;
                        }
                        
                        purchases[element.jour - 1][3] += element.montant;
                        
                    });  

                    dispatch({
                        type: GET_YEAR_PURCHASE,
                        value: purchases
                    });
                    
                    dispatch(uiStopLoading());
                }
            }
        ).catch((error) => {
            dispatch(uiStopLoading());
            toast(CONNEXION_PROBLEM_MSG, "danger", 7000);
        });

    } else { 
        dispatch(uiStopLoading());
    }

}

export const getMonthDiscountAndTurnoverByDate = (numero, encryptedPass, year, month) => (dispatch, getState) => {

    dispatch(uiStartLoading());

    if(!isEmpty(encryptedPass)) {
        const password = decryptPass(encryptedPass);
        
        getActualMonthDiscountAndTurnover(numero, password, year, month)
        .then((data) => {
            const isLoading = getState().uiLoading.isLoading;
            
            if(isLoading) {
                dispatch({
                    type: GET_DISCOUNT_AND_TURNOVER_BY_DATE,
                    value: {
                        turnover: data.chiffreAffaire,
                        discount: data.remise
                    }
                });

                dispatch(uiStopLoading());
            }

        }).catch((error) => dispatch(uiStopLoading()));

    } else {
        dispatch(uiStopLoading());
    }

}