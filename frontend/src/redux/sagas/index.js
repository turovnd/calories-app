import { all, fork } from 'redux-saga/effects';

import auth from './auth';
import statistics from './statistics';
import products from './products';
import users from './users';
import journal from './journal';
import errorHandler from './errorHandler';

export default function* root() {
  yield all([fork(auth), fork(statistics), fork(products), fork(users), fork(journal), fork(errorHandler)]);
}
