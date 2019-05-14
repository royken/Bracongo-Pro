import { GET_DISCOUNT_AND_TURNOVER, GET_PROFILE, CLEAR_PROFILE } from "../actions/types";

const initialState = {
    id: null,
    categorie: null,
    cover: null,
    description: null,
    latitude: null,
    longitude: null,
    numero: null,
    password: null,
    ventes: true,
    turnover: 0,
    discount: 0,
    isLoaded: false
};

export default function(state = initialState, action) {
    let newState;

    switch(action.type) {
        case GET_PROFILE:
            const { 
                id,
                categorie, 
                cover, 
                description, 
                latitude, 
                longitude, 
                numero, 
                password, 
                ventes 
            } = action.value;

            newState = {
                ...state,
                id: id,
                categorie: categorie, 
                cover: cover, 
                description: description, 
                latitude: latitude, 
                longitude: longitude, 
                numero: numero, 
                password: password, 
                ventes: ventes,
                isLoaded: true
            };
            break;
             
        case GET_DISCOUNT_AND_TURNOVER:
            newState = {  
                ...state,
                turnover: action.value.turnover,
                discount: action.value.discount
            };
            break;
        
        case CLEAR_PROFILE:    
            newState = {
                ...state,
                ...initialState
            }
            break;

        default:
            newState = state;    
            break; 
    }

    return newState || state;
} 