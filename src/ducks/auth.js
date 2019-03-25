import firebase from "firebase";
import { appName } from "../config";
import { Record } from "immutable";
import { all, take, put, call, takeEvery } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { push } from "react-router-redux";
import { reset } from "redux-form";

// Schema
export const ReducerRecord = Record({
  user: null,
  error: null,
  loading: false
});

export const moduleName = "auth";

export const SIGN_UP_REQUEST = `${appName}/${moduleName}/SIGN_UP_REQUEST`;
export const SIGN_UP_SUCCESS = `${appName}/${moduleName}/SIGN_UP_SUCCESS`;
export const SIGN_UP_ERROR = `${appName}/${moduleName}/SIGN_UP_ERROR`;

export const SIGN_IN_REQUEST = `${appName}/${moduleName}/SIGN_IN_REQUEST`;
export const SIGN_IN_SUCCESS = `${appName}/${moduleName}/SIGN_IN_SUCCESS`;
export const SIGN_IN_ERROR = `${appName}/${moduleName}/SIGN_IN_ERROR`;

export const SIGN_OUT_REQUEST = `${appName}/${moduleName}/SIGN_OUT_REQUEST`;
export const SIGN_OUT_SUCCESS = `${appName}/${moduleName}/SIGN_OUT_SUCCESS`;
export const SIGN_OUT_ERROR = `${appName}/${moduleName}/SIGN_OUT_ERROR`;

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload } = action;

  switch (type) {
    case SIGN_UP_REQUEST:
    case SIGN_IN_REQUEST:
      return state.set("loading", true);

    case SIGN_IN_SUCCESS:
      return state
        .set("loading", false)
        .set("user", payload)
        .set("error", null);

    case SIGN_UP_ERROR:
    case SIGN_IN_ERROR:
      return state
        .set("loading", false)
        .set("error", payload);

    case SIGN_OUT_SUCCESS:
      return new ReducerRecord();

    default:
      return state;
  }
}

export function signUp(email, password) {
  return {
    type: SIGN_UP_REQUEST,
    payload: { email, password }
  };
}

export function signIn(email, password) {
  return {
    type: SIGN_IN_REQUEST,
    payload: { email, password }
  };
}

export function signOut() {
  return {
    type: SIGN_OUT_REQUEST
  };
}

export const signUpSaga = function* () {
  const auth = firebase.auth();

  while (true) {
    const action = yield take(SIGN_UP_REQUEST);

    try {
      yield call(
        [auth, auth.createUserWithEmailAndPassword],
        action.payload.email, action.payload.password);

    } catch (error) {
      yield put({
        type: SIGN_UP_ERROR,
        payload: error
      });
    }
  }
};

export const signInSaga = function* () {
  const auth = firebase.auth();
  // yield firebase.auth().setPersistence('session');
  while (true) {
    const action = yield take(SIGN_IN_REQUEST);

    try {
      // yield call([auth, auth.setPersistence("session")]);
      yield call(
        [auth, auth.signInWithEmailAndPassword],
        action.payload.email, action.payload.password
      );
      yield put(reset("auth"));
    } catch (error) {
      yield put({
        type: SIGN_IN_ERROR,
        payload: error
      });
    }
  }
};

const createAuthChannel = () => eventChannel(emit =>
  firebase.auth().onAuthStateChanged(user => emit({ user })));

export const watchStatusChange = function* () {
  const chan = yield call(createAuthChannel);
  while (true) {
    const { user } = yield take(chan);

    if (user) {
      yield put({
        type: SIGN_IN_SUCCESS,
        payload: { user }
      });
    } else {
      yield put({
        type: SIGN_OUT_SUCCESS,
        payload: { user }
      });
      yield put(push("/auth/signin"));
    }
  }
};

export const signOutSaga = function* () {
  const auth = firebase.auth();

  try {
    yield call([auth, auth.signOut]);
    yield put({
      type: SIGN_OUT_SUCCESS
    });
    // yield put(push('/auth/signin'))

  } catch (error) {
    yield put({
      type: SIGN_OUT_ERROR,
      payload: error
    });
  }
};

export const saga = function* () {
  yield all([
    signUpSaga(),
    signInSaga(),
    watchStatusChange(),
    takeEvery(SIGN_OUT_REQUEST, signOutSaga)
  ]);
};