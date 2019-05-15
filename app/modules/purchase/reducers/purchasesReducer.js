import { 
    GET_MONTH_PURCHASE, 
    GET_YEAR_PURCHASE
} from "../actions/types";

const initialState = {
    purchasesMonth: [],
    purchasesYear: [],
    products: []
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
        
        default:
            newState = state;
            break;
    }

    return newState || state;
}