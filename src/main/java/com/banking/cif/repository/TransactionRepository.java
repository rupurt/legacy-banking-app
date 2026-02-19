package com.banking.cif.repository;

import com.banking.cif.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByAccountAccountId(Integer accountId);
}
