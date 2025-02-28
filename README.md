# Azure DevOps MCP Server

A reference server implementation for the Model Context Protocol (MCP) that integrates with Azure DevOps. This server enables AI-driven workflows from user story creation to pull request management.

## Features

- Core Azure DevOps navigation (organizations, projects, repositories)
- Work item management (create/update user stories, tasks, bugs)
- Repository operations (file creation/updates, pushing changes)
- Branch and pull request management
- Pipeline interactions
- Search capabilities across Azure DevOps entities

## Prerequisites

- Node.js (v18 or higher)
- TypeScript
- Azure DevOps account with appropriate permissions
- Personal Access Token (PAT) or Azure Active Directory (AAD) credentials

## Installation

```bash
# Clone the repository
git clone [repository-url]
cd azure-devops-mcp

# Install dependencies
npm install
```

## Configuration

1. Create a `.env` file in the root directory:
```env
AZURE_DEVOPS_PAT=your_pat_here
AZURE_DEVOPS_ORG=your_organization
AZURE_DEVOPS_PROJECT=your_project
```

2. Configure authentication method in your MCP client:
```json
{
  "mcpServers": {
    "azuredevops": {
      "command": "npx",
      "args": ["-y", "@your-org/server-azuredevops"],
      "env": {
        "AUTH_METHOD": "PAT",
        "AZURE_DEVOPS_PAT": "<YOUR_PAT>",
        "AZURE_DEVOPS_ORG": "your-org",
        "AZURE_DEVOPS_PROJECT": "your-project"
      }
    }
  }
}
```

## Development

```bash
# Build the project
npm run build

# Run tests
npm test

# Run in development mode
npm run dev
```

## Testing

The project includes:
- Unit tests for individual tools
- Integration tests for end-to-end workflows
- Security tests for authentication and permissions

Run tests with:
```bash
npm test
npm run test:integration
npm run test:security
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

- Use environment variables for sensitive data
- Scope permissions appropriately in Azure DevOps
- Follow security best practices when handling credentials

## Support

For support, please:
1. Check the documentation in the `docs/` directory
2. Search existing issues
3. Open a new issue if needed
