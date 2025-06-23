package com.personalfinance.service;

import com.personalfinance.model.Transaction;
import com.personalfinance.model.User;
import com.personalfinance.repository.TransactionRepository;
import com.personalfinance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Transaction> getUserTransactions(String username, String type) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (type != null) {
            return transactionRepository.findByUserAndType(user, type);
        }
        return transactionRepository.findByUser(user);
    }

    public Transaction createTransaction(String username, Transaction transaction) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    public Transaction getTransactionById(String username, Long id) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public Transaction updateTransaction(String username, Long id, Transaction transactionDetails) {
        Transaction transaction = getTransactionById(username, id);
        transaction.setDescription(transactionDetails.getDescription());
        transaction.setAmount(transactionDetails.getAmount());
        transaction.setDate(transactionDetails.getDate());
        transaction.setCategory(transactionDetails.getCategory());
        transaction.setType(transactionDetails.getType());
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(String username, Long id) {
        Transaction transaction = getTransactionById(username, id);
        transactionRepository.delete(transaction);
    }
}