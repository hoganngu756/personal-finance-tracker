// src/components/TransactionForm.js
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
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
  'Salary',
  'Investment',
  'Other',
];

const TransactionForm = ({ transaction, onClose, onTransactionAdded, onTransactionUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = transaction
    ? {
        ...transaction,
        date: format(new Date(transaction.date), 'yyyy-MM-dd'),
      }
    : {
        description: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        category: 'Food',
        type: 'expense',
      };

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('Description is required'),
    amount: Yup.number()
      .positive('Amount must be positive')
      .required('Amount is required'),
    date: Yup.date().required('Date is required'),
    category: Yup.string().required('Category is required'),
    type: Yup.string().required('Type is required'),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Here you would typically call your API
      // For now, we'll simulate the response
      const response = { ...values, id: transaction?.id || Date.now() };
      
      if (transaction) {
        onTransactionUpdated(response);
      } else {
        onTransactionAdded(response);
      }
    } catch (err) {
      console.error('Error saving transaction:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {transaction ? 'Edit Transaction' : 'Add New Transaction'}
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
                  name="description"
                  label="Description"
                  variant="outlined"
                  error={touched.description && !!errors.description}
                  helperText={<ErrorMessage name="description" />}
                />
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
              
              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  name="date"
                  label="Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={touched.date && !!errors.date}
                  helperText={<ErrorMessage name="date" />}
                />
              </Box>
              
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
                  name="type"
                  label="Type"
                  select
                  variant="outlined"
                  error={touched.type && !!errors.type}
                  helperText={<ErrorMessage name="type" />}
                >
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Field>
              </Box>
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

export default TransactionForm;