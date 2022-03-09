import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import { Container, Chip, Skeleton } from '@mui/material';

import { authSelectors, journalSelectors } from '../../../../redux/slices';

const Report = () => {
  const { isLoading, data } = useSelector(journalSelectors.selectReport);
  const { caloriesLimit } = useSelector(authSelectors.selectProfile);

  return (
    <Container>
      {isLoading && <Skeleton />}
      {!isLoading && data.map(({ date, calories }) => (
        <Chip
          key={date}
          sx={{ mr: 1, mt: 1 }}
          label={
            <Fragment>
              {date}:  <b>{calories}</b>
            </Fragment>
          }
          color={calories > caloriesLimit ? 'error' : 'primary'}
          variant="outlined"
        />
      ))}
    </Container>
  );
};

export { Report };
