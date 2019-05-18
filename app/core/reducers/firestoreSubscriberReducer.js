import { SET_FIRESTORE_SUBSCRIBER, UNSET_FIRESTORE_SUBSCRIBER } from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
    let newState;
    let key;

    switch (action.type) {
        case SET_FIRESTORE_SUBSCRIBER:
            const unsubscribe = action.value.unsubscribe;
            key = action.value.key;

            if(state.hasOwnProperty(key)) {
                newState = {
                    ...state,
                    [key]: {
                        ...state[key],
                        unsubscribe: unsubscribe
                    }
                };
            } else {
                newState = {
                    ...state,
                    [key]: {
                        unsubscribe: unsubscribe
                    }
                };
            }
            break;

        case UNSET_FIRESTORE_SUBSCRIBER:
            key = action.value;
            
            if(state.hasOwnProperty(key)) {
                newState = {
                    ...state,
                    [key]: {
                        ...state[key],
                        unsubscribe: null
                    } 
                };
            }
            break;

        default:
            newState = state;
            break;
    }

    return newState || state;

} 