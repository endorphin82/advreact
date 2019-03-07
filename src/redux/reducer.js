import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import Reducers from "./tmpreducer";

export default combineReducers({
  router: routerReducer,
  ...Reducers
})

