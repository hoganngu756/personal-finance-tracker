// src/pages/DashboardPage.js
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTransactions } from '../services/transactionService';
import { getBudgets } from '../services/budgetService';
import { 
  Box, Typography, Container, Paper, Grid, 
  CircularProgress, Alert, Stack, Button 
} from '@mui/material';
import { BarChart, PieChart } from '../components/Charts/index';
import TransactionList from '../components/TransactionList';
import BudgetSummary from '../components/BudgetSummary';
import { formatCurrency, groupTransactionsByDateRange } from '../utils/helpers';

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transactionsData, budgetsData] = await Promise.all([
          getTransactions(token),
          getBudgets(token),
        ]);
        
        // Validate data structure
        if (!Array.isArray(transactionsData) || !Array.isArray(budgetsData)) {
          throw new Error('Invalid data format from API');
        }
        
        setTransactions(transactionsData);
        setBudgets(budgetsData);
      } catch (err) {
        console.error('Dashboard data error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Process data for charts
  const processChartData = () => {
    if (!transactions.length) return null;
    
    const { last7Days, last30Days, last90Days } = groupTransactionsByDateRange(transactions);
    
    return {
      barChartData: {
        labels: ['Last 7 Days', 'Last 30 Days', 'Last 90 Days'],
        datasets: [
          {
            label: 'Income',
            data: [
              last7Days.income,
              last30Days.income,
              last90Days.income
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
          {
            label: 'Expenses',
            data: [
              last7Days.expenses,
              last30Days.expenses,
              last90Days.expenses
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
          },
        ],
      },
      pieChartData: {
        labels: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Others'],
        datasets: [
          {
            data: [300, 200, 150, 100, 50], // Replace with real category data
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
          },
        ],
      },
    };
  };

  const chartData = processChartData();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  // Calculate summary values
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Welcome back, {user?.name || 'User'}!
        </Typography>
      </Stack>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Income
            </Typography>
            <Typography variant="h4" color="success.main">
              {formatCurrency(totalIncome)}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Expenses
            </Typography>
            <Typography variant="h4" color="error.main">
              {formatCurrency(totalExpenses)}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Net Balance
            </Typography>
            <Typography variant="h4" color={netBalance >= 0 ? 'success.main' : 'error.main'}>
              {formatCurrency(netBalance)}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Active Budgets
            </Typography>
            <Typography variant="h4">
              {budgets.length}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Charts Section */}
        {chartData && (
          <>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Income vs Expenses
                </Typography>
                <BarChart data={chartData.barChartData} />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Expense Distribution
                </Typography>
                <PieChart data={chartData.pieChartData} />
              </Paper>
            </Grid>
          </>
        )}
        
        {/* Recent Transactions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TransactionList 
              transactions={transactions.slice(0, 5)} 
              showActions={false}
            />
          </Paper>
        </Grid>
        
        {/* Budget Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Budget Overview
            </Typography>
            <BudgetSummary budgets={budgets} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;