import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { useFormik } from 'formik';

import { Paper, Box, Avatar, Typography, TextField, Button, Container } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

import { authActions } from '../../redux/slices';

export const ValidationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { values, errors, touched, handleSubmit, handleChange, isSubmitting } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: data => dispatch(authActions.login.base({ navigate, data }))
  });

  return (
    <Container component="main" maxWidth="xs">
      <Paper sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
            value={values.email}
            error={Boolean(errors.email) && touched.email}
            helperText={Boolean(errors.email) && touched.email ? errors.email : undefined}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            onChange={handleChange}
            value={values.password}
            error={Boolean(errors.password) && touched.password}
            helperText={Boolean(errors.password) && touched.password ? errors.password : undefined}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/signup')}
          >
            Do not have account? Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export { Login };
