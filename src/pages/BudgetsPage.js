// src/pages/BudgetsPage.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getBudgets } from '../services/budgetService';
import { Box, Typography, Container, Paper, Button, Grid, CircularProgress, Alert } from '@mui/material';
import BudgetList from '../components/BudgetList';
import BudgetForm from '../components/BudgetForm';

const BudgetsPage = () => {
  const { token } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        const data = await getBudgets(token);
        setBudgets(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch budgets');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBudgets();
    }
  }, [token]);

  const handleAddClick = () => {
    setEditingBudget(null);
    setShowForm(true);
  };

  const handleEditClick = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleBudgetAdded = (newBudget) => {
    setBudgets([...budgets, newBudget]);
    setShowForm(false);
  };

  const handleBudgetUpdated = (updatedBudget) => {
    setBudgets(budgets.map(b => 
      b.id === updatedBudget.id ? updatedBudget : b
    ));
    setShowForm(false);
  };

  const handleBudgetDeleted = (id) => {
    setBudgets(budgets.filter(b => b.id !== id));
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
          Budgets
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add Budget
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {showForm && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <BudgetForm
                budget={editingBudget}
                onClose={handleFormClose}
                onBudgetAdded={handleBudgetAdded}
                onBudgetUpdated={handleBudgetUpdated}
              />
            </Paper>
          </Grid>
        )}
        
        <Grid item xs={12} md={showForm ? 8 : 12}>
          <Paper sx={{ p: 2 }}>
            <BudgetList
              budgets={budgets}
              onEdit={handleEditClick}
              onDelete={handleBudgetDeleted}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BudgetsPage;