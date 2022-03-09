import { all, put, call, takeLatest } from 'redux-saga/effects';

import * as api from '../api';

import { productsActions } from '../slices';

export function* loadDataFlow({ payload: { limit, offset, name } }) {
  try {
    const { total, rows } = yield call(api.loadProducts, { limit, offset, name });
    yield put(productsActions.loadData.success({ total, rows }));
  } catch (error) {
    yield put(productsActions.loadData.failed({ error }));
  }
}

export function* addProductFlow({ payload: { rowsPerPage, ...vals } }) {
  try {
    const data = yield call(api.addProducts, vals);
    yield put(productsActions.addProduct.success({ data, rowsPerPage }));
  } catch (error) {
    yield put(productsActions.addProduct.failed({ error }));
  }
}

export function* editProductFlow({ payload: { id, ...data } }) {
  try {
    const product = yield call(api.editProducts, id, data);
    yield put(productsActions.editProduct.success({ id, data: product }));
  } catch (error) {
    yield put(productsActions.editProduct.failed({ error }));
  }
}

export function* deleteProductFlow({ payload: { id } }) {
  try {
    yield call(api.deleteProducts, id);
    yield put(productsActions.deleteProduct.success({ id }));
  } catch (error) {
    yield put(productsActions.deleteProduct.failed({ error }));
  }
}

export default function* root() {
  yield all([
    takeLatest(productsActions.loadData.types.BASE, loadDataFlow),
    takeLatest(productsActions.addProduct.types.BASE, addProductFlow),
    takeLatest(productsActions.editProduct.types.BASE, editProductFlow),
    takeLatest(productsActions.deleteProduct.types.BASE, deleteProductFlow),
  ]);
}
