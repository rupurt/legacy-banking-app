package com.banking.cif.controller;

import com.banking.cif.model.Account;
import com.banking.cif.service.BankingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {
    private final BankingService bankingService;

    public AccountController(BankingService bankingService) {
        this.bankingService = bankingService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable Integer id) {
        return ResponseEntity.ok(bankingService.getAccount(id));
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        return new ResponseEntity<>(bankingService.createAccount(account), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable Integer id, @RequestBody Account account) {
        if (account.getStatus() != null) {
            bankingService.updateAccountStatus(id, account.getStatus());
        }
        return ResponseEntity.ok(bankingService.getAccount(id));
    }
}
