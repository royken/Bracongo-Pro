import { 
    FIRESTORE_LISTENER_INIT,
    FIRESTORE_LISTENER_SET,
    FIRESTORE_LISTENER_ERROR,
    FIRESTORE_LISTENER_UNSET,
    FIRESTORE_PAGINATOR_SET,
    FIRESTORE_PAGINATOR_UNSET,
    FIRESTORE_PAGINATOR_INIT,
    FIRESTORE_PAGINATOR_ERROR,  
    
} from './types';
import { onSnapshot, PAGINATION_ITEM_PER_PAGE } from '../../utils/firebase';
import { isArray } from 'lodash';

// -----------------------------------------------
// Firestore Subscribe action
export const setListener = (query) => dispatch => {

    dispatch({
        type: FIRESTORE_LISTENER_INIT,
        value: {
            key: query.storeAs
        }
    });

    const unsubscribe = onSnapshot(
        (querySnapShot) => {
            let data;

            if(query.doc) {

                data = {...querySnapShot.data(), id: querySnapShot.id};

            } else {

                data = [];    
                querySnapShot.docs.forEach((snap) => {
                    const doc = snap.data();             
                    data.push({ ...doc, id: snap.id });
                });

            }

            dispatch({
                type: FIRESTORE_LISTENER_SET,
                value: {
                    key: query.storeAs,
                    data: data,
                    unsubscribe: unsubscribe
                }
            });
        },
        (error) => {
            dispatch({ 
                type: FIRESTORE_LISTENER_ERROR,
                value: {
                    key: query.storeAs
                }
            });
        },
        query
    );
}

export const unsetListener = (query) => (dispatch, getState) => {

    const key = query.storeAs;
    const state = getState().firestoreListener;
    const unsubscribe = state.hasOwnProperty(key) ? state[key].unsubscribe : null;

    if(unsubscribe) {
        unsubscribe();
    }

    dispatch({
        type: FIRESTORE_LISTENER_UNSET,
        value: {
            key: key
        }
    });
}

export const unsetPaginatorListener = (query) => (dispatch, getState) => {

    const key = query.storeAs;
    const state = getState().firestorePaginator;
    const unsubscribes = state.hasOwnProperty(key) ? state[key].unsubscribes : null;

    if(unsubscribes) {
        unsubscribes.forEach((unsubscribe) => {
            unsubscribe();
        });
    }

    dispatch({
        type: FIRESTORE_PAGINATOR_UNSET,
        value: {
            key: key
        }
    });
}


// -----------------------------------------------
// Firestore pagination listener
export const setPaginationListener = (query) => (dispatch, getState) => {

    if(!isArray(query.orderBy)) {
        throw new Error("Query must have a orderBy field.");
    }

    const key = query.storeAs;
    const state = getState().firestorePaginator;
    let lastDoc = null, canPaginate = false;

    if(state.hasOwnProperty(key)) {
        const meta = state[key];
        lastDoc = meta.lastDoc;
        canPaginate = meta.canPaginate;
    }
    
    if(lastDoc === null && canPaginate === false){
        dispatch({
            type: FIRESTORE_PAGINATOR_INIT,
            value: {
                key: key
            }
        });
    } 

    query.startAfter = lastDoc;
    query.limit = PAGINATION_ITEM_PER_PAGE;
    const paginationField = isArray(query.orderBy[0]) ? query.orderBy[0][0] : query.orderBy[0];

    const unsubscribe = onSnapshot(
        (querySnapShot) => {
            let dataIds = [];
            let dataObj = {};
            
            querySnapShot.docs.forEach((snap) => {
                dataObj[snap.id] = snap.data();           
                dataIds.push(snap.id);
            });

            dispatch({
                type: FIRESTORE_PAGINATOR_SET,
                value: {
                    key: query.storeAs,
                    dataIds: dataIds,
                    dataObj: dataObj,
                    paginationField,
                    unsubscribe: unsubscribe
                }
            });
        },
        (error) => { 
            dispatch({ 
                type: FIRESTORE_PAGINATOR_ERROR,
                value: {
                    key: query.storeAs
                }
            });
        },
        query
    ); 
}

export function getStatus(data) {
    if(typeof data === "object" && 
        data.hasOwnProperty("isLoaded") && 
        data.hasOwnProperty("isError") &&
        data.hasOwnProperty("isEmpty")
    ) {
        return {
            isLoaded: data.isLoaded, 
            isError: data.isError, 
            isEmpty: data.isEmpty
        };
    } 

    return {
        isLoaded: false, 
        isError: false, 
        isEmpty: true
    };
}