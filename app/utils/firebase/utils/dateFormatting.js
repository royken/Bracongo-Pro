import moment from "moment";

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