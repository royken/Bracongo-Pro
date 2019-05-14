import { UI_START_LOADING, UI_STOP_LOADING } from '../actions/types';

const initialState = {
    isLoading: false
};

const reducer = (state = initialState, action) => {
    let newState;

    switch (action.type) {
        case UI_START_LOADING:
            newState = {
                ...state,
                isLoading: true
            };
            break;
        
        case UI_STOP_LOADING:
            newState = {
                ...state,
                isLoading: false
            };
            break;

        default:
            newState = state;
            break;
    }

    return newState || state;
}

export default reducer;