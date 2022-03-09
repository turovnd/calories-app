import React, { useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Card, CardContent, CardHeader, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';

import { authActions, authSelectors } from '../../../redux/slices';

export const ValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  caloriesLimit: Yup.number().required().positive().integer()
});

const InitialValues = {
  name: '',
  email: '',
  caloriesLimit: 0
};

const Profile = ({ ...props }) => {
  const dispatch = useDispatch();

  const profile = useSelector(authSelectors.selectProfile);

  const [isEditable, setIsEditable] = useState(false);

  const handleUpdateProfile = (data) => {
    setIsEditable(false);
    dispatch(authActions.updateProfile.base(data));
  };

  const { values, errors, touched, handleSubmit, handleChange, resetForm, isSubmitting } = useFormik({
    initialValues: Object.keys(InitialValues).reduce((map, k) => ({
      ...map,
      [k]: profile[k]
    }), {}),
    validationSchema: ValidationSchema,
    onSubmit: handleUpdateProfile
  });

  const handleOpenEditMode = () => {
    setIsEditable(true);
    resetForm();
  };

  const handleCloseEditMode = () => {
    setIsEditable(false);
    resetForm();
  };

  return (
    <Card {...props}>
      <CardHeader
        title="Profile"
        action={
          isEditable ? (
            <Fragment>
              <IconButton onClick={handleSubmit} disabled={isSubmitting}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCloseEditMode}>
                <CloseIcon />
              </IconButton>
            </Fragment>
          ) : (
            <IconButton onClick={handleOpenEditMode}>
              <EditIcon />
            </IconButton>
          )
        }
      />
      <CardContent component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          variant="standard"
          fullWidth
          name="name"
          autoComplete="name"
          label="Full Name"
          onChange={handleChange}
          value={values.name}
          error={Boolean(errors.name) && touched.name}
          helperText={Boolean(errors.name) && touched.name ? errors.name : undefined}
          InputProps={{
            readOnly: !isEditable,
          }}
        />
        <TextField
          margin="normal"
          variant="standard"
          fullWidth
          name="email"
          autoComplete="email"
          label="Email Address"
          onChange={handleChange}
          value={values.email}
          error={Boolean(errors.email) && touched.email}
          helperText={Boolean(errors.email) && touched.email ? errors.email : undefined}
          InputProps={{
            readOnly: !isEditable,
          }}
        />
        <TextField
          margin="normal"
          variant="standard"
          fullWidth
          type="number"
          name="caloriesLimit"
          label="Calories Limit"
          onChange={handleChange}
          value={values.caloriesLimit}
          error={Boolean(errors.caloriesLimit) && touched.caloriesLimit}
          helperText={Boolean(errors.caloriesLimit) && touched.caloriesLimit ? errors.caloriesLimit : undefined}
          InputProps={{
            readOnly: !isEditable,
          }}
        />
      </CardContent>
    </Card>
  );
};

export { Profile };
