import React from 'react';
import Loadable from 'react-loadable';
import { LinearProgress } from '@mui/material';

const map = {
  '/': 'HomePage',
  '/403': 'ForbiddenPage',
  '/login': 'LoginPage',
  '/signup': 'SignUpPage',
  '/admin': 'AdminPage',
};

export const makeAsyncView = viewName => Loadable({
  loader: () => import(/* webpackChunkName: 'view-[request]' */ `./pages/${viewName}`),
  loading: () => <LinearProgress />,
});

export const ViewMap = Object.keys(map).reduce(
  (result, route) => ({
    ...result,
    [route]: makeAsyncView(map[route]),
  }),
  {}
);
