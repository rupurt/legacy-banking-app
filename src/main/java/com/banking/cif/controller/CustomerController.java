package com.banking.cif.controller;

import com.banking.cif.model.Customer;
import com.banking.cif.service.BankingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {
    private final BankingService bankingService;

    public CustomerController(BankingService bankingService) {
        this.bankingService = bankingService;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return bankingService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomer(@PathVariable String id) {
        try {
            Integer intId = Integer.parseInt(id);
            return ResponseEntity.ok(bankingService.getCustomer(intId));
        } catch (NumberFormatException nfe) {
            List<Customer> customers = bankingService.getCustomersByName(id);
            if (!customers.isEmpty()) {
                return ResponseEntity.ok(customers.get(0));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        return new ResponseEntity<>(bankingService.createCustomer(customer), HttpStatus.CREATED);
    }
}
