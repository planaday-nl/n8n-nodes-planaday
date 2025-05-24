# n8n-nodes-planaday

Custom n8n node for integrating with the Planaday API. This node allows you to create and manage student records through the Planaday REST API.

## Features

- **Student Management**: Create new student records with comprehensive data
- **Flexible Configuration**: Support for both test and production environments
- **Complete Student Data**: Handle required fields (firstname, lastname, external_id) and optional fields (initials, prefix, address, contact, date_of_birth)

## Installation

### Prerequisites

- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- n8n instance (self-hosted or desktop)

### Install the node

1. Clone this repository:
```bash
git clone https://github.com/n8n-io/n8n-nodes-planaday.git
cd n8n-nodes-planaday
```

2. Install dependencies:
```bash
npm install
```

3. Build the node:
```bash
npm run build
```

4. Install the node in your n8n instance:

#### For self-hosted n8n:
```bash
# Copy the built files to your n8n custom nodes directory
cp -r dist/* ~/.n8n/custom/
```

#### For n8n desktop:
```bash
# Install as an npm package
npm link
# Then in your n8n installation directory
npm link n8n-nodes-planaday
```

#### Alternative: Install from npm (when published)
```bash
npm install n8n-nodes-planaday
```

## Configuration

### 1. Set up Planaday API Credentials

1. In your n8n instance, go to **Settings** > **Credentials**
2. Click **Add Credential** and search for "Planaday API"
3. Configure the following:
   - **API Key**: Your Planaday API key
   - **API URL**: The base URL for your Planaday API instance
     - Test environment: `https://apitest.api.planaday.net/v1` (default)
     - Production environment: `https://api.planaday.net/v1`
     - Custom instances: Use your specific API URL

### 2. Using the Node

1. In your n8n workflow, add a new node
2. Search for "Planaday" and select it
3. Configure the node:
   - **Credential**: Select your Planaday API credential
   - **Resource**: Student (currently the only supported resource)
   - **Operation**: Create (creates a new student)
   - **Required Fields**:
     - First Name
     - Last Name  
     - External ID
   - **Optional Fields** (in Additional Fields):
     - Initials
     - Prefix
     - Date of Birth
     - Address (street, house number, postal code, city)
     - Contact (mobile, email)

## API Endpoints

### Student Creation (POST /student)

Creates a new student record in Planaday.

**Required Parameters:**
- `firstname` (string): Student's first name
- `lastname` (string): Student's last name
- `external_id` (string): External identifier for the student

**Optional Parameters:**
- `initials` (string): Student's initials
- `prefix` (string): Name prefix (e.g., van, de)
- `date_of_birth` (datetime): Student's date of birth
- `address` (object):
  - `street` (string): Street name
  - `housenumber` (string): House number
  - `postal_code` (string): Postal/ZIP code
  - `city` (string): City name
- `contact` (object):
  - `mobile` (string): Mobile phone number
  - `email` (string): Email address

**Response:**
- `external_id`: The external ID provided
- `student_id`: Generated student ID from Planaday
- `company_id`: Associated company ID
- Success message

## Development

### Build and Test

1. **Install dependencies:**
```bash
npm install
```

2. **Build the project:**
```bash
npm run build
```

3. **Development mode (watch for changes):**
```bash
npm run dev
```

4. **Run linting:**
```bash
npm run lint
```

5. **Fix linting issues:**
```bash
npm run lintfix
```

6. **Run tests:**
```bash
npm test
```

### Testing the Node

#### Unit Testing
Create test files in a `test/` directory and run:
```bash
npm test
```

#### Integration Testing with n8n

1. **Manual Testing:**
   - Set up a test workflow in n8n
   - Configure the Planaday node with test credentials
   - Create a test student with sample data
   - Verify the response matches expected format

2. **Test Data Example:**
```json
{
  "firstname": "John",
  "lastname": "Doe", 
  "external_id": "TEST001",
  "initials": "J.D.",
  "address": {
    "street": "Main Street",
    "housenumber": "123",
    "postal_code": "1234AB",
    "city": "Amsterdam"
  },
  "contact": {
    "mobile": "+31612345678",
    "email": "john.doe@example.com"
  }
}
```

### File Structure

```
n8n-nodes-planaday/
├── credentials/
│   └── PlanadayApi.credentials.ts    # API credentials configuration
├── nodes/
│   └── Planaday/
│       ├── Planaday.node.ts          # Main node implementation
│       ├── Planaday.node.json        # Node metadata
│       └── planaday.svg              # Node icon
├── dist/                             # Built files (generated)
├── index.ts                          # Main export file
├── package.json                      # Package configuration
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

### Extending the Node

To add more operations or resources:

1. **Add new operations** to the `operation` options in `Planaday.node.ts`
2. **Add new parameters** in the `properties` array
3. **Implement the logic** in the `execute` method
4. **Update the credentials** if new authentication is needed
5. **Test thoroughly** with the Planaday API documentation

### Common Issues

1. **Authentication Errors:**
   - Verify your API key is correct
   - Ensure you're using the right environment (test vs production)
   - Check the API key has proper permissions

2. **Build Issues:**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript configuration in `tsconfig.json`
   - Verify all imports are correct

3. **Node Not Appearing in n8n:**
   - Ensure the node is properly built (`npm run build`)
   - Check that the dist files are in the correct location
   - Restart your n8n instance after installation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- **Planaday API Documentation**: https://apidocs.planaday.nl
- **n8n Documentation**: https://docs.n8n.io
- **Issues**: Report bugs and feature requests in the GitHub issues section