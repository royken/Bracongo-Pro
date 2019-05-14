import validate from 'validate.js';
import constraints from './constraints';

export default function validateField(fieldName, value, repeatedField = []){

    let formValues = {};
    formValues[fieldName] = value;

    if( validate.isObject(repeatedField) && 
        !validate.isEmpty(repeatedField[0]) && 
        !validate.isEmpty(repeatedField[1]) &&
        repeatedField[0] !== fieldName
    ){

        formValues[repeatedField[0]] = repeatedField[1];

    }

    let formField = {};
    formField[fieldName] = constraints[fieldName];

    const result = validate(formValues, formField);

    if(result){
        return result[fieldName][0];
    }

    return null;
}