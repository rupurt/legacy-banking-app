# Legacy Banking CIF Application

A modernized Customer Information File (CIF) system for a banking application. This project has been transformed from a legacy Java 8/Struts 2/Backbone.js application into a modern full-stack application.

## Modern Architecture

- **Backend:** Java 21, Spring Boot 3.x, Spring Data JPA
- **Database:** PostgreSQL (production-ready via Flyway migrations), H2 (in-memory for local development/testing)
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **API:** OpenAPI 3.0 specification with generated TypeScript client
- **Testing:** JUnit 5, Playwright (E2E)

## Getting Started

### Prerequisites

- Java 21
- Node.js (v18+)
- `just` (command runner)

### Quick Start

1. **Setup the project:**
   ```bash
   just setup
   ```

2. **Run the application:**
   ```bash
   just run
   ```
   The application will be available at `http://localhost:8080`.

## Development Tasks

The project uses `just` as a command runner for common development tasks:

| Command | Description |
| :--- | :--- |
| `just setup` | Clean and compile the project (Maven + Vite). |
| `just run` | Start the Spring Boot application and Serve the React frontend. |
| `just test` | Run backend unit and integration tests. |
| `just playwright-test` | Run End-to-End browser tests using Playwright. |
| `just build` | Package the application into a single executable JAR. |
| `just clean` | Remove build artifacts. |
| `just coverage` | Run tests and generate a JaCoCo coverage report. |

## Modernization Journey

This project was modernized in several phases. For a detailed summary of the changes and upcoming plans, see [SUMMARY.md](./SUMMARY.md).

### Completed Phases:
- [x] **Phase 1: Runtime Modernization** (Java 21 Upgrade)
- [x] **Phase 2: Stabilization & Observability** (E2E Tests & Logging)
- [x] **Phase 3: Backend Refactoring** (Spring Boot Migration)
- [x] **Phase 4: Frontend Modernization** (React & TypeScript)

### Future Work:
- [ ] **Phase 5: Infrastructure & Security** (Docker, Spring Security, Auditing)

## License
MIT
