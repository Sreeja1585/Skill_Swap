# SkillSwap

Full-stack skill swapping platform with React frontend and Node/Express backend.

## Setup

1. Backend:
   ```
   cd skillswap/server
   npm install
   # Update .env with MongoDB URI and JWT secret
   npm run dev
   ```

2. Frontend:
   ```
   cd skillswap/client
   npm install
   npm start
   ```

Backend runs on http://localhost:5000
Frontend on http://localhost:3000

## Features

- User registration/login with JWT
- MongoDB integration
- Skills offered/wanted (extendable)

## Next Steps

- Profile page
- Skill matching
- Chat system

