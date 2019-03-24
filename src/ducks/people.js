import {
  cancelled, cancel, spawn, fork,
  delay, all, put, call, takeEvery, select
} from "redux-saga/effects";
import { isKeyed, List, Record } from "immutable";
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
  email: null,
  events: []
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
export const ADD_EVENT_REQUEST = `${prefix}/ADD_EVENT_REQUEST`;
export const ADD_EVENT_SUCCESS = `${prefix}/ADD_EVENT_SUCCESS`;

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
    case ADD_EVENT_SUCCESS:
      return state.setIn(["entities", payload.personUid, "events"], payload.eventUid);
    default:
      return state;
  }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const idSelector = (_, props) => props.uid;
export const peopleListSelector = createSelector(entitiesSelector, entities => (
  entities.valueSeq().toArray()
));
export const personSelector = createSelector(entitiesSelector, idSelector, (entities, id) => entities.get(id));

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

export function addEventToPerson(eventUid, personUid) {
  return {
    type: ADD_EVENT_REQUEST,
    payload: { eventUid, personUid }
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

export const addEventSaga = function* (action) {
  const { eventUid, personUid } = action.payload;
  const eventsRef = firebase.database().ref(`people/${personUid}/events`);

  const state = yield select(stateSelector);
  const events = state.getIn(["entities", personUid, "events"]).concat(eventUid);
  try {
    yield call([eventsRef, eventsRef.set], events);

    yield put({
      type: ADD_EVENT_SUCCESS,
      payload: { personUid, events }
    });
  } catch (_) {

  }
};

export const backgroundSyncSaga = function* () {
  try {
    while (true) {
      yield call(fetchAllSaga);
      yield delay(2000);

    }
  } finally {
    if (yield cancelled()) {
      console.log('canceled',"backgroundSyncSaga");
    }
  }
};

export const cancelableSync = function* () {
  const task = yield fork(backgroundSyncSaga);
  yield delay(6000);
  yield cancel(task);
};

export function* saga() {
  // parrallel call background (fork)
  // yield fork(backgroundSyncSaga);
  // spawn - boundary fork
  yield spawn(cancelableSync);

  yield all([
    takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
    takeEvery(FETCH_ALL_REQUEST, fetchAllSaga),
    takeEvery(ADD_EVENT_REQUEST, addEventSaga)
  ]);
}