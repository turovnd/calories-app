import React from 'react';

import { Box, Typography } from '@mui/material';

const NotFound = () => (
  <Box sx={{
    display: 'flex',
    width: '100vw',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center'
  }}
  >
    <Typography variant="h3" sx={{ borderRight: '1px solid #bbb', paddingRight: 1, marginRight: 1 }}>404</Typography>
    <Typography variant="h5" inline>Page does not exist</Typography>
  </Box>
);

export { NotFound };
