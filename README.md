# n8n-nodes-planaday

[![npm version](https://badge.fury.io/js/n8n-nodes-planaday.svg)](https://badge.fury.io/js/n8n-nodes-planaday)

This is an n8n community node for integrating with the [Planaday API](https://apidocs.planaday.nl). It allows you to automate your course booking, student management, and other Planaday-related workflows within n8n.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Features

This node integrates with all major Planaday API resources:

- **Booking**: Create, retrieve, update, delete, and mark bookings as paid
- **Company**: Retrieve company details and lists
- **Course**: Retrieve course details, dayparts, materials, and images
- **Course Template**: Retrieve course template details and lists
- **Daypart**: Retrieve daypart details and materials
- **Extra Fields**: Retrieve extra fields configuration
- **Image**: Retrieve image details
- **Instructor**: Manage instructors and their assignments to courses/dayparts
- **Label**: Retrieve label information
- **Location**: Retrieve location details
- **Ping**: Test API connectivity
- **Student**: Create, retrieve, and update student information

## Prerequisites

- n8n version 1.0.0 or later
- A Planaday account with API access enabled
- An API key from your Planaday account

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Using npm

```bash
npm install n8n-nodes-planaday
```

### Manual Installation

1. Download the latest version from the [releases page](https://github.com/planaday-nl/n8n-nodes-planaday/releases)
2. Extract the contents into your n8n custom nodes directory
3. Restart n8n

## Configuration

### API Credentials

1. In your n8n instance, go to **Settings** > **Credentials**
2. Click on **New Credential**
3. Select the **Planaday API** credential type
4. Enter the following details:
   - **API Key**: Your Planaday API key
   - **Company Code**: Your company code in Planaday (e.g., "myname" from myname.planaday.nl)
5. Click **Save**

## Usage

### Booking Operations

- **Create**: Create a new booking for a student in a course
- **Get**: Retrieve details of a specific booking
- **Update**: Update an existing booking
- **Delete**: Delete a booking
- **Mark as Paid**: Mark a booking as paid with payment details

### Company Operations

- **Get**: Retrieve details of a specific company
- **Get Many**: Retrieve a list of companies with optional filtering

### Course Operations

- **Get**: Retrieve details of a specific course
- **Get Many**: Retrieve a list of courses with optional filtering
- **Get Dayparts**: Retrieve dayparts associated with a course
- **Get Materials**: Retrieve materials associated with a course
- **Get Images**: Retrieve images associated with a course

### Course Template Operations

- **Get**: Retrieve details of a specific course template
- **Get Many**: Retrieve a list of course templates with optional filtering

### Daypart Operations

- **Get**: Retrieve details of a specific daypart
- **Get Materials**: Retrieve materials associated with a daypart

### Extra Fields Operations

- **Get Many**: Retrieve a list of extra fields configuration

### Image Operations

- **Get**: Retrieve details of a specific image

### Instructor Operations

- **Get**: Retrieve details of a specific instructor
- **Get Many**: Retrieve a list of instructors with optional filtering
- **Add to Daypart**: Assign an instructor to a daypart
- **Remove from Daypart**: Remove an instructor from a daypart
- **Add to Course**: Assign an instructor to a course
- **Remove from Course**: Remove an instructor from a course

### Label Operations

- **Get Many**: Retrieve a list of labels

### Location Operations

- **Get**: Retrieve details of a specific location

### Ping Operations

- **Ping**: Test the API connection

### Student Operations

- **Get**: Retrieve details of a specific student
- **Create**: Create a new student
- **Update**: Update an existing student

## Example Workflows

### Create a Student and Book a Course

1. **Start Node**: Manual trigger
2. **Planaday Node**: Create a student
   - Resource: Student
   - Operation: Create
   - First Name: {{$json.firstName}}
   - Last Name: {{$json.lastName}}
   - Email: {{$json.email}}
3. **Planaday Node**: Create a booking
   - Resource: Booking
   - Operation: Create
   - Course ID: {{$json.courseId}}
   - Student ID: {{$node["Planaday"].json.id}}

### Retrieve Course Information

1. **Start Node**: Manual trigger with course ID input
2. **Planaday Node**: Get course details
   - Resource: Course
   - Operation: Get
   - Course ID: {{$json.courseId}}
3. **Planaday Node**: Get course dayparts
   - Resource: Course
   - Operation: Get Dayparts
   - Course ID: {{$json.courseId}}

## Resources

- [Planaday API Documentation](https://apidocs.planaday.nl)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)

