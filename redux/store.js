// import { createStore, combineReducers, applyMiddleware } from "redux";
const { createStore, combineReducers, applyMiddleware } = Redux;

//import redux thunk middleware

const thunk = ReduxThunk;

import walletReducer from './reducers/walletReducer.js';
import web3Reducer from './reducers/web3Reducer.js';

const reducer = combineReducers({
    web3Reducer,
    walletReducer,
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
