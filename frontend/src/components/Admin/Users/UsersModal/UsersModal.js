import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox, FormControlLabel
} from '@mui/material';
import { authSelectors } from '../../../../redux/slices';

export const ValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().required(),
  isAdmin: Yup.bool().required(),
});


const UsersModal = ({ initialValues, open, onClose, onSubmit }) => {
  const profile = useSelector(authSelectors.selectProfile);

  const { values, errors, touched, handleSubmit, handleChange, isSubmitting, resetForm } = useFormik({
    initialValues,
    validationSchema: ValidationSchema,
    onSubmit: (data) => {
      onSubmit(data);
      resetForm();
    }
  });

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Edit user</DialogTitle>
      <DialogContent sx={{ minWidth: 400 }} component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          variant="standard"
          label="Full Name"
          name="name"
          autoComplete="name"
          autoFocus
          onChange={handleChange}
          value={values.name}
          error={Boolean(errors.name) && touched.name}
          helperText={Boolean(errors.name) && touched.name ? errors.name : undefined}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          variant="standard"
          label="Email Address"
          name="email"
          autoComplete="email"
          onChange={handleChange}
          value={values.email}
          error={Boolean(errors.email) && touched.email}
          helperText={Boolean(errors.email) && touched.email ? errors.email : undefined}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="isAdmin"
              disabled={profile._id === values._id}
              checked={values.isAdmin}
              onChange={handleChange}
            />
          }
          label="Is Admin"
        />
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

UsersModal.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export { UsersModal };
