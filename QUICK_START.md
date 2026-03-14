# Task Management Application - Quick Start Guide

Get the application running in minutes!

## 📦 Prerequisites

Before you begin, ensure you have:
- **Node.js** v16+ and **npm** installed
- **MongoDB Atlas** account (free tier available)
- A **code editor** (VS Code recommended)
- **Git** for version control

## 🚀 Quick Start

### Step 1: Setup MongoDB

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free account
3. Create a new cluster (AWS, free tier)
4. Create database: `task_management`
5. Create user with read/write access
6. Get connection string: `mongodb+srv://username:password@...`

### Step 2: Start Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with:
# - Your MongoDB URL
# - JWT_SECRET (use something secure)
# - ENCRYPTION_KEY (32 character string)

# Start server
npm run dev
```

Backend runs on `http://localhost:5000`

### Step 3: Start Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

## ✅ Test the Application

1. Open `http://localhost:3000` in browser
2. Click **Register**
3. Create account with:
   - Email: test@example.com
   - Password: password123
   - Name: Test User
4. Click **Dashboard**
5. Create a task: "My First Task"
6. Try filtering and searching
7. Update or delete tasks

## 🎯 Key Features to Test

### Authentication
- ✅ Register new user
- ✅ Login with email/password
- ✅ Logout clears session
- ✅ Protected routes redirect to login

### Task Management
- ✅ Create tasks with title and description
- ✅ Set task status (todo, in-progress, completed)
- ✅ Edit existing tasks
- ✅ Delete tasks (with confirmation)
- ✅ View task creation date

### Advanced Features
- ✅ Pagination (10 items per page by default)
- ✅ Filter by status (dropdown)
- ✅ Search by title (text input)
- ✅ Change items per page
- ✅ Navigation between pages

## 📝 Example Users

After setup, test with these use cases:

### Example 1: Project Manager
```
Email: pm@company.com
Password: SecurePass123
Tasks: Project planning, budgeting, stakeholder meetings
```

### Example 2: Developer
```
Email: dev@company.com
Password: SecurePass123
Tasks: Code review, bug fixes, feature development
```

## 🔧 Environment Setup

### Backend `.env`

```ini
# Required for backend to run
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/task_management
JWT_SECRET=your_super_secret_key_minimum_32_chars_here
ENCRYPTION_KEY=abcdefghijklmnopqrstuvwxyz123456

# Optional
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_EXPIRE=7d
```

### Frontend `.env.local`

```ini
# Required for frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📚 API Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'
```

### Get Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🐛 Troubleshooting

### Backend not starting
```bash
# Check if port 5000 is in use
netstat -an | grep 5000

# Connect to MongoDB
mongosh "mongodb+srv://user:pass@cluster..."
```

### Frontend not connecting to backend
```
1. Check NEXT_PUBLIC_API_URL in .env.local
2. Verify backend is running: curl http://localhost:5000/api/health
3. Check browser console for errors (F12)
4. Clear browser cache and cookies
```

### MongoDB connection error
```
1. Verify MongoDB connection string
2. Check IP whitelist in Atlas (add 0.0.0.0/0)
3. Verify username/password
4. Test connection: mongosh "connection_string_here"
```

## 📁 Project Structure

```
technical assessment/
├── backend/                 # Express.js API
│   ├── controllers/         # Business logic
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth & error handling
│   ├── utils/               # Helper functions
│   └── server.js            # Entry point
│
├── frontend/                # Next.js frontend
│   ├── app/
│   │   ├── components/      # React components
│   │   ├── context/         # Auth context
│   │   ├── utils/           # API services
│   │   ├── styles/          # CSS styling
│   │   ├── page.js          # Home page
│   │   ├── layout.js        # Root layout
│   │   ├── login/           # Login page
│   │   ├── register/        # Register page
│   │   └── dashboard/       # Task dashboard
│   └── public/              # Static files
│
├── README.md                # Full documentation
├── API_DOCUMENTATION.md     # API details
├── DEPLOYMENT_GUIDE.md      # Production setup
└── QUICK_START.md          # This file
```

## 🚀 Next Steps

1. **Learn the codebase**
   - Review README.md for architecture
   - Check API_DOCUMENTATION.md for endpoints
   - Explore React/Next.js patterns

2. **Customize the app**
   - Update colors in `globals.css`
   - Add new task properties
   - Implement additional filters

3. **Deploy to production**
   - See DEPLOYMENT_GUIDE.md
   - Setup MongoDB Atlas
   - Deploy backend to Render/Railway
   - Deploy frontend to Vercel

4. **Add more features**
   - Task categories/tags
   - Due dates
   - Priority levels
   - Comments/notes
   - Task attachments

## 📖 Learning Resources

- [Express.js Documentation](https://expressjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT Guide](https://jwt.io/introduction)
- [React Hooks](https://react.dev/reference/react/hooks)

## 💡 Pro Tips

1. **Docker**: Add Docker files for easy deployment
2. **Testing**: Add Jest for unit and integration tests
3. **Logging**: Use winston for better logging
4. **Validation**: Add schema validation with Joi
5. **Caching**: Implement Redis for performance
6. **Analytics**: Add analytics to track usage
7. **Notifications**: Add email notifications for tasks

## 🆘 Need Help?

1. Check browser console for errors (F12)
2. Check backend terminal for logs
3. Review error messages in API responses
4. Check MongoDB connection
5. Try clearing cache: Ctrl+Shift+Delete

## ✨ Success Checklist

- [ ] Both backend and frontend running
- [ ] Can register new account
- [ ] Can login with email/password
- [ ] Can create a task
- [ ] Can view task on dashboard
- [ ] Can edit task
- [ ] Can delete task
- [ ] Can filter tasks by status
- [ ] Can search tasks by title
- [ ] Pagination works correctly
- [ ] Logout works and clears session

Once all items are checked, you have a working full-stack application! 🎉

---

**Happy Coding!** 💻
