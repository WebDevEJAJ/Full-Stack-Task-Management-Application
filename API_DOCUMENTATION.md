# API Documentation

Complete REST API documentation for the Task Management Application.

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend-url/api`

## Authentication

### Cookie-Based Authentication

All protected endpoints require a valid JWT token stored in an HTTP-only cookie. The token is automatically set during login or registration.

**Token Format**: HTTP-only Cookie named `token`

**Token Expiration**: 7 days

### Headers
```
Authorization: Bearer <jwt_token>
```

Or cookies are automatically sent if using a browser or fetch with credentials.

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    // Optional: Array of validation errors
  ]
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Successful GET/PUT request |
| 201 | Created - Successful POST request |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

## Authentication Endpoints

### 1. Register User

**Endpoint**: `POST /auth/register`

**Description**: Create a new user account

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}
```

**Request Validation**:
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `fullName`: Required, non-empty string

**Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "fullName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE2OTc0MzI1NzAsImV4cCI6MTY5ODAzNzM3MH0.KZ5v4x..."
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123",
    "fullName": "John Doe"
  }' \
  -c cookies.txt
```

---

### 2. Login User

**Endpoint**: `POST /auth/login`

**Description**: Authenticate and get JWT token

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Request Validation**:
- `email`: Required, valid email format
- `password`: Required, non-empty

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "fullName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }' \
  -c cookies.txt
```

---

### 3. Logout User

**Endpoint**: `POST /auth/logout`

**Description**: Clear authentication session

**Authentication**: Required ✅

**Request Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -b cookies.txt
```

---

### 4. Get User Profile

**Endpoint**: `GET /auth/profile`

**Description**: Get authenticated user's profile information

**Authentication**: Required ✅

**Request Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "fullName": "John Doe",
      "createdAt": "2023-10-15T14:25:45.123Z",
      "updatedAt": "2023-10-15T14:25:45.123Z"
    }
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "No authentication token found"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -b cookies.txt
```

---

## Task Endpoints

### 1. Create Task

**Endpoint**: `POST /tasks`

**Description**: Create a new task for authenticated user

**Authentication**: Required ✅

**Request Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Complete project report",
  "description": "Write and submit the quarterly project report",
  "status": "todo"
}
```

**Request Validation**:
- `title`: Required, maximum 100 characters
- `description`: Optional, maximum 500 characters
- `status`: Optional, must be one of: `todo`, `in-progress`, `completed` (default: `todo`)

**Success Response** (201):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "title": "Complete project report",
      "description": "Write and submit the quarterly project report",
      "status": "todo",
      "createdAt": "2023-10-15T14:26:30.123Z",
      "updatedAt": "2023-10-15T14:26:30.123Z"
    }
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Title is required",
      "param": "title",
      "location": "body"
    }
  ]
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project report",
    "description": "Write and submit the quarterly project report",
    "status": "todo"
  }' \
  -b cookies.txt
```

---

### 2. Get All Tasks

**Endpoint**: `GET /tasks`

**Description**: Retrieve all tasks for authenticated user with pagination, filtering, and search

**Authentication**: Required ✅

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (minimum 1) |
| `limit` | integer | 10 | Items per page (1-100) |
| `status` | string | - | Filter by status: `todo`, `in-progress`, `completed` |
| `search` | string | - | Search by task title (text search) |

**Request Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "userId": "507f1f77bcf86cd799439011",
        "title": "Complete project report",
        "description": "Write and submit the quarterly project report",
        "status": "in-progress",
        "createdAt": "2023-10-15T14:26:30.123Z",
        "updatedAt": "2023-10-15T16:45:15.456Z"
      },
      {
        "_id": "507f1f77bcf86cd799439013",
        "userId": "507f1f77bcf86cd799439011",
        "title": "Review code",
        "description": "Review pull requests from team members",
        "status": "todo",
        "createdAt": "2023-10-14T10:30:00.000Z",
        "updatedAt": "2023-10-14T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "pages": 2
    }
  }
}
```

**cURL Examples**:

Get first 10 tasks:
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -b cookies.txt
```

Get completed tasks with pagination:
```bash
curl -X GET "http://localhost:5000/api/tasks?page=1&limit=5&status=completed" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -b cookies.txt
```

Search for tasks:
```bash
curl -X GET "http://localhost:5000/api/tasks?search=report" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -b cookies.txt
```

---

### 3. Get Single Task

**Endpoint**: `GET /tasks/:id`

**Description**: Retrieve a specific task by ID

**Authentication**: Required ✅

**URL Parameters**:
- `id`: Task MongoDB ObjectId (required)

**Request Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "task": {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "title": "Complete project report",
      "description": "Write and submit the quarterly project report",
      "status": "in-progress",
      "createdAt": "2023-10-15T14:26:30.123Z",
      "updatedAt": "2023-10-15T16:45:15.456Z"
    }
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Task not found"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/tasks/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -b cookies.txt
```

---

### 4. Update Task

**Endpoint**: `PUT /tasks/:id`

**Description**: Update a specific task

**Authentication**: Required ✅

**URL Parameters**:
- `id`: Task MongoDB ObjectId (required)

**Request Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "title": "Complete project report and presentation",
  "description": "Write report, create slides, and present findings",
  "status": "in-progress"
}
```

**Request Validation**:
- `title`: Optional, non-empty, maximum 100 characters
- `description`: Optional, maximum 500 characters
- `status`: Optional, must be one of: `todo`, `in-progress`, `completed`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "title": "Complete project report and presentation",
      "description": "Write report, create slides, and present findings",
      "status": "in-progress",
      "createdAt": "2023-10-15T14:26:30.123Z",
      "updatedAt": "2023-10-15T17:30:45.789Z"
    }
  }
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:5000/api/tasks/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }' \
  -b cookies.txt
```

---

### 5. Delete Task

**Endpoint**: `DELETE /tasks/:id`

**Description**: Delete a specific task

**Authentication**: Required ✅

**URL Parameters**:
- `id`: Task MongoDB ObjectId (required)

**Request Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Task not found"
}
```

**cURL Example**:
```bash
curl -X DELETE http://localhost:5000/api/tasks/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -b cookies.txt
```

---

## Complete Workflow Examples

### Example 1: User Registration & Task Management

```bash
# 1. Register a new user
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123",
    "fullName": "John Doe"
  }')

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 2. Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My first task",
    "description": "Getting started with task management",
    "status": "todo"
  }'

# 3. Get all tasks
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN"

# 4. Logout
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

### Example 2: Advanced Filtering & Search

```bash
# Get in-progress tasks, page 2, 5 items per page
curl -X GET "http://localhost:5000/api/tasks?page=2&limit=5&status=in-progress" \
  -H "Authorization: Bearer $TOKEN"

# Search for tasks containing "report"
curl -X GET "http://localhost:5000/api/tasks?search=report" \
  -H "Authorization: Bearer $TOKEN"

# Get completed tasks with custom limit
curl -X GET "http://localhost:5000/api/tasks?status=completed&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

## Rate Limiting & Best Practices

- No explicit rate limiting implemented (can be added in production)
- Recommendations:
  - Implement rate limiting middleware (express-rate-limit)
  - Use exponential backoff for retries
  - Cache frequently accessed data
  - Monitor API usage and performance

## Error Handling

### Common Error Scenarios

**1. Missing Authentication**
```
Request: GET /api/tasks
Response (401):
{
  "success": false,
  "message": "No authentication token found"
}
```

**2. Invalid Token**
```
Response (401):
{
  "success": false,
  "message": "Invalid token"
}
```

**3. Expired Token**
```
Response (401):
{
  "success": false,
  "message": "Token has expired"
}
```

**4. Accessing Another User's Task**
```
Request: GET /api/tasks/507f1f77bcf86cd799439099/
Response (404):
{
  "success": false,
  "message": "Task not found"
}
```

**Note**: Returns 404 instead of 403 for security (doesn't reveal task existence)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2023-10-15 | Initial release |

---

## Support

For questions or issues with the API:
1. Check this documentation
2. Review error messages carefully
3. Verify request format and headers
4. Check backend server logs for detailed errors
