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
import { DateTimePicker } from '@mui/lab';

import { ProductSelection } from '../../../common/ProductSelection';
import { UserSelection } from '../../../common/UserSelection';

export const ValidationSchema = Yup.object().shape({
  product: Yup.object({
    _id: Yup.string().required(),
    name: Yup.string().required(),
  }).required(),
  user: Yup.object({
    _id: Yup.string().required(),
    name: Yup.string().required(),
  }).required(),
  calories: Yup.number().required().positive().integer(),
  createdAt: Yup.date().required()
});

const JournalModal = ({ title, initialValues, open, onClose, onSubmit }) => {
  const { values, errors, touched, handleSubmit, handleChange, setFieldValue, isSubmitting, resetForm } = useFormik({
    initialValues,
    validationSchema: ValidationSchema,
    onSubmit: (data) => {
      onSubmit({
        id: data.id,
        productId: data.product._id,
        productName: data.product.name,
        userId: data.user._id,
        calories: parseInt(data.calories, 10),
        createdAt: data.createdAt
      });
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
        <ProductSelection
          onChange={val => setFieldValue('product', val)}
          initialValue={values.product}
          error={Boolean(errors.product) && touched.product}
          helperText={Boolean(errors.product) && touched.product ? 'Product must be selected' : undefined}
        />
        <UserSelection
          onChange={val => setFieldValue('user', val)}
          initialValue={values.user}
          error={Boolean(errors.user) && touched.user}
          helperText={Boolean(errors.user) && touched.user ? 'User must be selected' : undefined}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          variant="standard"
          label="Calories"
          name="calories"
          onChange={handleChange}
          value={values.calories}
          error={Boolean(errors.calories) && touched.calories}
          helperText={Boolean(errors.calories) && touched.calories ? errors.calories : undefined}
        />
        <DateTimePicker
          onChange={val => setFieldValue('createdAt', val)}
          value={values.createdAt}
          renderInput={params =>
            (<TextField
              {...params}
              required
              fullWidth
              error={Boolean(errors.createdAt) && touched.createdAt}
              helperText={Boolean(errors.createdAt) && touched.createdAt ? errors.createdAt : undefined}
              margin="normal"
              variant="standard"
              label="Created At"
            />)
          }
        />
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

JournalModal.propTypes = {
  title: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    user: PropTypes.oneOfType([
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string
      }),
      null
    ]).isRequired,
    product: PropTypes.oneOfType([
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string
      }),
      null
    ]).isRequired,
    calories: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export { JournalModal };
