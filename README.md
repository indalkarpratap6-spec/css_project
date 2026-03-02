# MCQ Exam System

A comprehensive Multiple Choice Questions (MCQ) exam system built with React frontend and Express backend.

## Features

- **User Authentication**: Registration and Login
- **Create Exams**: Users can create exams with multiple questions
- **Browse Exams**: View all available exams
- **JSON Storage**: All data stored in JSON files
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
├── backend/              # Express server
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── data/            # JSON data files
│   └── server.js        # Main server file
└── frontend/            # React application
    ├── src/
    │   ├── pages/       # Page components
    │   ├── components/  # Reusable components
    │   ├── context/     # Auth context
    │   └── App.js       # Main app component
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Exams
- `GET /api/exams` - Get all available exams
- `GET /api/exams/:id` - Get specific exam
- `POST /api/exams` - Create new exam (requires authentication)
- `PUT /api/exams/:id` - Update exam (requires authentication)
- `DELETE /api/exams/:id` - Delete exam (requires authentication)

## Data Structure

### Users (data/users.json)
```json
{
  "id": "unique_id",
  "email": "user@example.com",
  "fullName": "User Name",
  "password": "hashed_password",
  "createdAt": "2024-02-12T10:30:00Z"
}
```

### Exams (data/exams.json)
```json
{
  "id": "unique_id",
  "examTitle": "Math Quiz",
  "description": "Basic mathematics questions",
  "duration": 60,
  "createdBy": "user_id",
  "createdAt": "2024-02-12T10:30:00Z",
  "questions": [
    {
      "id": 1,
      "question": "What is 2+2?",
      "type": "mcq",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1
    }
  ]
}
```

## Usage

1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Browse Exams**: View all available exams on the dashboard
4. **Create Exam**: Click "Create New Exam" to add new MCQ questions
5. **Take Exam**: Click on any exam to take it

## Environment Variables

### Backend (.env)
```
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

## Technologies Used

### Frontend
- React 18
- React Router
- Axios
- CSS3

### Backend
- Express.js
- JWT (JSON Web Tokens)
- bcryptjs for password hashing
- CORS

## License

This project is open source and available under the MIT License.
