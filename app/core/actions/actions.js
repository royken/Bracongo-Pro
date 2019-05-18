import { 
    UI_START_LOADING, 
    UI_STOP_LOADING, 
    SET_FIRESTORE_SUBSCRIBER, 
    UNSET_FIRESTORE_SUBSCRIBER 
} from './types';

// -----------------------------------------------
// Loading action

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
export const setSubscriber = (subscriberId, subscriberKey) => {
    return {
        type: SET_FIRESTORE_SUBSCRIBER,
        value: {
            unsubscribe: subscriberId,
            key: subscriberKey
        }
    };
}

export const unsetSubscriber = (subscriberKey) => (dispatch, getState) => {

    const state = getState().firestoreSubscriber;
    const unsubscribe = state.hasOwnProperty(subscriberKey) ? state[subscriberKey].unsubscribe : null;

    if(unsubscribe) {
        unsubscribe();

        dispatch({
            type: UNSET_FIRESTORE_SUBSCRIBER,
            value: subscriberKey
        });
    }
}