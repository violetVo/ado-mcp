# Technical Context

## Technology Stack

### Core Technologies
- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** MCP SDK (@modelcontextprotocol/sdk)
- **Testing:** Jest
- **Code Quality:** ESLint, Prettier

### Dependencies
- MCP SDK for server implementation
- Azure DevOps Node.js SDK for API integration
- Jest for unit and integration testing
- TypeScript for type safety and development
- ESLint & Prettier for code quality

## Development Setup
1. Node.js environment required
2. TypeScript compilation configured via tsconfig.json
3. ESLint and Prettier for code formatting
4. Jest configured for both unit and integration tests

## Authentication Methods
Multiple authentication methods supported:
1. Personal Access Token (PAT)
2. Azure Identity
3. Azure CLI

## Project Structure
```
src/
├── api/            # API client and authentication
├── auth/           # Authentication handlers
├── common/         # Shared utilities
├── config/         # Configuration management
├── operations/     # Azure DevOps operations
└── types/         # TypeScript type definitions

tests/
├── integration/    # Integration tests
└── unit/          # Unit tests
```

## Technical Constraints
1. Must follow MCP server specification
2. Must handle Azure DevOps API rate limits
3. Must support enterprise authentication requirements
4. Must maintain type safety throughout
5. Must have comprehensive test coverage

## Build and Test Process
- TypeScript compilation via `tsc`
- Unit tests with Jest
- Integration tests with separate configuration
- ESLint and Prettier for code quality

## Configuration Requirements
- Environment variables for authentication
- MCP server configuration in settings
- Test configurations for different environments

## Logging and Error Handling
- Structured error types in common/errors.ts
- Comprehensive logging throughout operations
- API error handling and rate limit management
