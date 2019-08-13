import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import uiLoadingReducer from './reducers/uiLoadingReducer';
import firestoreListenerReducer from './reducers/firestoreListenerReducer';
import firestorePaginatorReducer from './reducers/firestorePaginatorReducer';
import profileReducer from './reducers/profileReducer';
import messagesReducer from './reducers/messagesReducer';
import complaintsReducer from './reducers/complaintsReducer';
import ordersReducer from './reducers/ordersReducer';
import trucksReducer from './reducers/trucksReducer';
import purchasesReducer from './reducers/purchasesReducer';

const rootReducer = combineReducers({
    uiLoading: uiLoadingReducer,
    firestoreListener: firestoreListenerReducer,
    firestorePaginator: firestorePaginatorReducer,
    profile: profileReducer,
    purchases: purchasesReducer,
    messages: messagesReducer,
    complaints: complaintsReducer,
    orders: ordersReducer,
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