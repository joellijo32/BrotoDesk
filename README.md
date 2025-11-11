# 🎓 BrotoDesk - Complaint Management System

A modern, full-stack web application for managing student complaints at Brototype. Built with TypeScript, React, Express, and PostgreSQL.

## ✨ Features

### 🔐 Authentication & Authorization
- Student registration and login
- Admin login with role-based access control
- JWT-based session management
- Password encryption (bcrypt)

### 🧑‍🎓 Student Features
- **Dashboard** - View all complaints with real-time status
- **Create Complaints** - Submit complaints with title, description, and category
- **Track Progress** - Monitor complaint status (Pending → In Progress → Resolved)
- **Notifications** - Receive updates when admins respond

### 🧑‍💼 Admin Features
- **Analytics Dashboard** - Overview of all complaints with statistics
- **Complaint Management** - View, filter, and search all complaints
- **Status Updates** - Change complaint status and add admin responses
- **Audit Trail** - Track all admin actions

### 💬 Categories
- Hostel
- Placement
- Mentor
- System Issue
- Infrastructure
- Academics
- Other

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js + Express** - Server framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database client
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Validation

## 📂 Project Structure

```
BrotoDesk/
├── backend/               # Express API server
│   ├── prisma/           # Database schema and migrations
│   ├── src/
│   │   ├── lib/          # Database client
│   │   ├── middleware/   # Auth, error handling
│   │   ├── routes/       # API endpoints
│   │   └── server.ts     # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Auth context
│   │   ├── lib/          # API client
│   │   ├── pages/        # Route pages
│   │   ├── types/        # TypeScript types
│   │   └── App.tsx
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **PostgreSQL** database (local or cloud like Supabase)
- **npm** or **yarn**

### Step 1: Clone & Setup

```bash
cd BrotoDesk
```

### Step 2: Backend Setup

```bash
cd backend
npm install

# Setup environment variables
copy .env.example .env
# Edit .env and add your DATABASE_URL and JWT_SECRET

# Push database schema
npm run db:push

# Generate Prisma client
npm run db:generate

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install

# Setup environment variables (optional, defaults are fine)
copy .env.example .env

# Start frontend dev server
npm run dev
```

Frontend will open at `http://localhost:5173`

## 📊 Database Setup Options

### Option A: Supabase (Recommended - Free & Easy)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string from: Settings → Database → Connection String → URI
4. Paste in `backend/.env` as `DATABASE_URL`

### Option B: Local PostgreSQL
1. Install PostgreSQL
2. Create database: `createdb brotodesk`
3. Update `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/brotodesk"
```

## 🎯 Usage

### Creating Admin Account
1. Register normally at `/register`
2. Manually update the user role in the database:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```
Or modify the register API to accept role parameter during development.

### Testing the Application

**Student Flow:**
1. Register at `http://localhost:5173/register`
2. Login with your credentials
3. Create a complaint from the dashboard
4. View complaint status

**Admin Flow:**
1. Login with admin credentials
2. View analytics dashboard
3. Click on any complaint to view details
4. Update status and add response

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login

### Complaints
- `POST /api/v1/complaints` - Create complaint
- `GET /api/v1/complaints` - List complaints (with filters)
- `GET /api/v1/complaints/:id` - Get complaint details
- `POST /api/v1/complaints/:id/status` - Update status (Admin)
- `POST /api/v1/complaints/:id/assign` - Assign to admin

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `POST /api/v1/notifications/mark-read` - Mark as read

### Analytics
- `GET /api/v1/analytics/summary` - Dashboard stats (Admin)

## 🎨 Design Features

- **Minimal & Clean** UI inspired by Linear and Notion
- **Responsive** design - works on mobile, tablet, and desktop
- **Real-time updates** with toast notifications
- **Professional color scheme** with primary blue accents
- **Loading states** and error handling

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Input validation with Zod
- SQL injection protection via Prisma
- CORS configuration
- Environment variable management

## 🚀 Deployment (Future)

### Backend
- Deploy to Railway, Render, or AWS
- Use managed PostgreSQL (Supabase, RDS)
- Set environment variables on platform

### Frontend
- Deploy to Vercel, Netlify, or AWS S3
- Set `VITE_API_URL` to production API URL
- Build with `npm run build`

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=            # PostgreSQL connection string
PORT=5000
NODE_ENV=development
JWT_SECRET=              # Random secret key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 🛠️ Development

```bash
# Backend (in /backend folder)
npm run dev              # Start with hot reload
npm run db:studio        # Open Prisma Studio (DB GUI)
npm run db:migrate       # Create migration

# Frontend (in /frontend folder)
npm run dev              # Start with hot reload
npm run build            # Build for production
```

## 📚 Additional Features (Roadmap)

- [ ] File attachments for complaints
- [ ] Email notifications
- [ ] Real-time chat between student and admin
- [ ] Dark mode
- [ ] Export reports as PDF/Excel
- [ ] Anonymous complaints
- [ ] Priority levels
- [ ] Forgot password functionality
- [ ] Mobile app (React Native)

## 🤝 Contributing

This is a project for Brototype. Feel free to suggest improvements!

## 📄 License

MIT

## 👨‍💻 Developer

Built with ❤️ for Brototype students

---

## 🆘 Troubleshooting

**Backend won't start:**
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `npm run db:push` to sync schema

**Frontend won't connect to API:**
- Check if backend is running on port 5000
- Verify VITE_API_URL in frontend/.env
- Check browser console for errors

**Database errors:**
- Run `npm run db:generate` in backend
- Delete `node_modules` and reinstall
- Check Prisma schema syntax

---

**Need help?** Check individual README files in `backend/` and `frontend/` folders for detailed documentation.
