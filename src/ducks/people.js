import { put, call, takeEvery } from "redux-saga/effects";
import { List, Record } from "immutable";
import { appName } from "../config";
import { generateId } from "./utils";
import firebase from "firebase";

const ReducerState = Record({
  entities: new List([])
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

export default function reducer(state = new ReducerState(), action) {
  const { type, payload } = action;

  switch (type) {
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
  return peopleRef.push(person)
  // const newPersonKey = firebase.database().ref().child("people").push().key;
  // const updates = {};
  // updates["/people/" + newPersonKey] = person;
  // return firebase.database().ref().update(updates);
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
}
}

export const addPersonSaga = function* (action) {
  const id = yield call(generateId);
  yield put({
    type: ADD_PERSON,
    payload: { ...action.payload, id }
  });
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

export const saga = function* () {
  yield takeEvery(ADD_PERSON_REQUEST, addPersonSaga);
};