package com.banking.cif.service;

import com.banking.cif.model.Account;
import com.banking.cif.model.Customer;
import com.banking.cif.model.Product;
import com.banking.cif.model.Transaction;
import com.banking.cif.repository.AccountRepository;
import com.banking.cif.repository.CustomerRepository;
import com.banking.cif.repository.ProductRepository;
import com.banking.cif.repository.TransactionRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class BankingService {
    private static final Logger logger = LogManager.getLogger(BankingService.class);

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;

    public BankingService(CustomerRepository customerRepository,
                          AccountRepository accountRepository,
                          ProductRepository productRepository,
                          TransactionRepository transactionRepository) {
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
        this.productRepository = productRepository;
        this.transactionRepository = transactionRepository;
    }

    // --- Customer Operations ---

    public Customer createCustomer(Customer customer) {
        logger.info("Creating customer with email: {}", customer.getEmail());
        if (customerRepository.existsByEmail(customer.getEmail())) {
            logger.warn("Customer creation failed: Email {} already exists", customer.getEmail());
            throw new RuntimeException("Email already exists");
        }
        if (customer.getCifNumber() == null || customer.getCifNumber().isEmpty()) {
            customer.setCifNumber("CIF-" + System.currentTimeMillis());
        }
        return customerRepository.save(customer);
    }

    public Customer getCustomer(Integer id) {
        logger.info("Fetching customer with ID: {}", id);
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public List<Customer> getCustomersByName(String name) {
        logger.info("Searching customers by name: {}", name);
        return customerRepository.findByFirstNameContainingOrLastNameContaining(name, name);
    }

    public List<Customer> getAllCustomers() {
        logger.info("Fetching all customers");
        return customerRepository.findAllWithAccounts();
    }

    // --- Account Operations ---

    public Account createAccount(Account account) {
        logger.info("Creating account for customer: {}, product: {}", account.getCustomerId(), account.getProductCode());
        
        Product product = productRepository.findById(account.getProductCode())
                .orElseThrow(() -> new RuntimeException("Invalid Product Code"));
        
        Customer customer = customerRepository.findById(account.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        account.setCustomer(customer);
        account.setProduct(product);

        if (account.getAccountNumber() == null) {
            Random rand = new Random();
            account.setAccountNumber(String.valueOf(11111111 + rand.nextInt(88888889)));
        }
        
        if (account.getBalance() == null) {
            account.setBalance(BigDecimal.ZERO);
        }

        return accountRepository.save(account);
    }

    public Account getAccount(Integer id) {
        logger.info("Fetching account with ID: {}", id);
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public List<Account> getAccountsByCustomerId(Integer customerId) {
        logger.info("Fetching accounts for customer: {}", customerId);
        return accountRepository.findByCustomerCustomerId(customerId);
    }

    public void updateAccountStatus(Integer id, String status) {
        logger.info("Updating account status for ID {}: {}", id, status);
        Account account = getAccount(id);
        account.setStatus(status);
        accountRepository.save(account);
    }

    // --- Transaction Operations ---

    public Transaction processTransaction(Transaction transaction) {
        logger.info("Processing {} for account {}: amount {}", 
                transaction.getTransactionType(), transaction.getAccountId(), transaction.getAmount());
        
        if (transaction.getAmount() == null || transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            logger.warn("Transaction failed: Invalid amount {}", transaction.getAmount());
            throw new RuntimeException("Transaction amount must be positive");
        }

        Account account = accountRepository.findById(transaction.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        BigDecimal newBalance = account.getBalance();
        String type = transaction.getTransactionType();
        
        if ("DEPOSIT".equals(type)) {
            newBalance = newBalance.add(transaction.getAmount());
        } else if ("WITHDRAWAL".equals(type) || "WITHDRAW".equals(type)) {
            if (newBalance.compareTo(transaction.getAmount()) < 0) {
                logger.warn("Transaction failed: Insufficient funds in account {}", transaction.getAccountId());
                throw new RuntimeException("Insufficient funds");
            }
            newBalance = newBalance.subtract(transaction.getAmount());
        } else {
             logger.warn("Transaction failed: Invalid transaction type {}", type);
             throw new RuntimeException("Invalid transaction type");
        }

        // Update account
        account.setBalance(newBalance);
        accountRepository.save(account);

        // Create transaction record
        transaction.setAccount(account);
        transaction.setBalanceAfter(newBalance);
        Transaction created = transactionRepository.save(transaction);

        logger.info("Transaction processed successfully for account {}. New balance: {}", 
                transaction.getAccountId(), newBalance);
        return created;
    }

    public List<Transaction> getTransactions(Integer accountId) {
        logger.info("Fetching transactions for account: {}", accountId);
        return transactionRepository.findByAccountAccountId(accountId);
    }
}