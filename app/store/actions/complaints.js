import { getComplaints, addComplaint } from "../../api/bracongoApi";
import { GET_COMPLAINTS, ADD_COMPLAINT } from "./types";
import { uiStartLoading, uiStopLoading } from "./uiLoading";
import { toast } from "../../utils/toast";
import { CONNEXION_PROBLEM_MSG } from "../../modules/core/constants";

export const listComplaints = (numero, page = 0) => (dispatch, getState) => {
    dispatch(uiStartLoading());

    getComplaints(numero, page)
    .then(
        (data) => {
            const isLoading = getState().uiLoading.isLoading;

            if(isLoading) {
                dispatch({
                    type: GET_COMPLAINTS,
                    value: {
                        complaints: data,
                        page: page
                    }
                });

                dispatch(uiStopLoading());
            }
        }
    ).catch((error) => {
        dispatch(uiStopLoading());
        toast.danger(CONNEXION_PROBLEM_MSG);
    });
}

export const newComplaint = (complaint) => (dispatch) => {
    return new Promise((resolve, reject) => {
        addComplaint(complaint).then(
            (data) => {
                dispatch({
                    type: ADD_COMPLAINT,
                    value: data
                });

                toast.success("Votre plainte a été enregistrée avec succès.");
                resolve(true);
            }
        ).catch((error) => {
            toast.danger(CONNEXION_PROBLEM_MSG);
            reject(error);
        });
    });
}