# Phase 4: Frontend Modernization (The "Backbone-to-React" Rewrite)

## Overview
Modernize the user interface by replacing the legacy Backbone.js/jQuery application with a component-based React application written in TypeScript. This phase focuses on developer experience, type safety, and a cleaner architecture while maintaining feature parity.

## Dependencies
- **Pre-requisites:** Phase 3 (Spring Boot) and API contract (OpenAPI).
- **Subsequent Phases:** Phase 5 (Infrastructure & Security).

## Detailed Tasks
1. **Frontend Tooling Setup:**
   - [x] Initialize a new React project using Vite and TypeScript.
   - [x] Configure ESLint, Prettier, and standard React testing libraries.
   - [x] Integrate with the existing Maven build process (e.g., using `frontend-maven-plugin`).
2. **API Client Generation:**
   - [x] Generate a TypeScript API client from the `openapi.yaml` specification.
   - [x] Replace manual AJAX calls and model-shape hacks with typed API service methods.
3. **Component Migration:**
   - [x] Create a reusable UI component library using a CSS framework (e.g., Bootstrap or Tailwind).
   - [x] Port Backbone views to React components:
     - [x] `CustomerListView` -> `CustomerList` component.
     - [x] `CustomerDetailView` -> `CustomerDetail` component.
     - [x] `AccountSummaryView` -> `AccountSummary` component.
     - [x] `TransactionView` -> `TransactionForm` component.
4. **State Management & Routing:**
   - [x] Implement client-side routing using `react-router-dom`.
   - [x] Manage application state (e.g., current customer, account list) using modern React patterns (Hooks, Context API).
5. **Validation & UX Enhancements:**
   - [x] Implement robust form validation using `react-hook-form` and `zod`.
   - [x] Add loading states, error boundaries, and improved feedback to the user.

## Verifiable Acceptance Criteria
- [x] No `backbone.js` or `underscore.js` files are loaded by the browser.
- [x] The build process generates a single, optimized production bundle.
- [x] TypeScript compilation passes with zero errors.
- [x] All existing Playwright tests from Phase 2 pass against the new React implementation.
- [x] No manual AJAX calls exist in the source code (all go through the generated API client).

## Human Acceptance Script (Step-by-Step)
**Goal:** Verify the system is running on a modern React frontend with no loss of feature parity and improved UX.

1. **Build & Startup Verification:**
   - Run the application (e.g., `./mvnw spring-boot:run`).
   - **Expected:** The application should start, and the console should indicate that the frontend build (Vite) was integrated into the static resources.
2. **Feature Parity Check:**
   - Navigate to `http://localhost:8080/`.
   - **Expected:** The dashboard should load, showing the list of customers and recent activity, similar to the legacy application but with a modernized look and feel.
3. **End-to-End Flow Verification:**
   - Register a new customer.
   - Open an account for the new customer.
   - Perform a deposit and withdrawal.
   - **Expected:** All operations should complete successfully, with clear feedback provided by the UI at each step.
4. **Error Handling Verification:**
   - Attempt to perform a transaction with an invalid amount or missing data.
   - **Expected:** The UI should prevent the submission or display clear validation errors returned from the API, handled gracefully by React.
5. **Regression Verification:**
   - Run `npm run playwright-test`.
   - **Expected:** All tests pass, confirming that the new React frontend correctly interacts with the Spring Boot API.