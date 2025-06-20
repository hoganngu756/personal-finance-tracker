// src/utils/helpers.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const groupTransactionsByDateRange = (transactions) => {
  const now = new Date();
  const last90Days = new Date(now);
  last90Days.setDate(last90Days.getDate() - 90);
  
  const last30Days = new Date(now);
  last30Days.setDate(last30Days.getDate() - 30);
  
  const last7Days = new Date(now);
  last7Days.setDate(last7Days.getDate() - 7);

  const filterTransactions = (startDate) => {
    return transactions.reduce((acc, transaction) => {
      const transDate = new Date(transaction.date);
      if (transDate >= startDate) {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else {
          acc.expenses += transaction.amount;
        }
      }
      return acc;
    }, { income: 0, expenses: 0 });
  };

  return {
    last7Days: filterTransactions(last7Days),
    last30Days: filterTransactions(last30Days),
    last90Days: filterTransactions(last90Days),
  };
};

// Add any other utility functions you need here