import React from 'react';

import { Box, Typography } from '@mui/material';

const Forbidden = () => (
  <Box sx={{
    display: 'flex',
    width: '100vw',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center'
  }}
  >
    <Typography variant="h3" sx={{ borderRight: '1px solid #bbb', paddingRight: 1, marginRight: 1 }}>403</Typography>
    <Typography variant="h5" inline>You have not access to the page</Typography>
  </Box>
);

export { Forbidden };
