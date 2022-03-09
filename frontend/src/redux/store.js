import { store, injectReducer, sagaMiddleware } from '../modules/store';

import sagas from './sagas';
import { auth, statistics, products, users, journal } from './slices';

injectReducer('auth', auth);
injectReducer('statistics', statistics);
injectReducer('products', products);
injectReducer('users', users);
injectReducer('journal', journal);

sagaMiddleware.run(sagas);

export { store };
