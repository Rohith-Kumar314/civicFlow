# CivicFlow 🏙️

**CivicFlow** is a modern **hostel/residential society complaint management system** built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Residents can raise maintenance requests with images, workers receive and manage assigned tasks, and admins have full control over users, buildings, and complaints.

## Live Demo

🚀 **Live Link**: [https://civic-flow-8uy8.vercel.app/](https://civic-flow-8uy8.vercel.app/) 

(Backend API is hosted separately — frontend connects via environment variable)

## Features

- **Role-based access** (Resident, Worker, Admin) with JWT authentication
- **Residents** can:
  - Raise complaints with title, description, department, location & multiple images
  - View full complaint history with status tracking
  - See assigned worker details (when assigned)
- **Workers** can:
  - View available complaints in their department
  - Accept, start, and complete tasks
  - See task location, resident details, and timestamps
- **Admins** can:
  - Manage residents, workers, and buildings (add/edit/delete)
  - View all complaints + assign workers manually
  - Dashboard with stats (total residents, workers, open/resolved complaints)
- Responsive & modern UI (Tailwind CSS + dark mode support)
- Image uploads via **Cloudinary**
- Realistic seed data script for quick testing/development
- Secure password hashing (bcrypt) & role-based route protection

## Tech Stack

**Frontend**  
- React 18 + Vite  
- Tailwind CSS  
- React Router v6  
- Axios + react-toastify  
- react-select (searchable dropdowns)  
- react-icons + lucide-react  

**Backend**  
- Node.js + Express  
- MongoDB (Atlas)  
- Mongoose ODM  
- JWT (jsonwebtoken)  
- bcryptjs  
- Cloudinary (image storage)  
- dotenv + cors  

## Installation & Setup

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### 1. Clone the repository

```bash 
git clone https://github.com/yourusername/civicflow.git
cd civicflow
```
2. Backend Setup

```bash
cd backend
npm install
```

Create .env in backend/:

```bash
envPORT=8080
MONGO_URL=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/civicFlow?retryWrites=true&w=majority
JWT_SECRET=your_very_long_random_secret_string_2025
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

Seed initial data (admin, workers, residents, sample complaints):
```bash  node seedData.js ```
Start backend:

```bash
npm run dev
# or
node server.js
```

API runs at: http://localhost:8080
3. Frontend Setup
```bash 
cd ../frontend
npm install
```

Create .env in frontend/ (Vite uses VITE_ prefix):
envVITE_API_URL=http://localhost:8080/api
Start frontend:
```bash
npm run dev
```
App opens at: http://localhost:5173 (or similar)

Default Login Credentials (after seeding)
```bash
Admin
Email: admin@civicflow.in
Password: admin@2025

Worker (example)
Email: rahul_sharma@civicflow.in
Password: worker@123

Resident (example)
Email: rahul.sharma1@gmail.com
Password: resident@123
```

All seeded users use simple passwords for development. Change them in production!
Project Structure
textcivicFlow/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── app_pages/     # role-based dashboards
│   │   ├── context/
│   │   └── ...
├── backend/                # Express API + MongoDB
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   └── seedData.js        # realistic seeding script
├── README.md
└── .gitignore
Important Notes

Images are stored on Cloudinary — ensure keys are correct
For production: add HTTPS, rate limiting, input sanitization, strong JWT secret

License
MIT License — free to use, modify, distribute.
Built with ❤️ in Hyderabad
© Rohith Kumar 2025