// src/components/BudgetForm.js
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const categories = [
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Rent',
  'Other',
];

const BudgetForm = ({ budget, onClose, onBudgetAdded, onBudgetUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = budget
    ? {
        ...budget,
      }
    : {
        category: 'Food',
        amount: '',
        spent: 0,
      };

  const validationSchema = Yup.object().shape({
    category: Yup.string().required('Category is required'),
    amount: Yup.number()
      .positive('Amount must be positive')
      .required('Amount is required'),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Here you would typically call your API
      // For now, we'll simulate the response
      const response = { ...values, id: budget?.id || Date.now() };
      
      if (budget) {
        onBudgetUpdated(response);
      } else {
        onBudgetAdded(response);
      }
    } catch (err) {
      console.error('Error saving budget:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {budget ? 'Edit Budget' : 'Add New Budget'}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form>
            <DialogContent>
              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  name="category"
                  label="Category"
                  select
                  variant="outlined"
                  error={touched.category && !!errors.category}
                  helperText={<ErrorMessage name="category" />}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Field>
              </Box>
              
              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  name="amount"
                  label="Amount"
                  type="number"
                  variant="outlined"
                  error={touched.amount && !!errors.amount}
                  helperText={<ErrorMessage name="amount" />}
                />
              </Box>
              
              {budget && (
                <Box mb={2}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="spent"
                    label="Spent"
                    type="number"
                    variant="outlined"
                    disabled
                  />
                </Box>
              )}
            </DialogContent>
            
            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default BudgetForm;