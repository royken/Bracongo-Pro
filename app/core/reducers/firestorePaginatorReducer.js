import { 
    FIRESTORE_PAGINATOR_INIT, 
    FIRESTORE_PAGINATOR_SET, 
    FIRESTORE_PAGINATOR_UNSET, 
    FIRESTORE_PAGINATOR_ERROR 
} from "../actions/types";
import { PAGINATION_ITEM_PER_PAGE } from "../../utils/firebase";
import { isArray, isEmpty } from 'lodash';

const initialState = {};

const init = { 
    data: [],
    page: 1,
    willPaginate: false,
    pageKey: null,
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

    if(state.hasOwnProperty(key)) {
        const { data, unsubscribe, paginationField } = action.value;
        const dataLength = state[key].data.length + data.length;
        const pageNumber = dataLength === 0 ? 1 :
                            Math.ceil(dataLength / PAGINATION_ITEM_PER_PAGE);
        const willPaginate = dataLength >= pageNumber * PAGINATION_ITEM_PER_PAGE

        return {
            ...state,
            [key]: {
                ...state[key],
                page: pageNumber,
                willPaginate: willPaginate,
                data: pageNumber === 1 ? [].concat(data) : state[key].data.concat(data),                
                pageKey: isArray(data) && data.length > 0 ? data[data.length - 1][paginationField] : null,
                unsubscribes: isArray(state[key].unsubscribes) ? 
                    [ ...state[key].unsubscribes, unsubscribe] : [].push(unsubscribe),
                isLoaded: true,
                isError: false,
                isEmpty: isEmpty(state[key].data) && isEmpty(data)
            }
        };
    } else {
        const { data, unsubscribe, paginationField } = action.value;
        const dataLength = data.length;
        const pageNumber = dataLength === 0 ? 1 :
                            Math.ceil(dataLength / PAGINATION_ITEM_PER_PAGE);
        const willPaginate = dataLength >= pageNumber * PAGINATION_ITEM_PER_PAGE

        return {
            ...state,
            [key]: {
                page: pageNumber,
                willPaginate: willPaginate,
                data: [].concat(data),                
                pageKey: isArray(data) && data.length > 0 ? data[data.length - 1][paginationField] : null,
                unsubscribes: [].push(unsubscribe), 
                isLoaded: true,
                isError: false,
                isEmpty: dataLength === 0
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
            unsubscribes: [],
            isEmpty: state[key].data.length === 0
        }
    };
}