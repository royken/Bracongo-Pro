import { 
    GET_DISCOUNT_AND_TURNOVER, 
    GET_PROFILE, 
    CLEAR_PROFILE,
    UNSET_PROFILE_LISTENER
} from "../actions/types";
import DeviceInfo from 'react-native-device-info';

const initialState = {
    id: null,
    raisonSociale: null,
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
    top: false,
    uuid: DeviceInfo.getUniqueID(),
    unsubscribe: null,
    isLoaded: false
};

export default function(state = initialState, action) {
    let newState;

    switch(action.type) {
        case GET_PROFILE:
            const { 
                id,
                raisonSociale,
                categorie, 
                cover, 
                description, 
                latitude, 
                longitude, 
                numero, 
                password, 
                ventes,
                top,
                unsubscribe 
            } = action.value;

            newState = {
                ...state,
                id: id,
                raisonSociale: raisonSociale,
                categorie: categorie, 
                cover: cover, 
                description: description, 
                latitude: latitude, 
                longitude: longitude, 
                numero: numero, 
                password: password, 
                ventes: ventes,
                top: top,
                unsubscribe: unsubscribe,
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
        
        case UNSET_PROFILE_LISTENER:
            newState = {
                ...state,
                unsubscribe: null
            }
            break;
                
        default:
            newState = state;    
            break; 
    }

    return newState || state;
} 