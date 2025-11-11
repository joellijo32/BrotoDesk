# 🚀 COMPLETE SETUP - DO THIS NOW

## ⚡ Step 1: Get Your Database (2 minutes)

### Option A: Supabase (Recommended - Free)

1. Open https://supabase.com in your browser
2. Click **"Start your project"** → Sign in with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Name:** `broto-desk`
   - **Database Password:** Create a strong password (SAVE THIS!)
   - **Region:** Choose closest to you
5. Click **"Create new project"**
6. Wait 2 minutes while it sets up...
7. Once ready, go to: **Settings** (left sidebar) → **Database**
8. Scroll to **Connection String** section
9. Click **"URI"** tab
10. Copy the entire string (starts with `postgresql://`)
11. **IMPORTANT:** Replace `[YOUR-PASSWORD]` in the string with the password you created in step 4

**Example:**
```
postgresql://postgres.abc123:YourPassword@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

---

### Option B: Local PostgreSQL (If you have it installed)

If you already have PostgreSQL installed:

```powershell
# Create database
createdb brotodesk

# Your connection string will be:
postgresql://postgres:yourpassword@localhost:5432/brotodesk
```

---

## ⚡ Step 2: Configure Backend (30 seconds)

1. Open the file: `backend\.env`
2. Find the line: `DATABASE_URL="postgresql://..."`
3. Replace it with your connection string from Step 1
4. Save the file (Ctrl+S)

**Example:**
```env
DATABASE_URL="postgresql://postgres.abc123:YourPassword@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

---

## ⚡ Step 3: Initialize Database (Run These Commands)

Open a terminal in VS Code and run:

```powershell
# Navigate to backend
cd c:\Users\Joell\JoelVsCode\BrotoDesk\backend

# Push database schema (creates all tables)
npm run db:push

# Generate Prisma client
npm run db:generate
```

✅ You should see: **"Your database is now in sync with your Prisma schema."**

---

## ⚡ Step 4: Start the Backend

In the same terminal:

```powershell
npm run dev
```

✅ You should see: **"✅ BrotoDesk Backend running on http://localhost:5000"**

**Keep this terminal open!**

---

## ⚡ Step 5: Start the Frontend

Open a **NEW terminal** (Click the **+** button in terminal):

```powershell
cd c:\Users\Joell\JoelVsCode\BrotoDesk\frontend
npm run dev
```

✅ Browser should open automatically at **http://localhost:5173**

**Keep this terminal open too!**

---

## 🎉 Step 6: Test It!

### Create Your First Account

1. Browser should show the Login page
2. Click **"Register here"**
3. Fill in:
   - **Name:** Your name
   - **Email:** test@example.com (any email format works)
   - **Student ID:** BRO001 (optional)
   - **Password:** password123
   - **Confirm Password:** password123
4. Click **"Create Account"**
5. You should see success message and redirect to login

### Login

1. Enter email: `test@example.com`
2. Enter password: `password123`
3. Click **"Sign In"**
4. You should see the **Student Dashboard** 🎉

### Create Your First Complaint

1. Click **"New Complaint"** button
2. Fill in:
   - **Title:** "Test Issue"
   - **Category:** Select any
   - **Description:** "This is my first complaint"
3. Click **"Create Complaint"**
4. You should see it appear in your dashboard!

---

## 🔧 Making Yourself an Admin

Want to test the admin features?

1. Keep both servers running
2. Open a **third terminal**:

```powershell
cd c:\Users\Joell\JoelVsCode\BrotoDesk\backend
npm run db:studio
```

3. Browser will open **Prisma Studio** (database GUI)
4. Click **"users"** table on the left
5. Find your user (email: test@example.com)
6. Double-click the **"role"** field
7. Change from `STUDENT` to `ADMIN`
8. Click **"Save 1 change"** (green button)
9. Close Prisma Studio
10. In the main app, **logout** and **login again**
11. You'll now see the **Admin Dashboard**! 🎉

---

## ✅ Success Checklist

You're done when you can:

- [x] Backend running (port 5000)
- [x] Frontend running (port 5173)
- [x] Can register a new account
- [x] Can login successfully
- [x] Can create a complaint
- [x] Can view complaint in dashboard
- [x] Can make yourself admin
- [x] Can view admin dashboard
- [x] Can update complaint status

---

## 🐛 Troubleshooting

### ❌ "Database connection error"

**Problem:** Wrong DATABASE_URL in `backend\.env`

**Fix:**
1. Double-check your Supabase connection string
2. Make sure you replaced `[YOUR-PASSWORD]` with actual password
3. Make sure there are no extra spaces
4. Restart backend server

---

### ❌ Backend won't start

**Problem:** Port 5000 already in use

**Fix:**
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
# Note the PID number, then:
taskkill /PID <number> /F

# Or change port in backend\.env:
PORT=5001
```

---

### ❌ Frontend shows blank page

**Problem:** Backend not running or API error

**Fix:**
1. Check backend terminal - should show "Backend running"
2. Press F12 in browser → Console tab → Check for errors
3. Make sure backend is on port 5000

---

### ❌ "Prisma client not generated"

**Fix:**
```powershell
cd backend
npm run db:generate
```

---

## 📚 What's Next?

Now that everything works:

1. **Explore the Code:**
   - Backend API: `backend/src/routes/`
   - Frontend Pages: `frontend/src/pages/`
   - Database Schema: `backend/prisma/schema.prisma`

2. **Customize:**
   - Change app name
   - Modify colors (Tailwind config)
   - Add new complaint categories
   - Add features!

3. **Deploy Later:**
   - Backend → Railway / Render
   - Frontend → Vercel / Netlify
   - Keep using Supabase for database

---

## 🎯 Quick Reference

**Backend Commands:**
```powershell
cd backend
npm run dev          # Start server
npm run db:studio    # Open database GUI
npm run db:push      # Update database schema
```

**Frontend Commands:**
```powershell
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health
- Database Studio: http://localhost:5555 (when running)

---

## 💡 Pro Tips

1. **Keep both terminals running** while developing
2. **Use Prisma Studio** to easily view/edit database data
3. **Check browser console** (F12) for frontend errors
4. **Check terminal** for backend errors
5. **Ctrl+C** to stop servers when done

---

## 🆘 Still Having Issues?

1. Make sure Node.js is installed: `node --version`
2. Make sure all dependencies installed: `npm install` in both folders
3. Check both `.env` files exist and have correct values
4. Try restarting VS Code
5. Check the full documentation in `README.md`

---

**Ready? Let's do this! 🚀**

Follow the steps above in order. Should take about 5 minutes total!
