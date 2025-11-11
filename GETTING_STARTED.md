# 🎯 Getting Started with BrotoDesk

## 📋 What You Need

Before starting, make sure you have:
- ✅ Node.js installed (check: `node --version`)
- ✅ Internet connection
- ✅ VS Code (recommended)
- ✅ A web browser

---

## 🚀 Two Ways to Setup

### 🔥 Fast Way (Automated Script)

1. **Get Database URL from Supabase:**
   - Visit https://supabase.com
   - Create free account
   - Create new project
   - Get connection string (see detailed steps in START_HERE.md)

2. **Add Database URL:**
   - Open `backend\.env`
   - Replace `DATABASE_URL="..."` with your Supabase URL
   - Save file

3. **Run Setup Script:**
   ```powershell
   cd c:\Users\Joell\JoelVsCode\BrotoDesk
   .\setup.ps1
   ```

4. **Start Servers:**
   - Terminal 1: `cd backend; npm run dev`
   - Terminal 2: `cd frontend; npm run dev`

Done! Visit http://localhost:5173

---

### 📝 Manual Way (Step by Step)

Follow the detailed guide in **START_HERE.md**

---

## 🎓 First Time User Guide

### 1️⃣ Register Your Account

- Go to http://localhost:5173
- Click "Register here"
- Fill in your details
- Click "Create Account"

### 2️⃣ Login

- Enter your email and password
- Click "Sign In"
- You'll see the Student Dashboard

### 3️⃣ Create a Complaint

- Click "New Complaint" button
- Fill in:
  - **Title:** Brief description
  - **Category:** Select from dropdown
  - **Description:** Detailed explanation
- Click "Create Complaint"

### 4️⃣ Track Your Complaints

- View all complaints in dashboard
- See status: Pending / In Progress / Resolved
- Click any complaint to see details

### 5️⃣ Become an Admin (Optional)

- Open Prisma Studio: `npm run db:studio` in backend folder
- Click "users" table
- Find your user
- Change role from `STUDENT` to `ADMIN`
- Save
- Logout and login again
- Now you can access Admin Dashboard!

---

## 🎨 What Each Page Does

### Login Page (`/login`)
- Enter credentials
- Secure JWT authentication
- Redirects to dashboard

### Register Page (`/register`)
- Create new account
- Password validation
- Email uniqueness check

### Student Dashboard (`/dashboard`)
- View all your complaints
- See stats (total, pending, resolved)
- Create new complaints
- Quick status overview

### Admin Dashboard (`/admin`)
- View ALL complaints from all students
- Analytics with stats
- Filter by status and category
- Manage complaint workflow

### Complaint Detail (`/complaints/:id`)
- View full complaint information
- Student info and timeline
- **Admin only:** Update status and add response

---

## 🔐 User Roles Explained

### Student
- Can register and login
- Can create complaints
- Can view own complaints only
- Can track status updates
- Receives notifications

### Admin
- Can login (must be assigned role)
- Can view ALL complaints
- Can update complaint status
- Can add responses to complaints
- Can assign complaints to admins
- Sees analytics dashboard

---

## 💬 Complaint Workflow

```
Student creates complaint
        ↓
   Status: PENDING
        ↓
Admin reviews and assigns
        ↓
   Status: IN_PROGRESS
        ↓
Admin works on solution
        ↓
   Status: RESOLVED
```

Additional statuses:
- **REOPENED** - If issue comes back
- **CLOSED** - Permanently closed

---

## 🎨 Categories Explained

| Category | For complaints about |
|----------|---------------------|
| **HOSTEL** | Accommodation, roommates, facilities |
| **PLACEMENT** | Job placement, interviews, companies |
| **MENTOR** | Mentor issues, guidance problems |
| **SYSTEM_ISSUE** | Tech issues, portal problems |
| **INFRASTRUCTURE** | Building, equipment, resources |
| **ACADEMICS** | Course content, teaching quality |
| **OTHER** | Anything else |

---

## 🗂️ Database Tables

Your data is stored in these tables:

1. **users** - All students and admins
2. **complaints** - All complaint records
3. **notifications** - In-app notifications
4. **audit_logs** - Track admin actions
5. **attachments** - File uploads (ready for future)

---

## 🔧 Common Tasks

### View Database
```powershell
cd backend
npm run db:studio
```
Opens visual database editor at http://localhost:5555

### Add New Admin
1. Open Prisma Studio
2. Click "users"
3. Find user by email
4. Change role to "ADMIN"
5. Save

### Reset Database (Clear all data)
```powershell
cd backend
npx prisma migrate reset
npm run db:push
```

### Check API Health
Visit: http://localhost:5000/health
Should return: `{"status":"OK","timestamp":"..."}`

---

## 📱 Using the API Directly

All API endpoints are at: `http://localhost:5000/api/v1`

### Register
```bash
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

Returns JWT token - use in Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Create Complaint
```bash
POST /complaints
{
  "title": "Issue with hostel",
  "description": "WiFi not working",
  "category": "HOSTEL"
}
```

See `backend/README.md` for full API documentation.

---

## 🎯 Development Tips

### Hot Reload
Both servers have hot reload:
- Backend: Edit code → saves → server restarts
- Frontend: Edit code → saves → browser updates

### Debugging

**Backend Errors:**
- Check terminal where backend runs
- Look for error stack trace
- Check `backend/src/` files

**Frontend Errors:**
- Press F12 in browser
- Go to Console tab
- Look for red error messages

**Database Issues:**
- Use Prisma Studio to view data
- Check `backend/.env` has correct DATABASE_URL
- Run `npm run db:generate` after schema changes

---

## 📚 File Structure Quick Reference

```
BrotoDesk/
├── START_HERE.md          ← Read this first!
├── setup.ps1              ← Automated setup
├── README.md              ← Full documentation
├── backend/
│   ├── .env               ← Your database URL here
│   ├── src/
│   │   ├── routes/        ← API endpoints
│   │   ├── middleware/    ← Auth & errors
│   │   └── server.ts      ← Entry point
│   └── prisma/
│       └── schema.prisma  ← Database schema
└── frontend/
    ├── .env               ← API URL
    └── src/
        ├── pages/         ← UI pages
        ├── components/    ← Reusable UI
        └── lib/api.ts     ← API client
```

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt
- JWT tokens expire after 7 days
- All API routes (except auth) require authentication
- Admin routes check user role
- Input is validated before database

For production:
- Change JWT_SECRET to strong random value
- Use HTTPS
- Set NODE_ENV=production
- Enable rate limiting

---

## 🚀 Deployment Checklist (Future)

When you're ready to deploy:

### Backend
- [ ] Sign up for Railway/Render
- [ ] Connect GitHub repo
- [ ] Add environment variables
- [ ] Deploy!

### Frontend
- [ ] Sign up for Vercel/Netlify
- [ ] Connect GitHub repo
- [ ] Set VITE_API_URL to production backend
- [ ] Deploy!

### Database
- [ ] Already on Supabase ✅
- [ ] Or migrate to AWS RDS

---

## 🆘 Getting Help

1. **Read the docs:** START_HERE.md, README.md
2. **Check errors:** Browser console (F12), Terminal
3. **View data:** Prisma Studio (`npm run db:studio`)
4. **Common issues:** See Troubleshooting section in START_HERE.md

---

## 🎉 You're All Set!

**Quick Start Commands:**
```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Then visit: **http://localhost:5173**

Happy coding! 🚀
