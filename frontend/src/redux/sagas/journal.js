import { all, put, call, takeLatest } from 'redux-saga/effects';

import * as api from '../api';

import { journalActions } from '../slices';
import { PRODUCT_NEW_ID } from '../../constants';

export function* loadDataFlow({ payload: { limit, offset, fromDate, dueDate, userId } }) {
  try {
    const { total, rows } = yield call(api.loadJournalData, { limit, offset, fromDate, dueDate, userId });
    yield put(journalActions.loadData.success({ total, rows }));
  } catch (error) {
    yield put(journalActions.loadData.failed({ error }));
  }
}

export function* addDataFlow({ payload: { rowsPerPage, callback, productId, productName, ...vals } }) {
  try {
    if (productId === PRODUCT_NEW_ID) {
      const product = yield call(api.addProducts, { name: productName });
      productId = product._id;
    }
    const data = yield call(api.addJournalData, { productId, ...vals });
    yield put(journalActions.addData.success({ data, rowsPerPage }));
    if (typeof callback === 'function') {
      callback();
    }
  } catch (error) {
    yield put(journalActions.addData.failed({ error }));
  }
}

export function* editDataFlow({ payload: { id, callback, productId, productName, ...vals } }) {
  try {
    if (productId === PRODUCT_NEW_ID) {
      const product = yield call(api.addProducts, { name: productName });
      productId = product._id;
    }
    const data = yield call(api.editJournalData, id, { productId, ...vals });
    yield put(journalActions.editData.success({ id, data }));
    if (typeof callback === 'function') {
      callback();
    }
  } catch (error) {
    yield put(journalActions.editData.failed({ error }));
  }
}

export function* deleteDataFlow({ payload: { id, callback } }) {
  try {
    yield call(api.deleteJournalData, id);
    yield put(journalActions.deleteData.success({ id }));
    if (typeof callback === 'function') {
      callback();
    }
  } catch (error) {
    yield put(journalActions.deleteData.failed({ error }));
  }
}

export function* loadMyReportFlow({ payload: { fromDate, dueDate } }) {
  try {
    const data = yield call(api.loadJournalReport, { fromDate, dueDate });
    yield put(journalActions.loadMyReport.success(data));
  } catch (error) {
    yield put(journalActions.loadMyReport.failed({ error }));
  }
}

export default function* root() {
  yield all([
    takeLatest(journalActions.loadData.types.BASE, loadDataFlow),
    takeLatest(journalActions.addData.types.BASE, addDataFlow),
    takeLatest(journalActions.editData.types.BASE, editDataFlow),
    takeLatest(journalActions.deleteData.types.BASE, deleteDataFlow),
    takeLatest(journalActions.loadMyReport.types.BASE, loadMyReportFlow),
  ]);
}
