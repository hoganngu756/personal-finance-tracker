// src/components/BudgetSummary.js
import { Box, Typography, LinearProgress } from '@mui/material';

const BudgetSummary = ({ budgets }) => {
  if (!budgets.length) {
    return (
      <Typography variant="body1" align="center" sx={{ p: 2 }}>
        No budgets set up
      </Typography>
    );
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallProgress = (totalSpent / totalBudget) * 100;

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="subtitle1" gutterBottom>
          Overall Budget Utilization
        </Typography>
        <Box display="flex" alignItems="center">
          <Box width="100%" mr={1}>
            <LinearProgress
              variant="determinate"
              value={Math.min(overallProgress, 100)}
              color={overallProgress > 90 ? 'error' : overallProgress > 70 ? 'warning' : 'primary'}
            />
          </Box>
          <Typography variant="body2" color="textSecondary">
            {Math.round(overallProgress)}%
          </Typography>
        </Box>
        <Typography variant="caption" display="block">
          ${totalSpent.toFixed(2)} of ${totalBudget.toFixed(2)} spent
        </Typography>
      </Box>
      
      <Typography variant="subtitle1" gutterBottom>
        Budgets by Category
      </Typography>
      {budgets.map((budget) => {
        const progress = (budget.spent / budget.amount) * 100;
        const progressColor = progress > 90 ? 'error' : progress > 70 ? 'warning' : 'primary';

        return (
          <Box key={budget.id} mb={2}>
            <Typography variant="body2" gutterBottom>
              {budget.category}
            </Typography>
            <Box display="flex" alignItems="center">
              <Box width="100%" mr={1}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(progress, 100)}
                  color={progressColor}
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                {Math.round(progress)}%
              </Typography>
            </Box>
            <Typography variant="caption" display="block">
              ${budget.spent.toFixed(2)} of ${budget.amount.toFixed(2)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default BudgetSummary;