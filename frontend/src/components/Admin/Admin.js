import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Grid, LinearProgress, Tabs, Tab, Card } from '@mui/material';

import { authActions, authSelectors } from '../../redux/slices';

import { Header } from '../common/Header';
import { Forbidden } from '../Forbidden';
import { Statistics } from './Statistics';
import { Journal } from './Journal';
import { Products } from './Products';
import { Users } from './Users';

const pages = ['Journal', 'Products', 'Users'];

const Admin = () => {
  const dispatch = useDispatch();

  const [tab, setTab] = useState(0);

  const profile = useSelector(authSelectors.selectProfile);

  useEffect(() => {
    if (!profile) {
      dispatch(authActions.getProfile.base());
    }
  }, [profile]);

  if (!profile) {
    return (
      <LinearProgress />
    );
  }

  if (!profile.isAdmin) {
    return (
      <Forbidden />
    );
  }

  return (
    <Box>
      <Header />
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={6} md={8} xl={10}>
          {tab === 0 && <Journal />}
          {tab === 1 && <Products />}
          {tab === 2 && <Users />}
        </Grid>
        <Grid item xs={6} md={4} xl={2}>
          <Card sx={{ marginBottom: 2 }}>
            <Tabs orientation="vertical" value={tab} onChange={(e, t) => setTab(t)}>
              {pages.map((p, ind) => (
                <Tab
                  key={p}
                  label={p}
                  value={ind}
                  sx={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    maxWidth: 'inherit'
                  }}
                />
              ))}
            </Tabs>
          </Card>
          <Statistics />
        </Grid>
      </Grid>
    </Box>
  );
};

export { Admin };
