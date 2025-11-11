# BrotoDesk Backend API

Backend API for the BrotoDesk Complaint Management System.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (local or cloud like Supabase)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
# Copy the example env file
copy .env.example .env

# Edit .env and add your database URL and secrets
```

3. **Set up the database:**

#### Option A: Using Supabase (Recommended for beginners)
- Go to [supabase.com](https://supabase.com)
- Create a new project (free tier)
- Get your connection string from: Settings → Database → Connection String → URI
- Paste it in `.env` as `DATABASE_URL`

#### Option B: Local PostgreSQL
- Install PostgreSQL
- Create a database: `CREATE DATABASE brotodesk;`
- Update `.env` with: `DATABASE_URL="postgresql://postgres:password@localhost:5432/brotodesk"`

4. **Run database migrations:**
```bash
npm run db:push
```

5. **Generate Prisma Client:**
```bash
npm run db:generate
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

Server will run on: `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login

### Complaints
- `POST /api/v1/complaints` - Create complaint (Student)
- `GET /api/v1/complaints` - List complaints
- `GET /api/v1/complaints/:id` - Get complaint details
- `POST /api/v1/complaints/:id/status` - Update status (Admin)
- `POST /api/v1/complaints/:id/assign` - Assign to admin (Admin)

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `POST /api/v1/notifications/mark-read` - Mark as read

### Analytics
- `GET /api/v1/analytics/summary` - Get dashboard stats (Admin)

### Users
- `GET /api/v1/users/me` - Get current user profile

## 🔐 Environment Variables

```env
DATABASE_URL=          # PostgreSQL connection string
PORT=5000              # Server port
NODE_ENV=development   # development | production
JWT_SECRET=            # Strong random string for JWT signing
JWT_EXPIRES_IN=7d      # Token expiration
FRONTEND_URL=          # Frontend URL for CORS
```

## 🗄️ Database Management

**View database in browser:**
```bash
npm run db:studio
```

**Create migration:**
```bash
npm run db:migrate
```

## 📦 Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt
- **Validation:** Zod

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration
npm run db:studio        # Open Prisma Studio (DB GUI)

# Build
npm run build            # Compile TypeScript to JavaScript
npm start                # Run compiled code
```

## 📝 Notes

- All endpoints except `/auth/register` and `/auth/login` require JWT token
- Send token in header: `Authorization: Bearer YOUR_TOKEN`
- Admin-only endpoints will return 403 if accessed by students
