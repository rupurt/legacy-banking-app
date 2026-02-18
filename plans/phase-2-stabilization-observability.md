# Phase 2: Stabilization & Observability

## Overview
Establish a safety net of End-to-End (E2E) tests and improve system observability. This phase ensures that subsequent architectural changes don't break existing user-facing functionality and that we can monitor the system's internal state during the transition.

## Dependencies
- **Pre-requisites:** None (can be done on Java 8 or 21).
- **Subsequent Phases:** All future phases rely on the E2E tests created here to verify "no regression."

## Detailed Tasks
1. **E2E Test Suite:** Implement a Playwright test suite covering critical paths:
   - Dashboard navigation.
   - Customer search and profile viewing.
   - New customer registration.
   - New account opening and transaction processing.
2. **Structured Logging:**
   - Update `log4j2.xml` to include a JSON layout appender.
   - Ensure log messages include relevant context (e.g., account IDs, customer IDs).
3. **API Contract Definition:**
   - Create an OpenAPI 3.0 specification file representing the current Struts-based REST API.
   - Use this to validate request/response shapes.
4. **Input Validation Hardening:**
   - Add explicit validation for transaction amounts (prevent negative values).
   - Ensure required fields in forms return proper `400 Bad Request` errors instead of 500s.

## Verifiable Acceptance Criteria
- [ ] `just playwright-test` (new task) runs and passes all scenarios.
- [ ] Application logs are emitted in JSON format, viewable in the console or a log file.
- [ ] Attempting to POST a transaction with a negative amount returns a `400` status code with a descriptive message.
- [ ] OpenAPI spec is available and matches the behavior of the `CustomersController`.

## Human Acceptance Script (Step-by-Step)
**Goal:** Verify that we can now observe and test the system reliably.

1. **Logging Verification:**
   - Run `just run` in one terminal.
   - Perform any action in the UI (e.g., search for a customer).
   - Inspect the terminal output.
   - **Expected:** Log entries should be valid JSON objects (e.g., `{"timestamp":"...", "level":"INFO", "message":"..."}`).
2. **Automated Test Verification:**
   - Run `npx playwright test`.
   - **Expected:** A browser should open (if not in headless mode) and automatically perform banking operations. All tests should pass.
3. **Validation Verification:**
   - Open a tool like `curl` or Postman.
   - Send a POST request to `/api/v1/transactions` with a negative amount:
     `curl -X POST -H "Content-Type: application/json" -d '{"accountId":1, "transactionType":"DEPOSIT", "amount":-50.0}' http://localhost:8080/api/v1/transactions`
   - **Expected:** The server should return a `400 Bad Request` error, not a `500` or a success message.
