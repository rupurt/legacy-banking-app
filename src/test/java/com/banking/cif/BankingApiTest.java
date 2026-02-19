package com.banking.cif;

import com.banking.cif.model.Account;
import com.banking.cif.model.Customer;
import com.banking.cif.model.Transaction;
import com.banking.cif.service.BankingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class BankingApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BankingService bankingService;

    @Test
    public void testCreateCustomerSuccess() throws Exception {
        Customer c = new Customer();
        c.setFirstName("Alice");
        c.setLastName("Smith");
        c.setEmail("alice.api@example.com");
        c.setDateOfBirth(LocalDate.of(1990, 1, 1));
        c.setCifNumber("CIF-API-001");

        mockMvc.perform(post("/api/v1/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(c)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName").value("Alice"));
    }

    @Test
    public void testCreateAccountSuccess() throws Exception {
        Customer c = new Customer();
        c.setFirstName("Bob");
        c.setLastName("Jones");
        c.setEmail("bob.api@example.com");
        c.setDateOfBirth(LocalDate.of(1990, 1, 1));
        c.setCifNumber("CIF-BOB-API");
        Customer savedCustomer = bankingService.createCustomer(c);

        Account a = new Account();
        a.setCustomerId(savedCustomer.getCustomerId());
        a.setProductCode("CHK-STD");

        mockMvc.perform(post("/api/v1/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(a)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    public void testDepositSuccess() throws Exception {
        Customer c = new Customer();
        c.setFirstName("Dave");
        c.setLastName("Smith");
        c.setEmail("dave.api@example.com");
        c.setDateOfBirth(LocalDate.of(1990, 1, 1));
        c.setCifNumber("CIF-DAVE-API");
        Customer savedCustomer = bankingService.createCustomer(c);

        Account a = new Account();
        a.setCustomerId(savedCustomer.getCustomerId());
        a.setProductCode("CHK-STD");
        Account savedAccount = bankingService.createAccount(a);

        Transaction t = new Transaction();
        t.setAccountId(savedAccount.getAccountId());
        t.setTransactionType("DEPOSIT");
        t.setAmount(new BigDecimal("500.00"));

        mockMvc.perform(post("/api/v1/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(t)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.balanceAfter").value(500.00));
    }

    @Test
    public void testRetrievePreSeededAccount() throws Exception {
        mockMvc.perform(get("/api/v1/accounts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountId").value(1))
                .andExpect(jsonPath("$.customerId").value(1));
    }
}