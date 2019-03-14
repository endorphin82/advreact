import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as form } from "redux-form";
import authReducer, { moduleName as authModule } from "../ducks/auth";
import personReducer, { moduleName as personModule } from "../ducks/people";
import eventsReducer, { moduleName as eventsModule } from "../ducks/events";

export default combineReducers({
  router: routerReducer,
  form,
  [authModule]: authReducer,
  [personModule]: personReducer,
  [eventsModule]: eventsReducer
});

