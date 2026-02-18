# Phase 3: Backend Refactoring (The "Struts-to-Spring" Pivot)

## Overview
The most significant architectural shift: migrating the core framework from Struts 2 to Spring Boot. This involves replacing the legacy REST plugin with Spring Web (`@RestController`) and the manual JDBC DAOs with Spring Data JPA.

## Dependencies
- **Pre-requisites:** Phase 1 (Java 21) and Phase 2 (for E2E verification).
- **Subsequent Phases:** Phase 4 (Frontend) and Phase 5 (Infrastructure).

## Detailed Tasks
1. **Spring Boot Bootstrap:**
   - Add Spring Boot Starter dependencies to `pom.xml`.
   - Create a `@SpringBootApplication` main class.
2. **Data Layer Migration:**
   - Define JPA Entities for `Customer`, `Account`, `Product`, and `Transaction`.
   - Create Spring Data `Repository` interfaces to replace `CustomerDAO`, etc.
   - Implement Flyway or Liquibase for schema management.
3. **Service Layer Refactoring:**
   - Convert `BankingService` into a Spring `@Service`.
   - Ensure transaction management is handled via `@Transactional`.
4. **Controller Migration:**
   - Rewrite Struts Controllers as Spring `@RestController` classes.
   - Map routes to match existing API paths (`/api/v1/...`).
   - Remove Struts dependencies and `web.xml` configuration.

## Verifiable Acceptance Criteria
- [ ] `pom.xml` no longer contains `struts2-core` or related plugins.
- [ ] Application starts as a standalone JAR/Spring Boot app.
- [ ] Existing Playwright tests (from Phase 2) pass against the new Spring Boot implementation without modification.
- [ ] Unit tests for the new `@Service` layer have >80% code coverage.

## Human Acceptance Script (Step-by-Step)
**Goal:** Verify the system is running on Spring Boot with no loss of functionality.

1. **Startup Verification:**
   - Run `mvn spring-boot:run` or `java -jar target/banking-app.jar`.
   - **Expected:** The console should show the Spring Boot logo and "Started [ApplicationName] in X seconds".
2. **API Parity Verification:**
   - Open `http://localhost:8080/api/v1/customers`.
   - **Expected:** A JSON list of customers should be returned, exactly matching the format of the old Struts API.
3. **Persistence Verification:**
   - Navigate to the UI and create a new customer.
   - Restart the application.
   - Navigate to the customer list.
   - **Expected:** The new customer should still exist (verifying the new JPA/Repository layer is working).
4. **Regression Testing:**
   - Run `npx playwright test`.
   - **Expected:** All tests pass, confirming that the framework swap was transparent to the end user.
