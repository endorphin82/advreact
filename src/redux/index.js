import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import logger from "redux-logger";
import { routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import history from "../history";

const enhancer = applyMiddleware(routerMiddleware(history), thunk, logger);

const store = createStore(reducer, enhancer);

// const store = createStore(reducer, enhancer,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
window.store = store;

export default store;