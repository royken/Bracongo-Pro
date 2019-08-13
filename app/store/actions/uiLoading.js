import { UI_START_LOADING, UI_STOP_LOADING } from "./types";

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