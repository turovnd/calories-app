import React from 'react';
import { CircularProgress } from '@mui/material';

const LoadingPlaceholder = () => (
  <div style={{
    position: 'absolute',
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#ffffff4d',
    zIndex: 1
  }}
  >
    <CircularProgress />
  </div>
);

export { LoadingPlaceholder };
