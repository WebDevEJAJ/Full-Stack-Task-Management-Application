# Task Management Application - Full Stack Project

A production-ready Task Management Application demonstrating strong understanding of backend architecture, authentication, security practices, database handling, frontend integration, and deployment strategies.

## 🎯 Project Overview

This is a full-stack web application with:
- **Backend**: Node.js/Express REST API
- **Frontend**: Next.js with React
- **Database**: MongoDB
- **Authentication**: JWT with HTTP-only Cookies
- **Security**: Password hashing, input validation, secure headers

## 🏗️ Architecture

### Backend Structure
```
backend/
├── config/
│   └── database.js              # MongoDB connection
├── controllers/
│   ├── authController.js         # Auth logic (register, login, logout)
│   └── taskController.js         # Task CRUD operations
├── middleware/
│   ├── authMiddleware.js         # JWT verification & authorization
│   └── errorMiddleware.js        # Error handling & validation
├── models/
│   ├── User.js                   # User schema with password hashing
│   └── Task.js                   # Task schema with indexes
├── routes/
│   ├── authRoutes.js             # Auth endpoints
│   └── taskRoutes.js             # Task CRUD endpoints
├── utils/
│   ├── encryption.js             # AES encryption for sensitive data
│   └── responseHandler.js        # Standardized API responses
├── server.js                     # Express app setup
└── .env.example                  # Environment variables template
```

### Frontend Structure
```
frontend/
├── app/
│   ├── components/
│   │   ├── Navbar.js             # Navigation component
│   │   └── ProtectedRoute.js      # Route protection wrapper
│   ├── context/
│   │   └── AuthContext.js         # Global auth state
│   ├── utils/
│   │   ├── apiClient.js           # Axios instance with interceptors
│   │   ├── apiService.js          # API call functions
│   │   └── auth.js                # Auth token management
│   ├── styles/
│   │   └── globals.css            # Global styles
│   ├── layout.js                  # Root layout
│   ├── page.js                    # Home page
│   ├── login/page.js              # Login page
│   ├── register/page.js           # Register page
│   └── dashboard/page.js          # Protected task dashboard
├── public/                        # Static assets
├── next.config.js                 # Next.js configuration
└── .env.local.example             # Environment variables template
```

## 🔐 Security Features

1. **Authentication**
   - JWT tokens with secure expiration (7 days)
   - HTTP-only cookies to prevent XSS attacks
   - Secure flag for HTTPS in production
   - SameSite strict policy

2. **Password Security**
   - bcryptjs hashing with 10 salt rounds
   - Passwords never returned in API responses
   - Passwords only selected when needed for comparison

3. **Input Validation**
   - express-validator for all inputs
   - Email format validation
   - Password length requirements (minimum 6 characters)
   - MongoDB ObjectId validation
   - Max length constraints on task fields

4. **Authorization**
   - Users can only access their own tasks
   - Automatic userId attachment to all operations
   - Protected routes with authentication middleware

5. **Data Encryption**
   - AES encryption for sensitive fields
   - Configurable encryption keys via environment variables

6. **CORS & Headers**
   - CORS enabled for frontend domain
   - Credentials flag enabled for cookie transmission
   - Error responses don't expose sensitive information

## 📋 API Endpoints

### Authentication Routes

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "60d5ec49c1234567890abcde",
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "60d5ec49c1234567890abcde",
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Logout User
```
POST /api/auth/logout
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Logout successful"
}
```

#### Get User Profile
```
GET /api/auth/profile
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "user": {
      "_id": "60d5ec49c1234567890abcde",
      "email": "user@example.com",
      "fullName": "John Doe",
      "createdAt": "2023-10-15T12:00:00Z",
      "updatedAt": "2023-10-15T12:00:00Z"
    }
  }
}
```

### Task Routes (All Protected with Authentication)

#### Create Task
```
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the full-stack project",
  "status": "todo"
}

Response (201):
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "60d5ec49c1234567890abcde",
      "userId": "60d5ec49c1234567890abcd1",
      "title": "Complete project",
      "description": "Finish the full-stack project",
      "status": "todo",
      "createdAt": "2023-10-15T12:00:00Z",
      "updatedAt": "2023-10-15T12:00:00Z"
    }
  }
}
```

#### Get All Tasks (with Pagination, Filtering, Search)
```
GET /api/tasks?page=1&limit=10&status=todo&search=project
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "_id": "60d5ec49c1234567890abcde",
        "userId": "60d5ec49c1234567890abcd1",
        "title": "Complete project",
        "description": "Finish the full-stack project",
        "status": "todo",
        "createdAt": "2023-10-15T12:00:00Z",
        "updatedAt": "2023-10-15T12:00:00Z"
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

#### Get Single Task
```
GET /api/tasks/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "task": {
      "_id": "60d5ec49c1234567890abcde",
      "userId": "60d5ec49c1234567890abcd1",
      "title": "Complete project",
      "description": "Finish the full-stack project",
      "status": "todo",
      "createdAt": "2023-10-15T12:00:00Z",
      "updatedAt": "2023-10-15T12:00:00Z"
    }
  }
}
```

#### Update Task
```
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish by end of week",
  "status": "in-progress"
}

Response (200):
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "_id": "60d5ec49c1234567890abcde",
      "userId": "60d5ec49c1234567890abcd1",
      "title": "Complete project",
      "description": "Finish by end of week",
      "status": "in-progress",
      "createdAt": "2023-10-15T12:00:00Z",
      "updatedAt": "2023-10-15T12:30:00Z"
    }
  }
}
```

#### Delete Task
```
DELETE /api/tasks/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` and add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task_management?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ENCRYPTION_KEY=your_32_char_encryption_key_here_
   ```

5. **Start the backend server**
   ```bash
   npm run dev    # For development with nodemon
   npm start      # For production
   ```

   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env.local file**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure environment variables**
   Edit `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## 📦 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  password: String (hashed with bcrypt),
  fullName: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  title: String (max 100 chars),
  description: String (max 500 chars),
  status: String (enum: ['todo', 'in-progress', 'completed']),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- {userId: 1, createdAt: -1}
- {userId: 1, status: 1}
- {userId: 1, title: 'text'}
```

## 🔧 Development Workflow

### Test Authentication
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### Create a Task
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "status": "todo"
  }'
```

### Get Tasks with Pagination
```bash
curl -X GET "http://localhost:5000/api/tasks?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

## 🚢 Deployment

### Deploy Backend to Vercel

1. **Create vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

2. **Deploy**
   ```bash
   vercel
   ```

### Deploy Frontend to Vercel

1. **Update API URL in .env.production**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api
   ```

2. **Deploy**
   ```bash
   vercel
   ```

### Deploy to Render

1. **Backend**: Push to Git and connect Render to your repository
2. **Frontend**: Deploy as Static Site on Render

## 📊 Code Structure & Design Patterns

### Backend
- **MVC Architecture**: Models, Controllers, Routes separation
- **Middleware Pattern**: Authentication, validation, error handling
- **Service Layer**: Encryption and response handling utilities
- **Database Indexing**: Optimized queries for user tasks

### Frontend
- **React Hooks**: useState, useEffect for state management
- **Context API**: Global authentication state
- **Custom Hooks**: useAuth for accessing auth context
- **Protected Routes**: Route guarding with ProtectedRoute component
- **Axios Interceptors**: Automatic token handling and refresh

## 🧪 Testing Scenarios

### Scenario 1: User Registration & Login
1. Register new user
2. Verify password is hashed
3. Login with correct credentials
4. Verify JWT token is returned
5. Check HTTP-only cookie is set

### Scenario 2: Task Management
1. Create task as authenticated user
2. Try to access task without authentication (should fail)
3. Try to access another user's task (should fail)
4. Update own task
5. Delete own task

### Scenario 3: Pagination & Filtering
1. Create 15+ tasks
2. Fetch tasks with limit=10 (should return 10)
3. Fetch page 2
4. Filter by status
5. Search by title

## 📝 Error Handling

### Standard Error Responses

**Validation Error (400)**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Authentication Error (401)**
```json
{
  "success": false,
  "message": "No authentication token found"
}
```

**Authorization Error (403)**
```json
{
  "success": false,
  "message": "Not authorized"
}
```

**Not Found (404)**
```json
{
  "success": false,
  "message": "Task not found"
}
```

**Server Error (500)**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 🔐 Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ HTTP-only cookies
- ✅ HTTPS in production (Secure flag)
- ✅ Input validation on all endpoints
- ✅ Authorization checks on protected resources
- ✅ CORS properly configured
- ✅ Error messages don't expose sensitive info
- ✅ Environment variables for secrets
- ✅ MongoDB indexing for performance
- ✅ Data encryption for sensitive fields

## 📚 Dependencies

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **express-validator**: Input validation
- **crypto-js**: Data encryption
- **cors**: Cross-origin support
- **cookie-parser**: Cookie handling

### Frontend
- **next**: React framework
- **react**: UI library
- **axios**: HTTP client
- **js-cookie**: Cookie management

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Full Stack Technical Assessment Project

## 🤝 Support

For issues or questions, please create an issue in the repository.
