import { createStore, applyMiddleware, compose, combineReducers } from "redux";

//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const companies = [
  {
    name: "CompanyA",
    invoice: false,
  },
  {
    name: "CompanyB",
    invoice: false,
  },
  {
    name: "CompanyC",
    invoice: false,
  },
];

const companyReducer = (state = companies, action) => {
  if (action.type === "Invoice-Received") {
    const newState = [...state];
    const receivedCompany = newState.findIndex(
      (company) => company.name === action.payload
    );
    newState[receivedCompany] = {
      ...newState[receivedCompany],
      invoice: !newState[receivedCompany].invoice,
    };

    return newState;
  }
  return state;
};

const initialState = { state: "default" };
const reducer = (state = initialState, action) => {
  return state;
};

const rootReducer = combineReducers({ companyReducer, reducer})

//onst middleware = () => {}

const store = createStore(rootReducer);

//const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
//    applyMiddleware(...middleware)
//));

export default store;
