import { UPDATE_CART, INIT_CART } from "../actions/types";

const init = {
    cart: {}, // array of { nomProduit, quantite, codeProduit }
    details: {
        total: 0,
        amount: 0
    }
};

const initialState = {
    ...init
};

export default function (state = initialState, action) {
    let newState;

    switch (action.type) {
        case UPDATE_CART:
            const { total, amount, code, name, quantity } = action.value;

            if(total <= 0) {
                newState = {
                    ...state,
                    ...init
                };
            } else {
                newState = {
                    ...state,
                    cart: {
                        ...state.cart,
                        [code]: {
                            ...state.cart[code],
                            nomProduit: name,
                            quantite: quantity,
                            codeProduit: code
                        }
                    },
                    details: {
                        ...state.details,
                        total: total,
                        amount: amount
                    }
                };
            }
            break;

        case INIT_CART:
            newState = {
                ...state,
                ...init
            };
            break;

        default:
            newState = state;        
    };

    return newState || state;
}