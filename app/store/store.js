import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import profileReducer  from '../modules/profile/reducers/profileReducer';
import purchasesReducer from '../modules/purchase/reducers/purchasesReducer';
import uiLoadingReducer from '../core/reducers/uiLoadingReducer';
import trucksReducer from '../modules/van/reducers/trucksReducer';
import firestoreSubscriberReducer from '../core/reducers/firestoreSubscriberReducer';

const rootReducer = combineReducers({
    uiLoading: uiLoadingReducer,
    firestoreSubscriber: firestoreSubscriberReducer,
    profile: profileReducer,
    purchases: purchasesReducer,
    trucks: trucksReducer
}); 

let composeEnhancers = compose;
if(__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const initialState = {}

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
);

export default store;