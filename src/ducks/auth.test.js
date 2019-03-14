import {
  SIGN_IN_ERROR,
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS, SIGN_OUT_SUCCESS,
  SIGN_UP_ERROR,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  ReducerRecord,
  signUpSaga
} from "./auth";
import { all, take, put, call, cps, takeEvery } from "redux-saga/effects";
import firebase from "firebase";
import { push } from "react-router-redux";

/**
 * Saga tests
 * */

it("should sign up", () => {
  const saga = signUpSaga();
  const auth = firebase.auth();
  const authData = {
    email: "qweee@qwe.ru",
    password: "123123"
  };

  const user = {
    email: authData.email,
    uid: Math.random().toString()
  };

  const requestAction = {
    type: SIGN_UP_REQUEST,
    payload: authData
  };

  expect(saga.next().value).toEqual(take(SIGN_UP_REQUEST));

  expect(saga.next(requestAction).value).toEqual(call(
    [auth, auth.createUserWithEmailAndPassword],
    authData.email, authData.password
  ));

  expect(saga.next(user).value).toEqual(put({
    type: SIGN_UP_SUCCESS,
    payload: { user }
  }));

  const error = new Error;

  expect(saga.throw(error).value).toEqual(put({
    type: SIGN_UP_ERROR,
    payload: error
  }));
});

it("should sign in", () => {
  const saga = signInSaga();
  const auth = firebase.auth();
  const authData = {
    email: "qweee@qwe.ru",
    password: "123123"
  };

  const user = {
    email: authData.email,
    uid: Math.random().toString()
  };

  const requestAction = {
    type: SIGN_IN_REQUEST,
    payload: authData
  };

  expect(saga.next().value).toEqual(take(SIGN_IN_REQUEST));

  expect(saga.next(requestAction).value).toEqual(call(
    [auth, auth.signInWithEmailAndPassword],
    authData.email, authData.password
  ));

  expect(saga.next(user).value).toEqual(put({
    type: SIGN_IN_SUCCESS,
    payload: { user }
  }));

  const error = new Error;

  expect(saga.throw(error).value).toEqual(put({
    type: SIGN_IN_ERROR,
    payload: error
  }));
});

it("should sign out", () => {
  const saga = signUpSaga();
  const auth = firebase.auth();

  expect(saga.next().value).toEqual(call([auth, auth.signOut]));
  expect(saga.next().value).toEqual(put({
    type: SIGN_OUT_SUCCESS
  }));
  expect(put(push("/auth/signin")));
});

/**
 * Reducer Tests
 * */

it("should sign out", () => {
  const state = new ReducerRecord({
    user: {}
  });

  const newState = reducer(state, { type: SIGN_OUT_SUCCESS });

  expect(newState).toEqual(new ReducerRecord());
});

it("should sign in", () => {
  const state = new ReducerRecord();
  const user = {
    email: "qweee@qwe.ru",
    uid: Math.random().toString()
  };
  const newState = reducer(state, {
    type: SIGN_IN_SUCCESS,
    payload: { user }
  });

  expect(newState).toEqual(new ReducerRecord({ user }));
});