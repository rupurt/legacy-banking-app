package com.banking.cif.controller;

import com.banking.cif.model.Transaction;
import com.banking.cif.service.BankingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {
    private final BankingService bankingService;

    public TransactionController(BankingService bankingService) {
        this.bankingService = bankingService;
    }

    @PostMapping
    public ResponseEntity<Transaction> processTransaction(@RequestBody Transaction transaction) {
        return new ResponseEntity<>(bankingService.processTransaction(transaction), HttpStatus.CREATED);
    }

    @GetMapping("/{accountId}")
    public List<Transaction> getTransactions(@PathVariable Integer accountId) {
        return bankingService.getTransactions(accountId);
    }
}
