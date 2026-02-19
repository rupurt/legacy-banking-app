package com.banking.cif.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer accountId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnore
    private Customer customer;

    @Column(name = "customer_id", insertable = false, updatable = false)
    private Integer customerId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_code", nullable = false)
    @JsonIgnore
    private Product product;

    @Column(name = "product_code", insertable = false, updatable = false)
    private String productCode;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    @Column(length = 34)
    private String iban;

    @Column(precision = 15, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    private BigDecimal overdraftLimit = BigDecimal.ZERO;

    @Column(length = 20)
    private String status = "ACTIVE";

    private LocalDateTime openedAt;
    private LocalDateTime closedAt;

    @Column(length = 4000)
    private String configurations; // JSON

    @PrePersist
    protected void onOpen() {
        openedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Integer getAccountId() { return accountId; }
    public void setAccountId(Integer accountId) { this.accountId = accountId; }

    @JsonIgnore
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    @JsonProperty("customerId")
    public Integer getCustomerId() {
        return customerId != null ? customerId : (customer != null ? customer.getCustomerId() : null);
    }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    @JsonIgnore
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    @JsonProperty("productCode")
    public String getProductCode() {
        return productCode != null ? productCode : (product != null ? product.getProductCode() : null);
    }
    public void setProductCode(String productCode) { this.productCode = productCode; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public BigDecimal getOverdraftLimit() { return overdraftLimit; }
    public void setOverdraftLimit(BigDecimal overdraftLimit) { this.overdraftLimit = overdraftLimit; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getOpenedAt() { return openedAt; }
    public void setOpenedAt(LocalDateTime openedAt) { this.openedAt = openedAt; }

    public LocalDateTime getClosedAt() { return closedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }

    public String getConfigurations() { return configurations; }
    public void setConfigurations(String configurations) { this.configurations = configurations; }
}