import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import logger from "redux-logger";
import { routerMiddleware } from "react-router-redux";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";
import history from "../history";
import { saga } from "../ducks/people";

const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(sagaMiddleware, routerMiddleware(history), thunk, logger);

const store = createStore(reducer, enhancer);

// const store = createStore(reducer, enhancer,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
window.store = store;
sagaMiddleware.run(saga);
export default store;