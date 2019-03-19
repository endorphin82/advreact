import { all, put, call, takeEvery } from "redux-saga/effects";
import { List, Record } from "immutable";
import { appName } from "../config";
import { fbDatatoEntities } from "./utils";
import firebase from "firebase";
import { createSelector } from "reselect";
import { reset } from "redux-form";

export const ReducerState = Record({
  entities: new List([]),
  loading: false
});

export const PersonRecord = Record({
  uid: null,
  firstName: null,
  lastName: null,
  email: null
});

export const moduleName = "people";
const prefix = `${appName}/${moduleName}`;

export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`;
export const ADD_PERSON_ERROR = `${prefix}/ADD_PERSON_ERROR`;
export const ADD_PERSON = `${prefix}/ADD_PERSON`;
export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`;
export const FETCH_ALL_ERROR = `${prefix}/FETCH_ALL_ERROR`;

export default function reducer(state = new ReducerState(), action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL_REQUEST:
    case ADD_PERSON_REQUEST:
      return state.set("loading", true);
    case ADD_PERSON_SUCCESS:
      return state
        .set("loading", false)
        .setIn(["entities", payload.uid], new PersonRecord(payload));
    case FETCH_ALL_SUCCESS:
      return state
        .set("loading", false)
        .set("entities", fbDatatoEntities(payload, PersonRecord));
    default:
      return state;
  }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const peopleListSelector = createSelector(entitiesSelector, entities => (
  entities.valueSeq().toArray()
));

/**
 * Action Creators
 * */

export function fetchAllPeople() {
  return {
    type: FETCH_ALL_REQUEST
  };
}

export function addPerson(person) {
  return {
    type: ADD_PERSON_REQUEST,
    payload: person
  };
}

/**
 * Sagas
 * */

// function writePersonFb(person) {
//   const peopleRef = firebase.database().ref("/people");
//   return peopleRef.push(person);
// }

export const addPersonSaga = function* (action) {
  const peopleRef = firebase.database().ref("/people");

  try {
    const ref = yield call([peopleRef, peopleRef.push], action.payload);
    yield put({
      type: ADD_PERSON,
      payload: { ...action.payload, uid: ref.key }
    });
    yield put(reset("person"));
  } catch (error) {
    yield put({
      type: ADD_PERSON_ERROR,
      payload: error
    });
  }
};

export const fetchAllSaga = function* () {
  const peopleRef = firebase.database().ref("people");

  try {
    const data = yield call([peopleRef, peopleRef.once], "value");

    yield put({
      type: FETCH_ALL_SUCCESS,
      payload: data.val()
    });
  } catch (error) {
    yield put({
      type: FETCH_ALL_ERROR,
      payload: error
    });
  }
};

// export function addPerson(person) {
//   return (dispatch) => {
//     dispatch({
//       type: ADD_PERSON,
//       payload: {
//         person: { id: Date.now(), ...person }
//       }
//     });
//   };
// }

export function* saga() {
  yield all([
    takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
    takeEvery(FETCH_ALL_REQUEST, fetchAllSaga)
  ]);
}