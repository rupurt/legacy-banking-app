package com.banking.cif.repository;

import com.banking.cif.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    boolean existsByEmail(String email);
    List<Customer> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);
    
    @Query("SELECT c FROM Customer c LEFT JOIN FETCH c.accounts")
    List<Customer> findAllWithAccounts();
}
