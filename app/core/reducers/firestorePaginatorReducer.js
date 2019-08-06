import { 
    FIRESTORE_PAGINATOR_INIT, 
    FIRESTORE_PAGINATOR_SET, 
    FIRESTORE_PAGINATOR_UNSET, 
    FIRESTORE_PAGINATOR_ERROR 
} from "../actions/types";
import { PAGINATION_ITEM_PER_PAGE } from "../../utils/firebase";
import { isEmpty } from 'lodash';

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
        const dataLength = data.length;
        const totalDataLength = state[key].data.length + dataLength;
        const pageNumber = dataLength === 0 ? state[key].page : Math.ceil(totalDataLength / PAGINATION_ITEM_PER_PAGE);
        const willPaginate = dataLength === PAGINATION_ITEM_PER_PAGE

        return {
            ...state,
            [key]: {
                ...state[key],
                page: pageNumber,
                willPaginate: willPaginate,
                data: state[key].data.concat(data),                
                pageKey: dataLength > 0 ? data[dataLength - 1][paginationField] : state[key].pageKey,
                unsubscribes: state[key].unsubscribes.concat(unsubscribe),
                isLoaded: true,
                isError: false,
                isEmpty: totalDataLength === 0
            }
        };
    } else {
        const { data, unsubscribe, paginationField } = action.value;
        const dataLength = data.length;
        const willPaginate = dataLength === PAGINATION_ITEM_PER_PAGE;

        return {
            ...state,
            [key]: {
                willPaginate: willPaginate,
                data: [].concat(data),                
                pageKey: dataLength > 0 ? data[dataLength - 1][paginationField] : null,
                unsubscribes: [].concat(unsubscribe), 
                isLoaded: true,
                isError: false,
                isEmpty: dataLength === 0
            }
        };
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