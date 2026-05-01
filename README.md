# Team Task Manager (Full-Stack)

A production-ready task management application with role-based access control, real-time dashboard statistics, and a modern, glassmorphic UI.

## 🚀 Features
- **Authentication**: Secure JWT-based auth with password hashing.
- **Role-Based Access**: 
  - **Admin**: Create, assign, edit, and delete tasks for any team member. View all team statistics.
  - **Member**: View and update the status of assigned tasks.
- **Dashboard**: Visualized task statistics (Total, In Progress, Completed, Overdue).
- **Task Management**: CRUD operations with priority levels and due dates.
- **Responsive Design**: Fully mobile-responsive UI built with Tailwind CSS.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Icons**: Lucide React.
- **Date Handling**: Date-fns.

## 📦 Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB connection string (Atlas or Local)

### Backend Setup
1. Navigate to `backend/`
2. Install dependencies: `npm install`
3. Configure `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
4. Start the server: `npm start`

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

## 🔗 API Documentation

### Auth
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task (Admin)
- `PUT /api/tasks/:id` - Update task/status
- `DELETE /api/tasks/:id` - Delete task (Admin)

### Dashboard
- `GET /api/tasks/stats` - Get task analytics

## 🚀 Deployment

### Backend (Railway)
1. Link your GitHub repository to Railway.
2. Add environment variables in Railway settings.
3. Railway will automatically detect the Node.js project and deploy.

### Frontend (Vercel)
1. Connect GitHub repository to Vercel.
2. Set the "Root Directory" to `frontend`.
3. Add `VITE_API_URL` to environment variables pointing to your Railway URL.
4. Deploy.
