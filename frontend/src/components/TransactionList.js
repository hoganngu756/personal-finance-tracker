// src/components/TransactionList.js
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { format } from 'date-fns';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  if (!transactions.length) {
    return (
      <Typography variant="body1" align="center" sx={{ p: 2 }}>
        No transactions found
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>
                <Typography color={transaction.type === 'income' ? 'success.main' : 'error.main'}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                ${transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(transaction)}>
                  <Edit color="primary" />
                </IconButton>
                <IconButton onClick={() => onDelete(transaction.id)}>
                  <Delete color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionList;