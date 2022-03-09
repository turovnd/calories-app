import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Paper, Table, TableHead, TableBody, TableRow, TableCell, TablePagination,
  IconButton, Toolbar, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Button
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';

import { LoadingPlaceholder } from '../../common/LoadingPlaceholder';
import { UserWithAvatar } from '../../common/UserWithAvatar';
import { ProductModal } from './ProductModal';

import { productsActions, productsSelectors, } from '../../../redux/slices';
import { PAGE_SIZE } from '../../../constants';


const Products = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);

  const [editedProduct, setEditedProduct] = useState({});

  const rows = useSelector(productsSelectors.selectRows);
  const total = useSelector(productsSelectors.selectTotal);
  const isLoading = useSelector(productsSelectors.selectIsLoading);

  useEffect(() => {
    dispatch(productsActions.loadData.base({ offset: 0, limit: rowsPerPage }));
  }, []);

  const handleCloseProductOptions = () => setEditedProduct({});

  const handleShowProductOptions = (event, product) => setEditedProduct({
    target: event.currentTarget,
    initialValues: {
      id: product._id,
      name: product.name
    },
    title: 'Edit product',
    dialogOpened: false
  });

  const handleOpenModal = () => setEditedProduct({
    initialValues: {
      name: ''
    },
    title: 'Add new product',
    ...editedProduct,
    target: undefined,
    dialogOpened: true
  });

  const handleDeleteProduct = () => {
    dispatch(productsActions.deleteProduct.base({ id: editedProduct.initialValues.id }));
    handleCloseProductOptions();
  };

  const handleOnSubmitModal = (data) => {
    if (data.id) {
      dispatch(productsActions.editProduct.base(data));
    } else {
      dispatch(productsActions.addProduct.base({ rowsPerPage, ...data }));
    }
    handleCloseProductOptions();
  };

  const handleChangePage = (e, p) => {
    setPage(p);
    dispatch(productsActions.loadData.base({ offset: p * rowsPerPage, limit: rowsPerPage }));
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
          Products Table
        </Typography>
        <Button onClick={handleOpenModal} sx={{ ml: 2 }} variant="contained">
          Add
        </Button>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell padding="none" />
          </TableRow>
        </TableHead>
        <TableBody sx={{ position: 'relative' }}>
          {isLoading && <LoadingPlaceholder />}
          {total === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">No products exist</TableCell>
            </TableRow>
          ) : rows.map(row => (
            <TableRow key={row._id}>
              <TableCell>{row.name}</TableCell>
              <TableCell padding="none">
                <UserWithAvatar data={row.createdBy} />
              </TableCell>
              <TableCell>
                {new Date(row.createdAt).toLocaleString()}
              </TableCell>
              <TableCell padding="none">
                <IconButton size="small" onClick={event => handleShowProductOptions(event, row)}>
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
        anchorEl={editedProduct.target}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(editedProduct.target)}
        onClose={handleCloseProductOptions}
      >
        <MenuItem onClick={handleOpenModal}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteProduct}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      {editedProduct.dialogOpened && (
        <ProductModal
          title={editedProduct.title}
          initialValues={editedProduct.initialValues}
          open={editedProduct.dialogOpened}
          onClose={handleCloseProductOptions}
          onSubmit={handleOnSubmitModal}
        />
      )}
    </Paper>
  );
};

export { Products };
