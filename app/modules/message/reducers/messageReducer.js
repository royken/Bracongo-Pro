import { GET_MESSAGES } from "../actions/types";
import { MAX_PER_PAGE_PAGINATION } from "../../../api/constants";

const initialState = {
    messages: [],
    page: 0,
    pageable: false
};

export default function (state = initialState, action) {
    let newState;

    switch (action.type) {
        case GET_MESSAGES:
            const { messages, page } = action.value;
            
            newState = {
                ...state,
                messages: page === 0 ? messages : [...state.messages, ...messages],
                page: page,
                pageable: MAX_PER_PAGE_PAGINATION % messages.length === 0
            };
            break;
    
        default:
            newState = state;
            break;
    }

    return newState || state;
}