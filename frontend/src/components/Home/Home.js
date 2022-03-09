import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinearProgress, Box, Grid } from '@mui/material';

import { authActions, authSelectors } from '../../redux/slices';

import { Header } from '../common/Header';
import { Profile } from './Profile';
import { Friends } from './Friends';
import { Calendar } from './Calendar';

const Home = () => {
  const dispatch = useDispatch();

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

  return (
    <Box>
      <Header />
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={6} md={8} xl={10}>
          <Calendar />
        </Grid>
        <Grid item xs={6} md={4} xl={2}>
          <Profile sx={{ marginBottom: 2 }} />
          <Friends />
        </Grid>
      </Grid>
    </Box>
  );
};

export { Home };
