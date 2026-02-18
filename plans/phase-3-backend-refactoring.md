# Phase 3: Backend Refactoring (The "Struts-to-Spring" Pivot)

## Overview
The most significant architectural shift: migrating the core framework from Struts 2 to Spring Boot. This involves replacing the legacy REST plugin with Spring Web (`@RestController`) and the manual JDBC DAOs with Spring Data JPA.

## Dependencies
- **Pre-requisites:** Phase 1 (Java 21) and Phase 2 (for E2E verification).
- **Subsequent Phases:** Phase 4 (Frontend Modernization) and Phase 5 (Infrastructure & Security).

## Detailed Tasks
1. **Spring Boot Bootstrap:**
   - Add Spring Boot Starter dependencies (web, data-jpa, validation) to `pom.xml`.
   - Create a `@SpringBootApplication` main class and remove `web.xml`.
2. **Data Layer Migration:**
   - Define JPA Entities for `Customer`, `Account`, `Product`, and `Transaction` with proper mappings.
   - Create Spring Data `Repository` interfaces to replace manual `CustomerDAO`, `AccountDAO`, etc.
   - Introduce Flyway for controlled schema migrations, replacing `DatabaseInitializer`.
3. **Service Layer Refactoring:**
   - Convert `BankingService` into a Spring `@Service`.
   - Implement declarative transaction management using `@Transactional`.
   - Fix "silent no-op" transaction logic by introducing explicit validation and error throwing.
4. **Controller Migration:**
   - Rewrite Struts Controllers as Spring `@RestController` classes.
   - Maintain API parity by mapping routes to existing paths (`/api/v1/customers`, etc.).
   - Implement global error handling using `@ControllerAdvice`.
5. **Dependency Injection:**
   - Replace manual instantiation (`new BankingService()`) with constructor injection.

## Verifiable Acceptance Criteria
- [ ] `pom.xml` contains no references to `org.apache.struts`.
- [ ] Application starts successfully as a standalone Spring Boot application.
- [ ] JPA entities correctly map to the existing database schema (or migrated schema via Flyway).
- [ ] All existing Playwright tests from Phase 2 pass against the new Spring Boot backend.
- [ ] Invalid transaction types or amounts return a structured `400 Bad Request` instead of a silent failure.

## Human Acceptance Script (Step-by-Step)
**Goal:** Verify the system is running on Spring Boot with improved robustness and no loss of feature parity.

1. **Startup Verification:**
   - Run the application (e.g., `mvn spring-boot:run`).
   - **Expected:** The console output should show the Spring Boot startup sequence and the message "Started [ApplicationName] in X seconds".
2. **REST API Parity Verification:**
   - Open a browser or use `curl` to GET `http://localhost:8080/api/v1/customers`.
   - **Expected:** A JSON list of customers should be returned in the same format as the original application.
3. **Data Persistence Verification:**
   - Use the UI to register a new customer and open an account.
   - Perform a deposit transaction.
   - Restart the application.
   - **Expected:** All data (customer, account, and transaction history) should persist and be visible after the restart.
4. **Robustness Verification:**
   - Use `curl` to send a POST request with an invalid transaction type (e.g., "GIFT").
   - **Expected:** The server must return a `400 Bad Request` with a clear error message, and no transaction record should be created.
5. **Regression Verification:**
   - Run `npx playwright test`.
   - **Expected:** All tests pass, confirming that the framework swap was transparent to the frontend and user experience.
