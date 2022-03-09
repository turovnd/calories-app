import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Card, CardHeader, List, ListItem, ListItemText,
  Divider, IconButton, CircularProgress, Skeleton
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

import { statisticsActions, statisticsSelectors } from '../../../redux/slices';

const STATISTICS = [
  { label: 'Added entries for the last 7 days', key: 'entriesCurrentWeek' },
  { label: 'Added entries week before', key: 'entriesWeekBefore' },
  {},
  { label: 'Average number of calories for the last 7 days', key: 'avgCaloriesCurrentWeek' },
  { label: 'Average number of calories week before', key: 'avgCaloriesWeekBefore' },
];

const Statistics = () => {
  const dispatch = useDispatch();

  const statistics = useSelector(statisticsSelectors.selectStatistics);
  const isLoading = useSelector(statisticsSelectors.selectIsLoading);

  const handleLoadStatistics = () => dispatch(statisticsActions.loadStatistics.base());

  useEffect(() => {
    handleLoadStatistics();
  }, []);

  return (
    <Card>
      <CardHeader
        title="Statistics"
        action={
          <IconButton onClick={handleLoadStatistics} >
            {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        }
      />
      <List dense>
        {STATISTICS.map((item, ind) => (item.key ? (
          <ListItem
            key={item.key}
            secondaryAction={statistics[item.key] ? parseInt(statistics[item.key], 10) : <Skeleton />}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ) : (
          <Divider key={`divider-${ind}`} />
        )))}
      </List>
    </Card>
  );
};

export { Statistics };
