import { combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware, { END } from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';

import { createSlice } from './utils';

const isProductionMode = process.env.NODE_ENV === 'production';

const sagaCache = new Map();
const sagaMiddleware = createSagaMiddleware();
const sagaRun = sagaMiddleware.run;

// Try to avoid injecting duplicate sagas.
sagaMiddleware.run = (saga, ...args) => {
  if (sagaCache.get(saga)) {
    // eslint-disable-next-line
    console.warn('Duplicated saga', saga);
    return sagaCache.get(saga);
  }
  const toCache = sagaRun.call(this, saga, ...args);
  sagaCache.set(saga, toCache);
  return toCache;
};

const middlewares = [
  sagaMiddleware
];

if (!isProductionMode) {
  middlewares.push(createLogger({ collapsed: true }));
}

const store = configureStore({
  reducer: {},
  middleware: middlewares,
  devTools: !isProductionMode,
});

// Place to store all active reducers.
store.asyncReducers = {};

// Avoid injecting duplicate reducers.
const injectReducer = (name, reducer) => {
  if (name === undefined) {
    return;
  }
  if (reducer === undefined) {
    return;
  }

  if (Object.keys(store.asyncReducers).includes(name)) {
    // eslint-disable-next-line
    console.warn(`Cannot inject reducer with name = ${name}. It already exists.`);
    return;
  }

  store.asyncReducers[name] = reducer;
  store.replaceReducer(combineReducers(store.asyncReducers));
  store.close = () => store.dispatch(END);
};


export { store, injectReducer, createSlice, sagaMiddleware };
