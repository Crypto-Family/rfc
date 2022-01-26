const { createStore, combineReducers, applyMiddleware } = Redux;
const thunk = ReduxThunk;

import walletReducer from './reducers/walletReducer.js';
import web3Reducer from './reducers/web3Reducer.js';
import mintReducer from './reducers/mintReducer.js';

const reducer = combineReducers({
    web3Reducer,
    walletReducer,
    mintReducer,
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
