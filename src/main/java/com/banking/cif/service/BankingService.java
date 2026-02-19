package com.banking.cif.service;

import com.banking.cif.dao.AccountDAO;
import com.banking.cif.dao.CustomerDAO;
import com.banking.cif.dao.ProductDAO;
import com.banking.cif.dao.TransactionDAO;
import com.banking.cif.model.Account;
import com.banking.cif.model.Customer;
import com.banking.cif.model.Product;
import com.banking.cif.model.Transaction;
import com.banking.cif.util.DBConnection;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class BankingService {
    private static final Logger logger = LogManager.getLogger(BankingService.class);

    private CustomerDAO customerDAO = new CustomerDAO();
    private AccountDAO accountDAO = new AccountDAO();
    private ProductDAO productDAO = new ProductDAO();
    private TransactionDAO transactionDAO = new TransactionDAO();

    // --- Customer Operations ---

    public Customer createCustomer(Customer customer) throws Exception {
        logger.info("Creating customer with email: {}", customer.getEmail());
        if (customerDAO.emailExists(customer.getEmail())) {
            logger.warn("Customer creation failed: Email {} already exists", customer.getEmail());
            throw new Exception("Email already exists");
        }
        // Basic validation
        if (customer.getCifNumber() == null || customer.getCifNumber().isEmpty()) {
             // Generate CIF if missing or throw error? Spec says provided in body for create.
             // Test says "CIF-2024-001".
        }
        return customerDAO.create(customer);
    }

    public Customer getCustomer(Integer id) throws Exception {
        logger.info("Fetching customer with ID: {}", id);
        Customer c = customerDAO.findById(id);
        if (c == null) {
            logger.warn("Customer with ID {} not found", id);
            throw new Exception("Customer not found");
        }
        return c;
    }

    public List<Customer> getCustomersByName(String name) throws Exception {
        logger.info("Searching customers by name: {}", name);
        return customerDAO.findByName(name);
    }

    public List<Customer> getAllCustomers() throws Exception {
        logger.info("Fetching all customers");
        return customerDAO.findAllWithAccountCount();
    }

    // --- Account Operations ---

    public Account createAccount(Account account) throws Exception {
        logger.info("Creating account for customer: {}, product: {}", account.getCustomerId(), account.getProductCode());
        Product p = productDAO.findByCode(account.getProductCode());
        if (p == null) {
            logger.warn("Account creation failed: Invalid Product Code {}", account.getProductCode());
            throw new Exception("Invalid Product Code");
        }
        // validate customer exists
        if (customerDAO.findById(account.getCustomerId()) == null) {
            logger.warn("Account creation failed: Customer {} not found", account.getCustomerId());
            throw new Exception("Customer not found");
        }
        
        return accountDAO.create(account);
    }

    public Account getAccount(Integer id) throws Exception {
        logger.info("Fetching account with ID: {}", id);
        Account a = accountDAO.findById(id);
        if (a == null) {
            logger.warn("Account with ID {} not found", id);
            throw new Exception("Account not found");
        }
        return a;
    }

    public List<Account> getAccountsByCustomerId(Integer customerId) throws Exception {
        logger.info("Fetching accounts for customer: {}", customerId);
        return accountDAO.findByCustomerId(customerId);
    }

    public void updateAccountStatus(Integer id, String status) throws Exception {
        logger.info("Updating account status for ID {}: {}", id, status);
        if (accountDAO.findById(id) == null) {
            logger.warn("Account status update failed: Account {} not found", id);
            throw new Exception("Account not found");
        }
        accountDAO.updateStatus(id, status);
    }

    // --- Transaction Operations ---

    public Transaction processTransaction(Transaction transaction) throws Exception {
        logger.info("Processing {} for account {}: amount {}", 
                transaction.getTransactionType(), transaction.getAccountId(), transaction.getAmount());
        
        if (transaction.getAmount() == null || transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            logger.warn("Transaction failed: Invalid amount {}", transaction.getAmount());
            throw new Exception("Transaction amount must be positive");
        }

        // Atomic transaction
        try (Connection conn = DBConnection.getConnection()) {
            conn.setAutoCommit(false);
            try {
                Account account = accountDAO.findById(conn, transaction.getAccountId());
                if (account == null) {
                    logger.warn("Transaction failed: Account {} not found", transaction.getAccountId());
                    throw new Exception("Account not found");
                }

                BigDecimal newBalance = account.getBalance();
                if ("DEPOSIT".equals(transaction.getTransactionType())) {
                    newBalance = newBalance.add(transaction.getAmount());
                } else if ("WITHDRAWAL".equals(transaction.getTransactionType()) || "WITHDRAW".equals(transaction.getTransactionType())) {
                    if (newBalance.compareTo(transaction.getAmount()) < 0) {
                        logger.warn("Transaction failed: Insufficient funds in account {}", transaction.getAccountId());
                        throw new Exception("Insufficient funds");
                    }
                    newBalance = newBalance.subtract(transaction.getAmount());
                } else {
                     logger.warn("Transaction failed: Invalid transaction type {}", transaction.getTransactionType());
                     throw new Exception("Invalid transaction type");
                }

                // Update account
                accountDAO.updateBalance(conn, account.getAccountId(), newBalance);

                // Create transaction record
                transaction.setBalanceAfter(newBalance);
                Transaction created = transactionDAO.create(conn, transaction);

                conn.commit();
                logger.info("Transaction processed successfully for account {}. New balance: {}", 
                        transaction.getAccountId(), newBalance);
                return created;

            } catch (Exception e) {
                conn.rollback();
                logger.error("Transaction failed for account {}: {}", transaction.getAccountId(), e.getMessage());
                throw e;
            }
        }
    }

    public List<Transaction> getTransactions(Integer accountId) throws Exception {
        logger.info("Fetching transactions for account: {}", accountId);
        return transactionDAO.findByAccountId(accountId);
    }
}
