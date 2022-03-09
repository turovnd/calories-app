import { all, put, call, takeLatest } from 'redux-saga/effects';

import * as api from '../api';

import { statisticsActions } from '../slices';

export function* loadStatisticsFlow() {
  try {
    const statistics = yield call(api.loadJournalStatistics);
    yield put(statisticsActions.loadStatistics.success(statistics));
  } catch (error) {
    yield put(statisticsActions.loadStatistics.failed({ error }));
  }
}

export default function* root() {
  yield all([
    takeLatest(statisticsActions.loadStatistics.types.BASE, loadStatisticsFlow),
  ]);
}
