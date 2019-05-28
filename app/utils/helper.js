import moment from 'moment';

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

// Get current date timestammp
export function getCurrentDate() {
    return (new Date()).getTime();
}