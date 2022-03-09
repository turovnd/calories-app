import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { ProductSelection } from '../../../common/ProductSelection';

export const ValidationSchema = Yup.object().shape({
  product: Yup.object({
    _id: Yup.string().required(),
    name: Yup.string().required(),
  }).required(),
  calories: Yup.number().required().positive().integer()
});

const EntityModal = ({ title, initialValues, open, onClose, onSubmit, caloriesToday, caloriesLimit }) => {
  const { values, errors, touched, handleSubmit, handleChange, setFieldValue, isSubmitting, resetForm } = useFormik({
    initialValues,
    validationSchema: ValidationSchema,
    onSubmit: (data) => {
      onSubmit({
        id: data.id,
        productId: data.product._id,
        productName: data.product.name,
        calories: parseInt(data.calories, 10),
      });
      resetForm();
    }
  });

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const richLimit = (caloriesToday - initialValues.calories) + values.calories > caloriesLimit;
  const avblCalories = caloriesLimit - ((caloriesToday - initialValues.calories) + values.calories);

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
        <TextField
          margin="normal"
          required
          fullWidth
          variant="standard"
          label="Calories"
          name="calories"
          type="number"
          color={richLimit ? 'warning' : undefined}
          focused={richLimit ? true : undefined}
          onChange={handleChange}
          value={values.calories}
          error={Boolean(errors.calories) && touched.calories}
          helperText={Boolean(errors.calories) && touched.calories
            ? errors.calories
            : `Available calories for today: ${Math.max(0, avblCalories)}`}
        />
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

EntityModal.propTypes = {
  title: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    product: PropTypes.oneOfType([
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string
      }),
      null
    ]).isRequired,
    calories: PropTypes.number.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  caloriesToday: PropTypes.number.isRequired,
  caloriesLimit: PropTypes.number.isRequired,
};

export { EntityModal };
