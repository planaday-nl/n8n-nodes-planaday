# n8n-nodes-planaday

A custom n8n node for integrating with the Planaday API. This node allows you to create and manage student records through the Planaday REST API.

## Features

- **Student Management**: Create new student records with comprehensive data
- **Flexible Configuration**: Support for both test and production environments
- **Complete Student Data**: Handle required and optional student information fields

## Installation

### Prerequisites

- Node.js 18.10.0 or higher
- pnpm 9.1.0 or higher
- n8n instance (self-hosted or desktop)

### Install the node

```bash
# Clone the repository
git clone https://github.com/planaday-nl/n8n-nodes-planaday.git
cd n8n-nodes-planaday

# Install dependencies
pnpm install

# Build the node
pnpm build

# For self-hosted n8n
cp -r dist/* ~/.n8n/custom/
```

## Usage

### API Credentials Setup

1. In n8n, go to **Settings** > **Credentials**
2. Click **Add Credential** and search for "Planaday API"
3. Configure:
   - **API Key**: Your Planaday API key
   - **API URL**: `https://[customername]api.planaday.net/v1`

### Using the Node

1. Add a new node to your workflow
2. Search for "Planaday" and select it
3. Configure:
   - **Resource**: Student
   - **Operation**: Create
   - **Required Fields**:
     - First Name
     - Last Name
     - External ID
   - **Optional Fields** (in Additional Fields):
     - Address (street, house number, postal code, city)
     - Contact (mobile, email)

## Development

```bash
# Install dependencies
pnpm install

# Development mode (watch for changes)
pnpm dev

# Build the project
pnpm build

# Run linting
pnpm lint

# Fix linting issues
pnpm lintfix

# Start with Docker
pnpm docker-build

# Test in docker

```

### File Structure

```
n8n-nodes-planaday/
├── credentials/
│   └── PlanadayApi.credentials.ts    # API credentials configuration
├── nodes/
│   └── Planaday/
│       ├── Planaday.node.ts          # Main node implementation
│       └── planaday.svg              # Node icon
├── dist/                             # Built files (generated)
├── index.js                          # Main export file
├── package.json                      # Package configuration
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

### Common Issues

- **Authentication Errors**: Verify your API key and environment URL
- **Build Issues**: Ensure all dependencies are installed with `pnpm install`
- **Node Not Appearing**: Restart your n8n instance after installation

## License

MIT License - see LICENSE file for details.

## Support

- **Planaday API Documentation**: https://apidocs.planaday.nl
- **n8n Documentation**: https://docs.n8n.io
- **Issues**: Report bugs in the GitHub issues section
