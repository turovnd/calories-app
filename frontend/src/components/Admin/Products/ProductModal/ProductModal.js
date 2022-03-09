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
  DialogActions,
} from '@mui/material';

export const ValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
});


const ProductModal = ({ title, initialValues, open, onClose, onSubmit }) => {
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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ minWidth: 400 }} component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          variant="standard"
          label="Product Name"
          name="name"
          autoFocus
          onChange={handleChange}
          value={values.name}
          error={Boolean(errors.name) && touched.name}
          helperText={Boolean(errors.name) && touched.name ? errors.name : undefined}
        />
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

ProductModal.propTypes = {
  title: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export { ProductModal };
