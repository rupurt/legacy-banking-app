set shell := ["bash", "-c"]

# List available tasks
help:
  @just --list --unsorted

# Set up the project (clean and compile)
setup:
  ./mvnw clean compile

# Clean build artifacts
clean:
  ./mvnw clean

# Build the project (create WAR)
build:
  ./mvnw package -DskipTests

# Run static analysis (placeholder for now, could add checkstyle)
lint:
  @echo "No linting tool configured. Consider adding checkstyle-maven-plugin."

# Run tests
test:
  ./mvnw test

# Run Playwright E2E tests
playwright-test:
  npx playwright test

# Run tests with code coverage (requires jacoco)
coverage:
  ./mvnw clean test jacoco:report
  @echo "Coverage report: target/site/jacoco/index.html"

# Run the application using Jetty
run:
  ./mvnw jetty:run
