# Contributing to RapidForge

Thank you for your interest in contributing to RapidForge! We welcome contributions from the community and are grateful for your support.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/rapidforge.git
   cd rapidforge
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/rapidforge-io/rapidforge.git
   ```

## Development Setup

### Prerequisites

- Go 1.21 or higher
- SQLite 3
- Node.js 18+ (for frontend development)
- Make (optional, for using Makefile commands)

### Building from Source

```bash
# Build the main application
go build -o rapidforge

# Run the application
./rapidforge
```

### Frontend Development

The project includes two frontend sub-projects:

**Admin Interface (`sitebuilder/`):**
```bash
cd sitebuilder
npm install
npm run dev  # Development mode
npm run build  # Production build
```

**CodeMirror Editor (`codemirroreditor/`):**
```bash
cd codemirroreditor
npm install
npm run dev
npm run build
```

### Database Migrations

Migrations are located in `database/migrations/`. The application automatically runs pending migrations on startup.

To create a new migration:
```bash
# Create a new migration file in database/migrations/
# Format: YYYYMMDDHHMMSS_description.sql
```

## How to Contribute

### Reporting Bugs

- Use the GitHub issue tracker
- Check if the issue already exists
- Include detailed steps to reproduce
- Provide system information (OS, Go version, etc.)
- Include relevant logs or error messages

### Suggesting Enhancements

- Open a GitHub issue with the "enhancement" label
- Clearly describe the feature and its use case
- Discuss the implementation approach
- Be open to feedback and alternative solutions

### Working on Issues

1. Comment on the issue you'd like to work on
2. Wait for approval/assignment from maintainers
3. Create a feature branch from `main`
4. Make your changes
5. Submit a pull request

## Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clear, concise commit messages
   - Follow the coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Keep your branch updated**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

4. **Run tests**:
   ```bash
   go test ./...
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**:
   - Use a clear, descriptive title
   - Reference related issues (e.g., "Fixes #123")
   - Describe what changed and why
   - Include screenshots for UI changes
   - Ensure CI checks pass

7. **Code Review**:
   - Address reviewer feedback
   - Push additional commits as needed
   - Maintainers will merge once approved

## Coding Standards

### Go Code

- Follow standard Go formatting (`go fmt`)
- Use `gofmt` or `goimports` before committing
- Follow [Effective Go](https://golang.org/doc/effective_go.html) guidelines
- Write meaningful variable and function names
- Add comments for exported functions and complex logic
- Keep functions focused and concise

### JavaScript/TypeScript

- Use ESLint configuration provided
- Follow React best practices for components
- Use TypeScript types where applicable
- Keep components small and reusable

### General Guidelines

- Write self-documenting code
- Avoid premature optimization
- Handle errors appropriately
- Don't commit commented-out code
- Remove debug statements before committing

## Testing

### Running Tests

```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run specific package tests
go test ./runner
```

### Writing Tests

- Write tests for new features
- Maintain or improve code coverage
- Use table-driven tests where appropriate
- Mock external dependencies
- Test edge cases and error conditions

### End-to-End Tests

E2E tests are located in `e2e/` using Playwright:

```bash
cd e2e
npm install
npm test
```

## Documentation

### Code Documentation

- Add godoc comments for exported functions, types, and packages
- Include usage examples in comments where helpful
- Update inline comments when changing logic

### User Documentation

- Update README.md for user-facing changes
- Add examples to demonstrate new features
- Keep documentation in sync with code changes

### API Documentation

- Document new endpoints and parameters
- Include request/response examples
- Note breaking changes prominently

## Questions?

If you have questions about contributing, feel free to:

- Open a GitHub discussion
- Ask in an existing issue
- Reach out to the maintainers

---

Thank you for contributing to RapidForge! 🚀
