import moment from 'moment';
import { isArray } from 'lodash';

/**************************/
/**** Geo point helper ***/
/************************/

// Parse geolocation coordinate by giving latitude or longitude
export function parseGeoCoord(coord) {
    return typeof coord === 'string' ? 
            parseFloat(coord.replace(',', '.')) : 
            parseFloat(coord);
}

/**************************/
/****    Time helper   ***/
/************************/

// Get date timestamp by string date
export function getTimeFromStringDate(date, format = "DD-MM-YYYY") {
    return moment(date, format).valueOf();
}


/***********************/
/**   Array routine  **/
/*********************/
// Merge array and remove duplicates
export function deDuplicate(tab) {
    if(!isArray(tab)) {
        throw new Error("Parameter must be an array.");
    }

    const newTab = tab.reduce(function (acc, currentVal) {
        if(acc.indexOf(currentVal) === -1) {
            acc.push(currentVal);
        }
        return acc;
    }, []);

    return newTab;
}