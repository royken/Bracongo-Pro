import { 
    UI_START_LOADING, 
    UI_STOP_LOADING,
    FIRESTORE_LISTENER_INIT,
    FIRESTORE_LISTENER_SET,
    FIRESTORE_LISTENER_ERROR,
    FIRESTORE_LISTENER_UNSET,
    FIRESTORE_PAGINATOR_SET,
    FIRESTORE_PAGINATOR_UNSET,
    FIRESTORE_PAGINATOR_INIT,
    FIRESTORE_PAGINATOR_ERROR,  
    
} from './types';
import { paginate, onSnapshot } from '../../utils/firebase';
import { isArray } from 'lodash';

// -----------------------------------------------
// Loading action for Api request

export const uiStartLoading = () => {
    return {
        type: UI_START_LOADING
    };
} 

export const uiStopLoading = () => {
    return {
        type: UI_STOP_LOADING
    };
}

export const cancelRequest = () => dispatch => {
    dispatch(uiStopLoading());
}

// -----------------------------------------------

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

        dispatch({
            type: FIRESTORE_LISTENER_UNSET,
            value: {
                key: key
            }
        });
    }
}

export const unsetPaginatorListener = (query) => (dispatch, getState) => {

    const key = query.storeAs;
    const state = getState().firestorePaginator;
    const unsubscribes = state.hasOwnProperty(key) ? state[key].unsubscribes : null;

    if(isArray(unsubscribes) && unsubscribes.length > 0) {
        unsubscribes.forEach((unsubscribe) => {
            unsubscribe();
        });

        dispatch({
            type: FIRESTORE_PAGINATOR_UNSET,
            value: {
                key: key
            }
        });
    }
}


// -----------------------------------------------
// Firestore pagination listener
export const setPaginationListener = (query) => (dispatch, getState) => {

    const page = getState().firestorePaginator.page;
    if(page === 1){
        dispatch({
            type: FIRESTORE_PAGINATOR_INIT,
            value: {
                key: query.storeAs
            }
        });
    } 

    query.startAt = getState().firestorePaginator.pageKey;

    const unsubscribe = paginate(
        (querySnapShot) => {
            let data = [];    
            querySnapShot.docs.forEach((snap) => {
                const doc = snap.data();             
                data.push({ ...doc, id: snap.id });
            });

            const paginationField = isArray(query.orderBy) ? query.orderBy[0][0] : "";
            dispatch({
                type: FIRESTORE_PAGINATOR_SET,
                value: {
                    key: query.storeAs,
                    data: data,
                    unsubscribe: unsubscribe, 
                    paginationField: paginationField
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