import { all, takeLatest } from 'redux-saga/effects';

import * as slices from '../slices';

const allFailedActions = Object.keys(slices)
  .filter(i => i.toLowerCase().includes('actions'))
  .reduce((map, key) => ([
    ...map,
    ...Object.keys(slices[key] || {}).reduce((map2, key2) => ([
      ...map2,
      ((slices[key][key2] || {}).types || {}).FAILED
    ]), []).filter(i => !!i)
  ]), []);

export function* handleErrorFlow({ payload: { error } }) {
  try {
    // TODO: add `notify` for show notification
    console.error(error); // eslint-disable-line
    yield alert(((error || {}).response || {}).data || 'Unexpected error'); // eslint-disable-line
  } catch (err) {
    console.error(error); // eslint-disable-line
  }
}


export default function* root() {
  yield all(allFailedActions.map(action => (
    takeLatest(action, handleErrorFlow)
  )));
}
