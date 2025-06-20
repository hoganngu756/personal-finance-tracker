// src/pages/RegisterPage.js
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box, Typography, Container, Paper, Alert } from '@mui/material';

const RegisterPage = () => {
  const { register, error, isLoading } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await register(values);
            } catch (err) {
              console.error('Registration error:', err);
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
                  name="name"
                  label="Name"
                  variant="outlined"
                  error={touched.name && !!errors.name}
                  helperText={<ErrorMessage name="name" />}
                />
              </Box>
              
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
              
              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  error={touched.confirmPassword && !!errors.confirmPassword}
                  helperText={<ErrorMessage name="confirmPassword" />}
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
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
            </Form>
          )}
        </Formik>
        
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;