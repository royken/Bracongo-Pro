import { getMessages } from "../../../api/bracongoApi";
import { toast } from "../../../utils/toast";
import { CONNEXION_PROBLEM_MSG } from "../../../core/constants";
import { uiStartLoading, uiStopLoading } from "../../../core/actions/actions";
import { GET_MESSAGES } from "./types";

export const listMessages = (numero, page = 0) => (dispatch, getState) => {

    dispatch(uiStartLoading());

    getMessages(numero, page)
    .then(
        (data) => {
            const isLoading = getState().uiLoading.isLoading;

            if(isLoading) {
                dispatch({
                    type: GET_MESSAGES,
                    value: {
                        messages: data,
                        page: page
                    }
                });

                dispatch(uiStopLoading());
            }
        }
    ).catch((error) => {
        dispatch(uiStopLoading());
        toast(CONNEXION_PROBLEM_MSG, "danger", 5000);
    });
}