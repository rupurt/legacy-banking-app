# Phase 1: Runtime Modernization (Java 21 Upgrade)

## Overview
Upgrade the core application runtime from Java 8 to Java 21 (LTS). This provides the foundation for modern framework adoption, improved performance, and access to modern language features like Records and Virtual Threads.

## Dependencies
- **Pre-requisites:** None. This is the foundational step.
- **Subsequent Phases:** Phase 3 (Spring Boot) requires Java 17+, making this a hard dependency.

## Detailed Tasks
1. **Environment Update:** Update `flake.nix` and `.envrc` to provide JDK 21 instead of JDK 8.
2. **Build Configuration:** Update `pom.xml` properties (`maven.compiler.source` and `maven.compiler.target`) to `21`.
3. **Dependency Audit:** Check for libraries that are incompatible with Java 21 (e.g., old versions of ASM or CGLIB) and upgrade them.
4. **Code Compatibility:** Resolve any compilation errors caused by removed or deprecated APIs in the standard library.
5. **Tooling Update:** Ensure `justfile` and `mvnw` are compatible with the new runtime.

## Verifiable Acceptance Criteria
- [x] `java -version` returns `openjdk version "21.x.x"`.
- [x] `mvn clean compile` completes without errors or warnings related to version mismatches.
- [x] `just test` passes all existing unit and integration tests on the new runtime.
- [x] Application starts successfully via `just run`.

## Human Acceptance Script (Step-by-Step)
**Goal:** Verify the application still functions correctly on the new Java version.

1. **Environment Verification:**
   - Open a terminal in the project root.
   - Run `java -version`.
   - **Expected:** The output must confirm version 21.
2. **Build Verification:**
   - Run `just setup`.
   - **Expected:** The build should complete with "BUILD SUCCESS".
3. **Runtime Verification:**
   - Run `just run`.
   - Wait for the message: `[INFO] Started Jetty Server`.
   - Open a web browser to `http://localhost:8080`.
   - **Expected:** The "Legacy Bank Corporate Intranet" dashboard should load correctly.
4. **Functional Smoke Test:**
   - Click on "Customer List" in the sidebar.
   - **Expected:** A table of customers (John Smith, Jane Doe, etc.) should be visible.
   - Click "View Profile" for any customer.
   - **Expected:** The profile details and account list should load without errors.
