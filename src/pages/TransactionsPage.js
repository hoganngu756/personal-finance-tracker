// src/pages/TransactionsPage.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTransactions } from '../services/transactionService';
import { Box, Typography, Container, Paper, Button, Grid, CircularProgress, Alert } from '@mui/material';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';

const TransactionsPage = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransactions(token);
        setTransactions(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const handleAddClick = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleTransactionAdded = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
    setShowForm(false);
  };

  const handleTransactionUpdated = (updatedTransaction) => {
    setTransactions(transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
    setShowForm(false);
  };

  const handleTransactionDeleted = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Transactions
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add Transaction
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {showForm && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <TransactionForm
                transaction={editingTransaction}
                onClose={handleFormClose}
                onTransactionAdded={handleTransactionAdded}
                onTransactionUpdated={handleTransactionUpdated}
              />
            </Paper>
          </Grid>
        )}
        
        <Grid item xs={12} md={showForm ? 8 : 12}>
          <Paper sx={{ p: 2 }}>
            <TransactionList
              transactions={transactions}
              onEdit={handleEditClick}
              onDelete={handleTransactionDeleted}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TransactionsPage;