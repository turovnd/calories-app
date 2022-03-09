import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Paper, Table, TableHead, TableBody, TableRow, TableCell, TablePagination,
  Toolbar, Typography, Menu, MenuItem, ListItemIcon, Checkbox, ListItemText, IconButton
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';

import { LoadingPlaceholder } from '../../common/LoadingPlaceholder';
import { usersActions, usersSelectors, } from '../../../redux/slices';
import { PAGE_SIZE } from '../../../constants';
import { UsersModal } from './UsersModal';


const Users = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);

  const [editedUser, setEditedUser] = useState({});

  const rows = useSelector(usersSelectors.selectRows);
  const total = useSelector(usersSelectors.selectTotal);
  const isLoading = useSelector(usersSelectors.selectIsLoading);

  useEffect(() => {
    dispatch(usersActions.loadData.base({ offset: 0, limit: rowsPerPage }));
  }, []);

  const handleCloseUserOptions = () => setEditedUser({});

  const handleShowUserOptions = (event, user) => setEditedUser({
    target: event.currentTarget,
    initialValues: { id: user._id, ...user },
    dialogOpened: false
  });

  const handleOpenModal = () => setEditedUser({
    ...editedUser,
    target: undefined,
    dialogOpened: true
  });

  const handleDeleteUser = () => {
    dispatch(usersActions.deleteUser.base({ id: editedUser.initialValues.id }));
    handleCloseUserOptions();
  };

  const handleOnSubmitModal = (data) => {
    dispatch(usersActions.editUser.base(data));
    handleCloseUserOptions();
  };

  const handleChangePage = (e, p) => {
    setPage(p);
    dispatch(usersActions.loadData.base({ offset: p * rowsPerPage, limit: rowsPerPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    handleChangePage({}, 0);
  }, [rowsPerPage]);

  return (
    <Paper>
      <Toolbar>
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div">
          Users Table
        </Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Is Admin</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell padding="none" />
          </TableRow>
        </TableHead>
        <TableBody sx={{ position: 'relative' }}>
          {isLoading && <LoadingPlaceholder />}
          {total === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">No users exist</TableCell>
            </TableRow>
          ) : rows.map(row => (
            <TableRow key={row._id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <Checkbox size="small" readOnly checked={row.isAdmin} disableRipple />
              </TableCell>
              <TableCell>
                {new Date(row.createdAt).toLocaleString()}
              </TableCell>
              <TableCell padding="none">
                <IconButton size="small" onClick={event => handleShowUserOptions(event, row)}>
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
        anchorEl={editedUser.target}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(editedUser.target)}
        onClose={handleCloseUserOptions}
      >
        <MenuItem onClick={handleOpenModal}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteUser}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      {editedUser.dialogOpened && (
        <UsersModal
          initialValues={editedUser.initialValues}
          open={editedUser.dialogOpened}
          onClose={handleCloseUserOptions}
          onSubmit={handleOnSubmitModal}
        />
      )}
    </Paper>
  );
};

export { Users };
