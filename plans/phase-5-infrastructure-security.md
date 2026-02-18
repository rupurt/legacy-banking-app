# Phase 5: Infrastructure & Security

## Overview
Transition the application to a production-ready state by containerizing the environment, implementing robust authentication, and adding audit trails for sensitive banking operations.

## Dependencies
- **Pre-requisites:** Phase 3 (Spring Boot) and Phase 4 (React).

## Detailed Tasks
1. **Containerization:**
   - Create a multi-stage `Dockerfile` (build React, build Spring Boot, final runtime image).
   - Create a `docker-compose.yml` to spin up the app and a real PostgreSQL database.
2. **Authentication & Authorization:**
   - Implement Spring Security with JWT or OAuth2/OIDC.
   - Add a login page to the React frontend.
   - Define roles: `TELLER` (can perform transactions) and `MANAGER` (can delete customers).
3. **Audit Logging:**
   - Implement an `@Audit` annotation or AOP aspect to capture all mutations.
   - Store audit records in a dedicated `audit_logs` table (Timestamp, User, Action, EntityID, Payload).
4. **CI/CD Pipeline:**
   - Create a GitHub Action to run tests, build the image, and push to a registry.

## Verifiable Acceptance Criteria
- [ ] `docker-compose up` starts the entire system.
- [ ] Unauthorized requests to `/api/v1/customers` return a `401 Unauthorized`.
- [ ] The `audit_logs` table is populated whenever a transaction is processed or a customer is created.
- [ ] Docker image scanning shows no high or critical vulnerabilities in the base image.

## Human Acceptance Script (Step-by-Step)
**Goal:** Verify the system is secure and production-ready.

1. **Infrastructure Verification:**
   - Run `docker-compose down -v` then `docker-compose up`.
   - **Expected:** The system should pull images, start a database, and the app should become available on port 8080.
2. **Security Verification (Authentication):**
   - Open an Incognito browser window to `http://localhost:8080`.
   - **Expected:** You should be redirected to a Login page. Attempting to navigate elsewhere should fail.
   - Log in with valid credentials.
   - **Expected:** Access granted.
3. **Security Verification (Authorization):**
   - Log in as a `TELLER`.
   - Try to perform a "Delete Customer" action.
   - **Expected:** The action should be disabled in the UI or return a `403 Forbidden` from the API.
4. **Audit Verification:**
   - Perform a "Deposit" of $100.00 into any account.
   - Use a database tool to check the `audit_logs` table.
   - **Expected:** An entry should exist showing your user performed a `DEPOSIT` on that account ID at the exact time of the transaction.