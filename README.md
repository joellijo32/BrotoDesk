# 🎯 BrotoDesk - Complaint Management System

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://broto-desk.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Backend-blue?style=for-the-badge&logo=render)](https://brotodesk-backend.onrender.com/health)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)

**A modern, professional complaint management system built for Brototype students to efficiently track and resolve complaints.**

[Live Demo](https://broto-desk.vercel.app) · [Report Bug](https://github.com/joellijo32/BrotoDesk/issues) · [Request Feature](https://github.com/joellijo32/BrotoDesk/issues)

</div>

---

## ✨ Features

### 🎓 For Students
- **Quick Complaint Submission** - Submit complaints with title, description, category, and priority
- **Real-time Tracking** - Track complaint status (Pending, In Progress, Resolved, Rejected)
- **Image Attachments** - Upload supporting images with professional viewer (zoom, rotate, download, fullscreen)
- **Instant Notifications** - Get notified when admins respond to your complaints
- **Dark Mode** - Eye-friendly dark theme for comfortable viewing

### 👨‍💼 For Admins
- **Centralized Dashboard** - View all complaints with advanced filtering and search
- **Status Management** - Update complaint statuses with custom responses
- **Analytics Overview** - Track complaint statistics and trends
- **Priority Sorting** - Filter by Low, Medium, High, or Critical priority
- **Bulk Operations** - Efficiently manage multiple complaints

### 🔒 Security Features
- JWT-based authentication with secure password hashing (bcrypt)
- Protected routes and role-based access control (RBAC)
- Input validation and sanitization (Zod)
- Secure file upload handling with Multer
- CORS protection and rate limiting

---

## 🚀 Live Demo

**🌐 Application**: [https://broto-desk.vercel.app](https://broto-desk.vercel.app)  
**🔌 Backend API**: [https://brotodesk-backend.onrender.com](https://brotodesk-backend.onrender.com)

> **Note**: Backend is hosted on Render's free tier and may take 50 seconds to wake up from inactivity on first request.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - Promise-based HTTP client
- **Lucide React** - Beautiful, consistent icons
- **React Hot Toast** - Elegant toast notifications

### Backend
- **Node.js & Express** - RESTful API server
- **TypeScript** - Type-safe backend development
- **Prisma ORM** - Modern database toolkit
- **PostgreSQL** - Robust relational database
- **JWT** - Secure authentication tokens
- **Bcrypt** - Password hashing algorithm
- **Multer** - Multipart file upload handling
- **Zod** - TypeScript-first schema validation

### DevOps & Deployment
- **Vercel** - Frontend hosting with edge network
- **Render** - Backend and PostgreSQL database hosting
- **GitHub** - Version control and CI/CD
- **Docker** - Containerization support (optional)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL database (or use Render free tier)
- Git

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/joellijo32/BrotoDesk.git
cd BrotoDesk
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Configure your .env with:
# DATABASE_URL="postgresql://user:password@localhost:5432/brotodesk"
# JWT_SECRET="your-secret-key"
# JWT_EXPIRES_IN="7d"
# PORT=5000
# NODE_ENV="development"

# Run database migrations
npx prisma migrate dev

# Seed initial data (creates admin & test student accounts)
npm run db:seed

# Start development server
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install

# Create .env file (optional for development)
# VITE_API_URL=http://localhost:5000/api/v1

# Start development server
npm run dev
```

### 4️⃣ Access the Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 🗄️ Database Schema

```prisma
model User {
  id            String         @id @default(uuid())
  name          String
  email         String         @unique
  studentId     String?        @unique
  passwordHash  String
  role          Role           @default(STUDENT)
  complaints    Complaint[]
  notifications Notification[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Complaint {
  id            String            @id @default(uuid())
  title         String
  description   String
  category      ComplaintCategory
  priority      Priority          @default(MEDIUM)
  status        ComplaintStatus   @default(PENDING)
  imageUrl      String?
  adminResponse String?
  studentId     String
  student       User              @relation(fields: [studentId], references: [id])
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}

enum Role {
  STUDENT
  ADMIN
  SUPERADMIN
}

enum ComplaintStatus {
  PENDING
  IN_PROGRESS
  RESOLVED
  REJECTED
}

enum ComplaintCategory {
  HOSTEL
  PLACEMENT
  MENTOR
  SYSTEM_ISSUE
  INFRASTRUCTURE
  ACADEMICS
  OTHER
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

---

## 🔧 Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="production"

# Frontend URL for CORS
FRONTEND_URL="https://broto-desk.vercel.app"

# Optional: Email configuration for notifications
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-email-password"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
```

### Frontend (.env.production)
```bash
VITE_API_URL=https://brotodesk-backend.onrender.com/api/v1
```

---

## 🚢 Deployment Guide

### Deploy to Vercel (Frontend)
1. Push code to GitHub repository
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure build settings:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variable:
   - `VITE_API_URL` = `https://brotodesk-backend.onrender.com/api/v1`
7. Click "Deploy"

### Deploy to Render (Backend + Database)

#### Step 1: Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name**: `brotodesk`
   - **Database**: `brotodesk`
   - **User**: `brotodesk_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free
4. Click "Create Database"
5. Copy the **Internal Database URL** (for backend connection)

#### Step 2: Deploy Backend Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `brotodesk-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install --include=dev && npm run build && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`
4. Add environment variables:
   - `DATABASE_URL` = (paste Internal Database URL from Step 1)
   - `JWT_SECRET` = (your secret key)
   - `JWT_EXPIRES_IN` = `7d`
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://broto-desk.vercel.app`
5. Click "Create Web Service"

#### Step 3: Seed Database
After backend deployment, run seed command locally:
```bash
cd backend
npm run db:seed
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Complaints
- `GET /api/v1/complaints` - Get all complaints (with filters)
- `POST /api/v1/complaints` - Create new complaint
- `GET /api/v1/complaints/:id` - Get complaint details
- `PATCH /api/v1/complaints/:id` - Update complaint
- `PATCH /api/v1/complaints/:id/status` - Update status (Admin only)
- `POST /api/v1/complaints/:id/image` - Upload complaint image
- `DELETE /api/v1/complaints/:id` - Delete complaint (Admin only)

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `PATCH /api/v1/notifications/:id/read` - Mark notification as read

### Analytics (Admin only)
- `GET /api/v1/analytics` - Get complaint statistics

### Users
- `GET /api/v1/users/me` - Get current user profile
- `PATCH /api/v1/users/me` - Update user profile

---

## 🎨 Features in Detail

### Professional Image Viewer
- **Zoom Controls**: Zoom in/out with buttons or Ctrl+Scroll
- **Rotation**: Rotate images 90° clockwise/counterclockwise
- **Fullscreen Mode**: View images in fullscreen
- **Download**: Download original images
- **Keyboard Shortcuts**: Esc to close, arrow keys to navigate

### Advanced Filtering
- Filter by status (Pending, In Progress, Resolved, Rejected)
- Filter by priority (Low, Medium, High, Critical)
- Filter by category
- Search by title or description
- Sort by date, priority, or status

### Real-time Notifications
- Instant notifications for complaint updates
- Visual badge indicators for unread notifications
- Auto-dismiss on read
- Notification history

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test features before submitting PR
- Update documentation as needed

---

## 🐛 Known Issues

- File uploads are stored on Render's ephemeral storage and will be deleted on service restart
  - **Solution**: Integrate Cloudinary or AWS S3 for persistent storage (planned feature)
- Backend cold starts may take 50 seconds on Render free tier
  - **Solution**: Upgrade to paid plan or implement keep-alive pings

---

## 🔮 Future Enhancements

- [ ] Email notifications for complaint updates
- [ ] Cloudinary integration for persistent image storage
- [ ] Comment system for complaint discussions
- [ ] Export complaints to PDF/Excel
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Admin audit logs
- [ ] Complaint escalation system

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Joel Lijo**
- GitHub: [@joellijo32](https://github.com/joellijo32)
- Portfolio: [Coming Soon]
- Email: joellijo32@gmail.com

---

## 🙏 Acknowledgments

- Built for Brototype students and staff
- Inspired by modern complaint management systems
- Icons by [Lucide](https://lucide.dev/)
- UI design inspired by shadcn/ui principles
- Special thanks to the Brototype community for feedback and testing

---

## 📞 Support

For support, please:
- Open an issue on [GitHub](https://github.com/joellijo32/BrotoDesk/issues)
- Contact via email: joellijo32@gmail.com

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ for the Brototype community

[![GitHub Stars](https://img.shields.io/github/stars/joellijo32/BrotoDesk?style=social)](https://github.com/joellijo32/BrotoDesk)
[![GitHub Forks](https://img.shields.io/github/forks/joellijo32/BrotoDesk?style=social)](https://github.com/joellijo32/BrotoDesk/fork)

</div>
