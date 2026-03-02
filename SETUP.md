# Setup Instructions for MCQ Exam System

## Quick Start

### Prerequisites
- Node.js v14 or higher
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
The `.env` file is already created in the backend folder with default values:
- `PORT=5000`
- `JWT_SECRET=your_jwt_secret_key_here_change_in_production`
- `NODE_ENV=development`

You can modify these as needed.

### Step 3: Start the Servers

#### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:5000`

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```
Frontend will run on: `http://localhost:3000`

The frontend will automatically open in your browser at `http://localhost:3000`

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
