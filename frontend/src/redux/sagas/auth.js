import { all, put, call, takeLatest } from 'redux-saga/effects';

import * as api from '../api';

import { authActions } from '../slices';
import { STORAGE_KEY } from '../../constants';

export function* getProfileFlow() {
  try {
    const profile = yield call(api.loadProfileData);
    yield put(authActions.getProfile.success(profile));
  } catch (error) {
    yield put(authActions.getProfile.failed({ error }));
  }
}

export function* loginFlow({ payload: { navigate, data } }) {
  try {
    yield call(api.login, data);
    yield put(authActions.login.success());
    navigate('/');
  } catch (error) {
    yield put(authActions.login.failed({ error }));
  }
}

export function* logoutFlow({ payload: { navigate } }) {
  localStorage.removeItem(STORAGE_KEY);
  yield navigate('/login');
}

export function* signupFlow({ payload: { navigate, data } }) {
  try {
    yield call(api.signup, data);
    yield put(authActions.signup.success());
    navigate('/');
  } catch (error) {
    yield put(authActions.signup.failed({ error }));
  }
}

export function* updateProfileFlow({ payload }) {
  try {
    const profile = yield call(api.updateProfileData, payload);
    yield put(authActions.updateProfile.success(profile));
  } catch (error) {
    yield put(authActions.updateProfile.failed({ error }));
  }
}

export function* addFriendFlow({ payload }) {
  try {
    const friend = yield call(api.inviteFriend, payload);
    yield put(authActions.addFriend.success(friend));
  } catch (error) {
    yield put(authActions.addFriend.failed({ error }));
  }
}


export function* deleteFriendFlow({ payload: { _id } }) {
  try {
    yield call(api.removeFriend, _id);
    yield put(authActions.deleteFriend.success({ id: _id }));
  } catch (error) {
    yield put(authActions.deleteFriend.failed({ error }));
  }
}

export default function* root() {
  yield all([
    takeLatest(authActions.getProfile.types.BASE, getProfileFlow),
    takeLatest(authActions.login.types.BASE, loginFlow),
    takeLatest(authActions.logout.types.BASE, logoutFlow),
    takeLatest(authActions.signup.types.BASE, signupFlow),
    takeLatest(authActions.updateProfile.types.BASE, updateProfileFlow),
    takeLatest(authActions.addFriend.types.BASE, addFriendFlow),
    takeLatest(authActions.deleteFriend.types.BASE, deleteFriendFlow),
  ]);
}
