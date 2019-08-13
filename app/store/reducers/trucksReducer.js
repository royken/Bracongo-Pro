import { GET_TRUCKS_VAN } from "../actions/types";

const initialState = {
    vans: []
};

export default function (state = initialState, action) {
    let newState;

    switch (action.type) {
        case GET_TRUCKS_VAN:
            newState = {
                ...state,
                vans: action.value
            }        
            break;
    
        default:
            newState = state;
            break;
    }

    return newState || state;
}