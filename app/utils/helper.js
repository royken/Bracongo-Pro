/**************************/
/**** Geo point helper ***/
/************************/

// Parse geolocation coordinate by giving latitude or longitude
export function parseGeoCoord(coord) {
    
    return typeof coord === 'string' ? 
            parseFloat(coord.replace(',', '.')) : 
            parseFloat(coord);
}