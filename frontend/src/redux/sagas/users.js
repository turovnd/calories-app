import { all, put, call, takeLatest } from 'redux-saga/effects';

import * as api from '../api';

import { usersActions } from '../slices';

export function* loadDataFlow({ payload: { limit, offset, name } }) {
  try {
    const { total, rows } = yield call(api.loadUsers, { limit, offset, name });
    yield put(usersActions.loadData.success({ total, rows }));
  } catch (error) {
    yield put(usersActions.loadData.failed({ error }));
  }
}


export function* editUserFlow({ payload: { id, ...data } }) {
  try {
    const product = yield call(api.editUsers, id, data);
    yield put(usersActions.editUser.success({ id, data: product }));
  } catch (error) {
    yield put(usersActions.editUser.failed({ error }));
  }
}

export function* deleteUserFlow({ payload: { id } }) {
  try {
    yield call(api.deleteUsers, id);
    yield put(usersActions.deleteUser.success({ id }));
  } catch (error) {
    yield put(usersActions.deleteUser.failed({ error }));
  }
}

export default function* root() {
  yield all([
    takeLatest(usersActions.loadData.types.BASE, loadDataFlow),
    takeLatest(usersActions.editUser.types.BASE, editUserFlow),
    takeLatest(usersActions.deleteUser.types.BASE, deleteUserFlow),
  ]);
}
