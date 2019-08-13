import { GET_COMPLAINTS, ADD_COMPLAINT } from "../actions/types";
import { MAX_PER_PAGE_PAGINATION } from "../../api/constants";

const initialState = {
    complaints: [],
    page: 0,
    pageable: false
};

export default function (state = initialState, action) {
    let newState;

    switch (action.type) {
        case GET_COMPLAINTS:
            const { complaints, page } = action.value;

            newState = {
                ...state,
                complaints: page === 0 ? complaints : [...state.complaints, ...complaints],
                page: page,
                pageable: MAX_PER_PAGE_PAGINATION % complaints.length === 0
            };
            break;

        case ADD_COMPLAINT:
            const prevComplaints = state.complaints;

            if(prevComplaints.length >= MAX_PER_PAGE_PAGINATION && 
                prevComplaints.length % MAX_PER_PAGE_PAGINATION === 0
            ) {
                prevComplaints.pop();
            } 

            prevComplaints.unshift(action.value);
            const pageable = prevComplaints.length >= MAX_PER_PAGE_PAGINATION && prevComplaints.length % MAX_PER_PAGE_PAGINATION === 0;

            newState = {
                ...state,
                complaints: prevComplaints,
                pageable: pageable
            };
            break;

        default:
            newState = state;
            break;
    }

    return newState || state;
}