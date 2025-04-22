# Willow - Taylor Swift's discography through Spotify's data

Willow is a full-stack web application built as a way to visualize Taylor Swift's discography data given the dataset available [here](https://www.kaggle.com/datasets/jarredpriester/taylor-swift-spotify-dataset), built with Next.js, Fastify, and MongoDB.

This app is a proof-of-concept for my Databases II course and an experiment at "complex" infrastructure (can Docker even be considered that?) and should not be considered production ready at all. 

## Features

- **Music Analytics Dashboard**: Visualize and analyze music data
- **Album Management**: CRUD operations for albums
- **Track Management**: CRUD operations for tracks
- **User Authentication**: Secure login and registration system
- **Admin Panel**: Specialized interface for data management
- **API Integration**: RESTful API for data access

## Tech Stack

### Frontend
- Next.js 15.2.1
- TypeScript
- Tailwind CSS
- React Components
- Modern UI with gradient backgrounds

### Backend
- Fastify
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- CORS enabled

### Infrastructure
- Docker containerization
- MongoDB database
- Environment-based configuration

## Prerequisites

- Node.js (v20 or higher)
- MongoDB
- Docker and Docker Compose (for containerized deployment)

## Environment Variables

### Backend (.env)
```env
# Required
MONGODB_URI=mongodb://mongo:27017/willow
JWT_SECRET=your_jwt_secret_key

# Optional
PORT=3000
HOST=0.0.0.0
JWT_EXPIRES_IN=24h
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/meelunae/willow-bd2
cd willow-bd2
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# Copy example files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit the .env files with your configuration
```

4. Start the development servers:
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

## Docker Deployment

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Access the applications:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- MongoDB: mongodb://localhost:27018

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

### Albums
- GET `/api/albums` - List all albums
- POST `/api/albums` - Create new album
- GET `/api/albums/:id` - Get album details
- PUT `/api/albums/:id` - Update album
- DELETE `/api/albums/:id` - Delete album

### Tracks
- GET `/api/tracks` - List all tracks
- POST `/api/tracks` - Create new track
- GET `/api/tracks/:id` - Get track details
- PUT `/api/tracks/:id` - Update track
- DELETE `/api/tracks/:id` - Delete track

### Analytics
- GET `/api/analytics` - Get analytics data