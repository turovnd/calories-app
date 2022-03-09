import { createReducer } from '@reduxjs/toolkit';

const createActionType = baseName => ({
  BASE: baseName,
  SUCCESS: `${baseName}--success`,
  FAILED: `${baseName}--failed`,
});

const createAction = (baseName) => {
  const types = createActionType(baseName);
  return {
    types,
    base: payload => ({ type: types.BASE, payload }),
    success: payload => ({ type: types.SUCCESS, payload }),
    failed: payload => ({ type: types.FAILED, payload }),
  };
};

const getTypes = (module, actionKey) => createActionType(`${module}/${actionKey}`);

const createSlice = ({ prefix, initialState, reducers = {}, externalReducers = {}, selectors = {} }) => {
  if (!prefix) {
    throw new Error('`prefix` is a required option for createSlice');
  }

  const selectorsNames = Object.keys(selectors);

  const reducersByType = {};
  const actionsToCreate = {};
  const sliceSelectors = {};

  selectorsNames.forEach((selectorName) => {
    const selector = selectors[selectorName];

    // Pass slice state as first argument, to simplify selecting values,
    // and the full state as additional arg.
    sliceSelectors[selectorName] = state => selector(state[prefix], state);
  });

  Object.entries(reducers).forEach(([reducerName, reducersObject]) => {
    const currentActionTypes = getTypes(prefix, reducerName);

    reducersByType[currentActionTypes.BASE] = reducersObject.base;

    if (reducersObject.failed) {
      reducersByType[currentActionTypes.FAILED] = reducersObject.failed;
    }

    if (reducersObject.success) {
      reducersByType[currentActionTypes.SUCCESS] = reducersObject.success;
    }

    actionsToCreate[reducerName] = createAction(currentActionTypes.BASE);
  });

  Object.entries(externalReducers).forEach(([actionName, reducerFunction]) => {
    reducersByType[actionName] = reducerFunction;
  });

  const reducer = createReducer(initialState, reducersByType);

  return {
    prefix,
    reducer,
    actions: actionsToCreate,
    selectors: sliceSelectors,
  };
};

export { createSlice };
