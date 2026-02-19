package com.banking.cif.repository;

import com.banking.cif.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    List<Account> findByCustomerCustomerId(Integer customerId);
    boolean existsByAccountNumber(String accountNumber);
}
