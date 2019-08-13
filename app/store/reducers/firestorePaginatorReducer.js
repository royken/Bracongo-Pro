import { 
    FIRESTORE_PAGINATOR_INIT, 
    FIRESTORE_PAGINATOR_SET, 
    FIRESTORE_PAGINATOR_UNSET, 
    FIRESTORE_PAGINATOR_ERROR 
} from "../actions/types";
import { PAGINATION_ITEM_PER_PAGE } from "../../utils/firebase";
import { isEmpty } from 'lodash';
import { deDuplicate } from "../../utils/helper";

const initialState = {};

const init = { 
    byId: {},
    allIds: [],
    canPaginate: false,
    lastDoc: null,
    unsubscribes: [],
    isLoaded: false,
    isError: false,
    isEmpty: true 
};

export default function (state = initialState, action) {
    let newState;
    let key;

    switch (action.type) {
        case FIRESTORE_PAGINATOR_INIT:
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

        case FIRESTORE_PAGINATOR_SET:
            newState = set(state, action);
            break;

        case FIRESTORE_PAGINATOR_UNSET:
            newState = unset(state, action);
            break;

        case FIRESTORE_PAGINATOR_ERROR:
            key = action.value.key;

            newState = {
                ...state,
                [key]: {
                    ...state[key],
                    isLoaded: true,
                    isError: true,
                    isEmpty: isEmpty(state[key].allIds)
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
    const { key, dataIds, dataObj, unsubscribe, paginationField } = action.value;
    let newAllIds, newById, newUnsubscribes, canPaginate, lastDoc, lastIndex;

    if(!state.hasOwnProperty(key) || state[key].allIds.length === 0) {
        newAllIds = dataIds;
        newById = dataObj;
        newUnsubscribes = [].concat(unsubscribe);
    } else {
        newAllIds = deDuplicate(state[key].allIds.concat(dataIds));
        newById = {
            ...state[key].byId,
            ...dataObj
        };
        newUnsubscribes = deDuplicate(state[key].unsubscribes.concat(unsubscribe));
    }

    canPaginate = dataIds.length > 0 && (newAllIds.length % PAGINATION_ITEM_PER_PAGE === 0)
    lastIndex = Math.trunc(newAllIds.length / PAGINATION_ITEM_PER_PAGE) * PAGINATION_ITEM_PER_PAGE - 1;
    lastDoc = lastIndex > 0 ? newById[newAllIds[lastIndex]][paginationField] : null;

    return {
        ...state,
        [key]: {
            ...state[key],
            byId: newById,
            allIds: newAllIds,
            canPaginate: canPaginate,
            lastDoc: lastDoc,
            unsubscribes: newUnsubscribes,
            isLoaded: true,
            isError: false,
            isEmpty: newAllIds.length === 0
        }
    }
}

function unset(state, action) {
    const key = action.value.key;
    
    if(state.hasOwnProperty(key)) {
        return {
            ...state,
            [key]: {
                ...state[key],
                ...init
            }
        };  
    } else {
        return state;
    }
}