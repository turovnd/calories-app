import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Paper, Box, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, Button,
  IconButton, Toolbar, Typography, Menu, MenuItem, ListItemIcon, ListItemText, TextField
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { DateRangePicker } from '@mui/lab';

import { LoadingPlaceholder } from '../../common/LoadingPlaceholder';
import { EntityModal } from './EntityModal';
import { Report } from './Report';

import { authSelectors, journalActions, journalSelectors } from '../../../redux/slices';
import { PAGE_SIZE } from '../../../constants';


const Calendar = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);
  const [searchDates, setSearchDates] = useState([new Date(), new Date()]);

  const [editedData, setEditedData] = useState({});

  const rows = useSelector(journalSelectors.selectRows);
  const total = useSelector(journalSelectors.selectTotal);
  const isLoading = useSelector(journalSelectors.selectIsLoading);
  const { caloriesLimit } = useSelector(authSelectors.selectProfile);
  const caloriesToday = useSelector(journalSelectors.selectCaloriesToday);

  useEffect(() => {
    dispatch(journalActions.loadData.base({
      offset: 0,
      limit: rowsPerPage,
      fromDate: searchDates[0],
      dueDate: searchDates[1]
    }));
  }, []);

  const handleCloseOptions = () => setEditedData({});

  const handleLoadReport = () => {
    dispatch(journalActions.loadMyReport.base({
      fromDate: searchDates[0],
      dueDate: searchDates[1]
    }));
  };

  const handleShowOptions = (event, journal) => setEditedData({
    target: event.currentTarget,
    initialValues: {
      id: journal._id,
      user: journal.user,
      product: journal.product,
      calories: journal.calories,
      createdAt: journal.createdAt
    },
    title: 'Edit food entity',
    dialogOpened: false
  });

  const handleOpenModal = () => setEditedData({
    initialValues: {
      user: null,
      product: null,
      calories: 0,
      createdAt: ''
    },
    title: 'Add new food entity',
    ...editedData,
    target: undefined,
    dialogOpened: true
  });

  const handleChangePage = (e, p) => {
    setPage(p);
    dispatch(journalActions.loadData.base({
      offset: p * rowsPerPage,
      limit: rowsPerPage,
      fromDate: searchDates[0],
      dueDate: searchDates[1]
    }));
  };

  const handleDeleteJournal = () => {
    dispatch(journalActions.deleteData.base({
      id: editedData.initialValues.id,
      callback: () => {
        handleChangePage({}, page);
        handleLoadReport();
      }
    }));
    handleCloseOptions();
  };

  const handleOnSubmitModal = (data) => {
    if (data.id) {
      dispatch(journalActions.editData.base({ ...data, callback: () => handleLoadReport() }));
    } else {
      dispatch(journalActions.addData.base({ rowsPerPage, ...data, callback: () => handleLoadReport() }));
    }
    handleCloseOptions();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    handleChangePage({}, 0);
  }, [rowsPerPage]);

  useEffect(() => {
    handleChangePage({}, 0);
    handleLoadReport();
  }, [rowsPerPage, searchDates]);

  return (
    <Paper>
      <Toolbar>
        <Typography sx={{ flex: '1' }} variant="h6" component="div">
          Journal
        </Typography>
        <DateRangePicker
          startText="From date"
          endText="Due Date"
          value={searchDates}
          allowSameDateSelection
          onChange={v => setSearchDates(v)}
          renderInput={(startProps, endProps) => (
            <Fragment>
              <TextField size="small" {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField size="small" {...endProps} />
            </Fragment>
          )}
        />
      </Toolbar>
      <Report />
      <Toolbar>
        <Typography sx={{ flex: '1' }} variant="h6" component="div">
          Food Entities Table
        </Typography>
        <Button variant="contained" onClick={handleOpenModal} sx={{ ml: 2 }}>
          Add
        </Button>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Calories</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell padding="none" />
          </TableRow>
        </TableHead>
        <TableBody sx={{ position: 'relative' }}>
          {isLoading && <LoadingPlaceholder />}
          {total === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">No data exist</TableCell>
            </TableRow>
          ) : rows.map(row => (
            <TableRow key={row._id}>
              <TableCell>{row.product.name}</TableCell>
              <TableCell>{row.calories}</TableCell>
              <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
              <TableCell padding="none">
                <IconButton size="small" onClick={event => handleShowOptions(event, row)}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {total > rowsPerPage && (
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 30, 50, 100]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
      <Menu
        anchorEl={editedData.target}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(editedData.target)}
        onClose={handleCloseOptions}
      >
        <MenuItem onClick={handleOpenModal}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteJournal}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      {editedData.dialogOpened && (
        <EntityModal
          title={editedData.title}
          initialValues={editedData.initialValues}
          open={editedData.dialogOpened}
          onClose={handleCloseOptions}
          onSubmit={handleOnSubmitModal}
          caloriesToday={caloriesToday}
          caloriesLimit={caloriesLimit}
        />
      )}
    </Paper>
  );
};

export { Calendar };
