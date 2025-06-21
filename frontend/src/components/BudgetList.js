// src/components/BudgetList.js
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, LinearProgress } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const BudgetList = ({ budgets, onEdit, onDelete }) => {
  if (!budgets.length) {
    return (
      <Typography variant="body1" align="center" sx={{ p: 2 }}>
        No budgets found
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Spent</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {budgets.map((budget) => {
            const progress = (budget.spent / budget.amount) * 100;
            const progressColor = progress > 90 ? 'error' : progress > 70 ? 'warning' : 'primary';

            return (
              <TableRow key={budget.id}>
                <TableCell>{budget.category}</TableCell>
                <TableCell>${budget.amount.toFixed(2)}</TableCell>
                <TableCell>${budget.spent.toFixed(2)}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(budget)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => onDelete(budget.id)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BudgetList;