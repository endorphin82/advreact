import firebase from "firebase";
import { appName } from "../config";
import { Record } from "immutable";
import { all, take, put, call, cps, takeEvery } from "redux-saga/effects";
// import { push } from "react-router-redux";

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
      return state.set("loading", true);

    case SIGN_IN_SUCCESS:
      return state
        .set("loading", false)
        .set("user", payload)
        .set("error", null);

    case SIGN_UP_ERROR:
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
      const user = yield call(
        [auth, auth.createUserWithEmailAndPassword],
        action.payload.email, action.payload.password);
      yield put({
        type: SIGN_UP_SUCCESS,
        payload: { user }
      });
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

  while (true) {
    const action = yield take(SIGN_IN_REQUEST);

    try {
      const user = yield call(
        [auth, auth.signInWithEmailAndPassword],
        action.payload.email, action.payload.password
      );
      yield put({
        type: SIGN_IN_SUCCESS,
        payload: { user }
      });
    } catch (error) {
      yield put({
        type: SIGN_IN_ERROR,
        payload: error
      });
    }
  }
};

// export function signUp(email, password) {
//   return (dispatch) => {
//     dispatch({
//       type: SIGN_UP_REQUEST
//     });
//
//     firebase.auth()
//       .createUserWithEmailAndPassword(email, password)
//       .then(user => dispatch({
//         type: SIGN_UP_SUCCESS,
//         payload: { user }
//       }))
//       .catch(error => dispatch({
//         type: SIGN_UP_ERROR,
//         payload: error
//       }));
//   };
// }

export const witchStatusChange = function* () {
  const auth = firebase.auth();
  //node style 1 arg its error
  try {
    yield cps([auth, auth.onAuthStateChanged]);

  } catch (user) {
    yield put({
      type: SIGN_IN_SUCCESS,
      payload: { user }
    });
  }
};

// firebase.auth().onAuthStateChanged(user => {
//   const store = require("../redux").default;
//   store.dispatch({
//     type: SIGN_IN_SUCCESS,
//     payload: { user }
//   });
// });

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
    witchStatusChange(),
    takeEvery(SIGN_UP_REQUEST, signOutSaga)
  ]);
};