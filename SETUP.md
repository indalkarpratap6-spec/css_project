# Setup Instructions for MCQ Exam System

## Quick Start (Windows Users)

### Prerequisites
- Node.js v16 or higher (https://nodejs.org/)
- npm (comes with Node.js)
- Git (optional but recommended)

### Option 1: Command Prompt / PowerShell

First time setup:
```bash
# Backend Setup
cd backend
npm install
copy .env.example .env

# Frontend Setup (in a new terminal)
cd frontend
npm install
copy .env.example .env
```

Running the application:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend (after backend is running)
cd frontend
npm start
```

The frontend will open automatically at `http://localhost:3000`

### Option 2: Docker (All platforms)

```bash
docker-compose up
```

This will start both backend on `localhost:5000` and frontend on `localhost:3000`.

---

## Detailed Setup Instructions

### Prerequisites
- Node.js v14 or higher (v16+ recommended)
- npm or yarn

### Step 1: Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### Step 2: Configure Backend Environment
The `.env` file should be created in the backend folder. Copy the example:
```bash
cd backend
cp .env.example .env  # Linux/Mac
copy .env.example .env  # Windows
```

Default values:
- `PORT=5000`
- `NODE_ENV=development`

You can modify these as needed.

### Step 3: Configure Frontend Environment
The `.env` file should be created in the frontend folder:
```bash
cd frontend
cp .env.example .env  # Linux/Mac
copy .env.example .env  # Windows
```

Default values:
- `PORT=3000`
- `DANGEROUSLY_DISABLE_HOST_CHECK=true` (for dev server compatibility)

### Step 4: Start the Servers

#### Start Backend (Terminal 1)
```bash
cd backend
npm start           # Production mode
npm run dev         # Development mode with auto-reload (requires nodemon)
```
Backend will run on: `http://localhost:5000`

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```
Frontend will run on: `http://localhost:3000`

The frontend will automatically open in your browser.

### Troubleshooting

#### Error: "react-scripts is not recognized"
**Solution**: Make sure you've run `npm install` in the frontend folder:
```bash
cd frontend
npm install
```

#### Error: "Cannot find module 'express'"
**Solution**: Make sure you've run `npm install` in the backend folder:
```bash
cd backend
npm install
```

#### Error: "allowedHosts[0] should be a non-empty string"
**Solution**: Ensure `DANGEROUSLY_DISABLE_HOST_CHECK=true` is in your `frontend/.env` file:
```bash
cd frontend
cat .env  # Check contents (Linux/Mac)
type .env  # Check contents (Windows)
```

If `.env` is missing, create it:
```bash
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac
```

#### Port already in use
If port 3000 or 5000 is already in use, you can change it:
```bash
# For frontend, edit frontend/.env and change PORT=3001 (or any free port)
# For backend, edit backend/.env and change PORT=5001 (or any free port)
```

## System Features

### User Authentication
1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Session**: User session persists using JWT tokens in localStorage

### Exam Management
1. **View Available Exams**: Browse all created exams on the dashboard
2. **Create Exam**: Add new MCQ exams with multiple questions
3. **Edit/Delete**: Manage your own exams

### Data Storage
- User credentials are hashed with bcryptjs
- All data stored in JSON files in `backend/data/`
  - `users.json` - User accounts
  - `exams.json` - Exam questions and metadata

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

#### Login
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

### Exam Endpoints

#### Get All Exams
```
GET /api/exams
```

#### Get Specific Exam
```
GET /api/exams/:id
```

#### Create Exam (requires authentication)
```
POST /api/exams
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "examTitle": "Math Quiz",
  "description": "Basic math questions",
  "duration": 60,
  "questions": [
    {
      "question": "What is 2+2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1
    }
  ]
}
```

#### Update Exam (requires authentication, must be owner)
```
PUT /api/exams/:id
Headers: { "Authorization": "Bearer <token>" }
Body: { ...exam data ... }
```

#### Delete Exam (requires authentication, must be owner)
```
DELETE /api/exams/:id
Headers: { "Authorization": "Bearer <token>" }
```

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Install dependencies: `npm install`
- Check `.env` file has correct JWT_SECRET

### Frontend won't start
- Install dependencies: `npm install`
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

### Port 3000 already in use
- Change in frontend: `PORT=3001 npm start`

### Authentication issues
- Check JWT_SECRET matches in backend .env
- Clear localStorage in browser: `localStorage.clear()`

## File Structure

```
css_project/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── exams.js         # Exam management routes
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── data/
│   │   ├── users.json       # User data
│   │   └── exams.json       # Exam data
│   ├── package.json
│   ├── .env
│   └── server.js            # Main server entry
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js     # Login page
│   │   │   ├── Register.js  # Registration page
│   │   │   ├── AvailableExams.js  # Exam listing
│   │   │   ├── CreateExam.js      # Exam creation
│   │   │   ├── Auth.css
│   │   │   └── ExamPages.css
│   │   ├── components/
│   │   │   ├── Navbar.js    # Navigation bar
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── PublicRoute.js
│   │   │   └── Navbar.css
│   │   ├── context/
│   │   │   └── AuthContext.js  # Auth state management
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── README.md
├── setup.sh
└── SETUP.md          # This file
```

## Next Steps After Setup

1. Test the system:
   - Register a new account
   - Create an exam with 4-5 MCQ questions
   - View the exam on the available exams page
   - Verify data is saved to JSON files

2. Additional features you can add:
   - Take/submit exam functionality
   - Exam results and scoring
   - Edit exam functionality
   - Delete exam functionality
   - Search and filter exams
   - User profile page
   - Exam statistics

## Support

For any issues or questions about setup, check the SETUP.md file or review the code comments in the files.
