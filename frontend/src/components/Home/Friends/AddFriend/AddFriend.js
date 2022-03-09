import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

export const ValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
});


const AddFriend = ({ open, onClose, onCreate }) => {
  const { values, errors, touched, handleSubmit, handleChange, isSubmitting, resetForm } = useFormik({
    initialValues: {
      name: '',
      email: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: (data) => {
      onCreate(data);
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
      <DialogTitle>Invite friend</DialogTitle>
      <DialogContent sx={{ minWidth: 400 }} component="form" onSubmit={handleSubmit} noValidate>
        <DialogContentText>
          To invite a friend you need to complete the form.
        </DialogContentText>
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
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}>Invite</Button>
      </DialogActions>
    </Dialog>
  );
};

AddFriend.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export { AddFriend };
