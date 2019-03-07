import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import {reducer as form} from "redux-form";
import Reducers from "./tmpreducer";

export default combineReducers({
  router: routerReducer,
  form,
  ...Reducers
});

