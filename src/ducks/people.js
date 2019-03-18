import { all, put, call, take } from "redux-saga/effects";
import { List, Record } from "immutable";
import { appName } from "../config";
import { fbDatatoEntities, generateId } from "./utils";
import firebase from "firebase";
import { createSelector } from "reselect";

const ReducerState = Record({
  entities: new List([]),
  loading: false
});

const PersonRecord = Record({
  id: null,
  firstName: null,
  lastName: null,
  email: null
});

export const moduleName = "people";
const prefix = `${appName}/${moduleName}`;

export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;
export const ADD_PERSON = `${prefix}/ADD_PERSON`;
export const WRITE_PERSON_REQUEST = `${prefix}/WRITE_PERSON_REQUEST`;
export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`;

export default function reducer(state = new ReducerState(), action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL_REQUEST:
      return state.set("loading", true);
    case FETCH_ALL_SUCCESS:
      return state
        .set("loading", false)
        .set("entities", fbDatatoEntities(payload, PersonRecord));
    case  ADD_PERSON:
      return state.update("entities", entities => entities.push(new PersonRecord(payload)));
    case WRITE_PERSON_REQUEST:
      return writePersonFb(payload);
    default:
      return state;
  }
}

function writePersonFb(person) {
  const peopleRef = firebase.database().ref("/people");
  return peopleRef.push(person);
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

export function fetchAll() {
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

export function writePerson(person) {
  return {
    type: WRITE_PERSON_REQUEST,
    payload: person
  };
}

export const addPersonSaga = function* (action) {
  const id = yield call(generateId);
  yield put({
    type: ADD_PERSON,
    payload: { ...action.payload, id }
  });
};

/**
 * Sagas
 * */

export const fetchAllSaga = function* () {
  while (true) {
    yield take(FETCH_ALL_REQUEST);

    const ref = firebase.database().ref("people");

    const data = yield call([ref, ref.once], "value");

    yield put({
      type: FETCH_ALL_SUCCESS,
      payload: data.val()
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
    fetchAllSaga()
  ]);
}