import { createStore, applyMiddleware, compose } from "redux";

//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initialState = {state: 'default'}
const reducer = (state = initialState, action) => {
    return state
}

//onst middleware = () => {}

const store = createStore(reducer);

//const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
//    applyMiddleware(...middleware)
//));

export default store;