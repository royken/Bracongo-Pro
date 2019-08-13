import { 
    GET_MONTH_PURCHASE, 
    GET_YEAR_PURCHASE,
    GET_DISCOUNT_AND_TURNOVER_BY_DATE,
    GET_ANNUAL_DISCOUNTS
} from "../actions/types";

const initialState = {
    purchasesMonth: [],
    purchasesYear: [],
    products: [],
    turnover: 0,
    discount: 0,
    discounts: []
};

export default function(state = initialState, action) {
    let newState; 
    
    switch (action.type) {
        case GET_MONTH_PURCHASE:
            newState = {
                ...state,
                purchasesMonth: action.value.purchases,
                products: action.value.products
            }    
            break;
        
        case GET_YEAR_PURCHASE:
            newState = {
                ...state,
                purchasesYear: action.value
            }    
            break;    

        case GET_DISCOUNT_AND_TURNOVER_BY_DATE:
            newState = {  
                ...state,
                turnover: action.value.turnover,
                discount: action.value.discount
            };
            break;
        
        case GET_ANNUAL_DISCOUNTS:
            newState = {
                ...state,
                discounts: action.value
            };
            break;    
            
        default:
            newState = state;
            break;
    }

    return newState || state;
}