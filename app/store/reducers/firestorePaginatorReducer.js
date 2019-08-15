import { 
    FIRESTORE_PAGINATOR_INIT, 
    FIRESTORE_PAGINATOR_MORE, 
    FIRESTORE_PAGINATOR_RESET, 
    FIRESTORE_PAGINATOR_ERROR 
} from "../actions/types";
import { PAGINATION_ITEM_PER_PAGE } from "../../utils/firebase";
import { isEmpty } from 'lodash';
import { deDuplicate } from "../../utils/helper";

const initialState = {};

const init = { 
    byId: {},
    allIds: {},
    canPaginate: false,
    lastDoc: null,
    lastSnapId: 0,
    paginationField: "id",
    unsubscribes: [],
    isLoaded: false,
    isError: false,
    isEmpty: true 
};

export default function (state = initialState, action) {
    let newState;

    switch (action.type) {
        case FIRESTORE_PAGINATOR_INIT:
            newState = first(state, action);
            break;

        case FIRESTORE_PAGINATOR_MORE:
            newState = more(state, action);
            break;

        case FIRESTORE_PAGINATOR_RESET:
            newState = reset(state, action);
            break;

        case FIRESTORE_PAGINATOR_ERROR:
            newState = setError(state, action);
            break;

        default:
            newState = state;
            break;
    }

    return newState || state;
} 

function first(state, action) {
    const { key, data, unsubscribe, paginationField } = action.value;
    let newState = state;
    const listenerId = "L1";

    if(!state.hasOwnProperty(key)) {
        newState = {
            ...state,
            [key]: {
                ...state,
                ...init,
                allIds: {
                    [listenerId]: []
                }
            }
        };
    }

    if(!newState[key].allIds.hasOwnProperty(listenerId)) {
        newState = {
            ...newState,
            [key]: {
                ...newState[key],
                allIds: {
                    ...newState[key].allIds,
                    [listenerId]: []
                }
            }
        };
    }

    if(data.added.dataIds.length > 0) {
        newState = {
            ...newState,
            [key]: {
                ...newState[key],
                byId: {
                    ...newState[key].byId,
                    ...data.added.dataObj
                },
                allIds: {
                    ...newState[key].allIds,
                    [listenerId]: data.added.dataIds.concat(newState[key].allIds[listenerId])
                }
            }
        }; 
    }
    
    if(data.updated.dataObj !== {}) {
        newState = {
            ...newState,
            [key]: {
                ...newState[key],
                byId: {
                    ...newState[key].byId,
                    ...data.updated.dataObj
                }
            }
        };
    }

    if(data.deleted.dataIds.length > 0) {
        newState = {
            ...newState,
            [key]: {
                ...newState[key],
                allIds: {
                    ...newState[key].allIds,
                    [listenerId]: newState[key].allIds[listenerId].filter((id) => !data.deleted.dataIds.includes(id))
                }
            }
        };
        
        let id;
        for(id of data.deleted.dataIds) {
            delete newState[key].byId[id];
        }
    }

    let newLastSnapId, newLastDoc, canPaginate;
    if(1 < newState[key].lastSnapId) {
        canPaginate = newState[key].canPaginate;
        newLastDoc = newState[key].lastDoc;
        newLastSnapId = newState[key].lastSnapId;
    } else {
        const dataIds = newState[key].allIds[listenerId];
        const dataObj = newState[key].byId;
        canPaginate = dataIds.length === PAGINATION_ITEM_PER_PAGE;
        newLastDoc = canPaginate ? dataObj[dataIds[dataIds.length - 1]][paginationField] : newState[key].lastDoc;
        newLastSnapId = 1;
    }

    return {
        ...newState,
        [key]: {
            ...newState[key],
            canPaginate: canPaginate,
            lastDoc: newLastDoc,
            lastSnapId: newLastSnapId,
            paginationField: paginationField,
            unsubscribes: deDuplicate(newState[key].unsubscribes.concat(unsubscribe)),
            isLoaded: true,
            isError: false,
            isEmpty: isEmpty(newState[key].byId)
        }
    };
}

function more(state, action) {
    let newState = state;
    const { key, data, unsubscribe, currentLastSnapId } = action.value;
    const { paginationField, lastSnapId } = state[key];
    
    const listenerId = "L" + currentLastSnapId;

    if(!state[key].allIds.hasOwnProperty(listenerId)) {
        newState = {
            ...state,
            [key]: {
                ...state[key],
                allIds: {
                    ...state[key].allIds,
                    [listenerId]: []
                }
            }
        };
    }

    if(data.added.dataIds.length > 0) {
        newState = {
            ...newState,
            [key]: {
                ...newState[key],
                byId: {
                    ...newState[key].byId,
                    ...data.added.dataObj
                },
                allIds: {
                    ...newState[key].allIds,
                    [listenerId]: data.added.dataIds.concat(newState[key].allIds[listenerId])
                }
            }
        }; 
    }
    
    if(data.updated.dataObj !== {}) {
        newState = {
            ...newState,
            [key]: {
                ...newState[key],
                byId: {
                    ...newState[key].byId,
                    ...data.updated.dataObj
                }
            }
        };
    }

    if(data.deleted.dataIds.length > 0) {
        newState = {
            ...newState,
            [key]: {
                ...newState[key],
                allIds: {
                    ...newState[key].allIds,
                    [listenerId]: newState[key].allIds[listenerId].filter((id) => !data.deleted.dataIds.includes(id))
                }
            }
        };
        
        let id;
        for(id of data.deleted.dataIds) {
            delete newState[key].byId[id];
        }
    }

    let newLastSnapId, newLastDoc, canPaginate;
    if(currentLastSnapId <= lastSnapId) {
        canPaginate = newState[key].canPaginate;
        newLastDoc = newState[key].lastDoc;
        newLastSnapId = lastSnapId;
    } else {
        const dataIds = newState[key].allIds[listenerId];
        const dataObj = newState[key].byId;
        canPaginate = dataIds.length === PAGINATION_ITEM_PER_PAGE;
        newLastDoc = canPaginate ? dataObj[dataIds[dataIds.length - 1]][paginationField] : newState[key].lastDoc;
        newLastSnapId = currentLastSnapId;
    }

    return {
        ...newState,
        [key]: {
            ...newState[key],
            canPaginate: canPaginate,
            lastDoc: newLastDoc,
            lastSnapId: newLastSnapId,
            unsubscribes: deDuplicate(newState[key].unsubscribes.concat(unsubscribe)),
            isLoaded: true,
            isError: false,
            isEmpty: isEmpty(newState[key].byId)
        }
    };
}

function reset(state, action) {
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

function setError(state, action) {
    const key = action.value.key;

    return {
        ...state,
        [key]: {
            ...state[key],
            isLoaded: true,
            isError: true,
            isEmpty: isEmpty(state[key].byId)
        }
    };
}