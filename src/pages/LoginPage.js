// src/pages/LoginPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box, Typography, Container, Paper, Alert } from '@mui/material';

const LoginPage = () => {
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await login(values);
            } catch (err) {
              console.error('Login error:', err);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  label="Email"
                  variant="outlined"
                  error={touched.email && !!errors.email}
                  helperText={<ErrorMessage name="email" />}
                />
              </Box>
              
              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  error={touched.password && !!errors.password}
                  helperText={<ErrorMessage name="password" />}
                />
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading || isSubmitting}
                sx={{ mt: 2 }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
          )}
        </Formik>
        
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Don't have an account? <Link to="/register">Register here</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;