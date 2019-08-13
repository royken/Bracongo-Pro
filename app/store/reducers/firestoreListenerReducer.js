import { 
    FIRESTORE_LISTENER_INIT, 
    FIRESTORE_LISTENER_SET, 
    FIRESTORE_LISTENER_UNSET, 
    FIRESTORE_LISTENER_ERROR 
} from "../actions/types";
import { isEmpty } from 'lodash';

const initialState = {};

const init = { 
    data: null,
    unsubscribe: null,
    isLoaded: false,
    isError: false,
    isEmpty: true 
};

export default function (state = initialState, action) {
    let newState;
    let key;

    switch (action.type) {
        case FIRESTORE_LISTENER_INIT:
            key = action.value.key;

            if(state.hasOwnProperty(key)) {
                newState = {
                    ...state,
                    [key]: {
                        ...state[key],
                        isLoaded: false,
                        isError: false
                    }
                };
            } else {       
                newState = {
                    ...state,
                    [key]: {...init}
                };
            }
            break;

        case FIRESTORE_LISTENER_SET:
            newState = set(state, action);
            break;

        case FIRESTORE_LISTENER_UNSET:
            newState = unset(state, action);
            break;

        case FIRESTORE_LISTENER_ERROR:
            key = action.value.key;

            newState = {
                ...state,
                [key]: {
                    ...state[key],
                    isLoaded: true,
                    isError: true,
                    isEmpty: state.hasOwnProperty(key) ? 
                        isEmpty(state[key].data) : true
                }
            };
            break;

        default:
            newState = state;
            break;
    }

    return newState || state;

} 

function set(state, action) {
    const key = action.value.key;
    
    const { data, unsubscribe } = action.value;

    if(state.hasOwnProperty(key)) {
        return {
            ...state,
            [key]: {
                ...state[key],
                data: data,
                unsubscribe: unsubscribe, 
                isLoaded: true,
                isError: false,
                isEmpty: data === null
            }
        };
    } else {
        return {
            ...state,
            [key]: {
                data: data,
                unsubscribe: unsubscribe, 
                isLoaded: true,
                isError: false,
                isEmpty: data === null
            }
        };
    }
}

function unset(state, action) {
    const key = action.value.key;

    return {
        ...state,
        [key]: {
            ...state[key],
            ...init
        }
    };
}