import { uiStartLoading, uiStopLoading } from './uiLoading';
import { getTrucks } from "../../api/bracongoApi";
import { toast } from "../../utils/toast";
import { CONNEXION_PROBLEM_MSG } from "../../modules/core/constants";
import { GET_TRUCKS_VAN } from "./types";

// Action for getting van trucks
export const getVanTrucks = (uuid, ccode) => (dispatch, getState) => {

    dispatch(uiStartLoading());

    getTrucks(uuid, ccode)
    .then((data) => {
        
        const isLoading = getState().uiLoading.isLoading;

        if(isLoading) {
            const trucks = [];

            data.GetCircInfoJSResult.forEach(element => {
                trucks.push({ 
                    name: element.cRegNo,
                    lat: element.lat, 
                    lng: element.lng, 
                    speed: element.speed, 
                    dt: element.ldt 
                });
            });

            dispatch({
                type: GET_TRUCKS_VAN,
                value: trucks
            }); 

            dispatch(uiStopLoading());
        }
    })
    .catch((error) => { 
        dispatch(uiStopLoading());
        toast.danger(CONNEXION_PROBLEM_MSG, 7000);
    });
    
}