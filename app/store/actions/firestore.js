import { 
    FIRESTORE_LISTENER_INIT,
    FIRESTORE_LISTENER_SET,
    FIRESTORE_LISTENER_ERROR,
    FIRESTORE_LISTENER_UNSET,
    FIRESTORE_PAGINATOR_MORE,
    FIRESTORE_PAGINATOR_RESET,
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
        type: FIRESTORE_PAGINATOR_RESET,
        value: {
            key: key
        }
    });
}


// -----------------------------------------------
// Firestore pagination listener
export const setPaginationListener = (query, more = false) => (dispatch, getState) => {

    if(!isArray(query.orderBy)) {
        throw new Error("Query must have a orderBy field.");
    }

    const key = query.storeAs;
    const state = getState().firestorePaginator;
    
    query.limit = PAGINATION_ITEM_PER_PAGE;

    if(more === false) {
        const paginationField = isArray(query.orderBy[0]) ? query.orderBy[0][0] : query.orderBy[0];
        const unsubscribe = onSnapshot(
            (snapshot) => {
                const data = setDataSnapShot(snapshot);
                dispatch({
                    type: FIRESTORE_PAGINATOR_INIT,
                    value: {
                        key: key,
                        data: data,
                        unsubscribe: unsubscribe,
                        paginationField
                    }
                });
            },
            (error) => {
                dispatch({ 
                    type: FIRESTORE_PAGINATOR_ERROR,
                    value: {
                        key: key
                    }
                });
            },
            query
        );
    } else {
        if(!state.hasOwnProperty(key)) {
            console.log("You must call first setPaginationListener function with condition more === false !");
            return;
        }

        const { lastDoc, canPaginate, lastSnapId } = state[key];
        if(canPaginate === false) {
            return;
        }

        query.startAfter = lastDoc;
        const currentLastSnapId = lastSnapId + 1;

        const unsubscribe = onSnapshot(
            (snapshot) => {
                const data = setDataSnapShot(snapshot);
                dispatch({
                    type: FIRESTORE_PAGINATOR_MORE,
                    value: {
                        key: key,
                        data: data,
                        unsubscribe: unsubscribe,
                        currentLastSnapId: currentLastSnapId
                    }
                });
            },
            (error) => {
                dispatch({ 
                    type: FIRESTORE_PAGINATOR_ERROR,
                    value: {
                        key: key
                    }
                });
            },
            query
        );
    }
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

export function getData(dataState) {
    let data = [];

    if(dataState.hasOwnProperty("allIds")) {
        const { byId, allIds, lastSnapId } = dataState;
        let listenerId, next;
        
        for(let i = 1; i <= lastSnapId; i++) {
            listenerId = "L" + i;
            next = allIds[listenerId].map((id) => byId[id]);
            data = data.concat(next);
        }
    } 

    return data;
}

function setDataSnapShot(snapshot) {
    let data = {
        added: {dataObj: {}, dataIds: []},
        updated: {dataObj: {}},
        deleted: {dataIds: []}
    };

    snapshot.docChanges.forEach((change) => {
        if(change.type === 'added') {
            data.added.dataObj[change.doc.id] = {id: change.doc.id, ...change.doc.data()}; 
            data.added.dataIds.push(change.doc.id);
        }

        if(change.type === 'modified') {
            data.updated.dataObj[change.doc.id] = {id: change.doc.id, ...change.doc.data()};
        }

        if(change.type === 'removed') {
            data.deleted.dataIds.push(change.doc.id);
        }
    });

    return data;
}