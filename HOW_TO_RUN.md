# 🚀 How to Run BrotoDesk

## ⚠️ IMPORTANT: Before Running

**You MUST have a database URL first!** Otherwise the backend will crash.

### Quick Check:
Open `backend\.env` - does it have a real Supabase URL?
- ❌ **NO:** Follow "Step 1" below
- ✅ **YES:** Skip to "Step 2"

---

## 📝 Step-by-Step Instructions

### **Step 1: Get Database URL** (If you haven't already)

1. Go to https://supabase.com
2. Sign up / Login (free)
3. Click **"New Project"**
4. Fill in:
   - Name: `BrotoDesk`
   - Database Password: (make a strong password - save it!)
   - Region: Choose closest to you
5. Click **"Create new project"**
6. Wait 2 minutes for setup
7. Go to: **Settings** → **Database** → **Connection String**
8. Select **"URI"** tab
9. Copy the connection string (looks like: `postgresql://postgres:...`)
10. Replace `[YOUR-PASSWORD]` in the URL with your database password
11. Open `backend\.env` in VS Code
12. Replace the DATABASE_URL line with your real URL:
    ```
    DATABASE_URL="postgresql://postgres:YourPassword@db.xxx.supabase.co:5432/postgres"
    ```
13. Save the file

---

### **Step 2: Initialize Database**

Open a terminal and run:

```powershell
cd backend
npm run db:push
npm run db:generate
```

You should see:
```
✔ Your database is now in sync with your schema.
✔ Generated Prisma Client
```

---

### **Step 3: Start Backend Server**

In the same terminal (or a new one):

```powershell
cd backend
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
```

**Keep this terminal running!** Don't close it.

---

### **Step 4: Start Frontend Server**

Open a **NEW terminal** (keep backend running!) and run:

```powershell
cd frontend
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Keep this terminal running too!**

---

### **Step 5: Open in Browser**

Visit: **http://localhost:5173**

You should see the BrotoDesk login page! 🎉

---

## 📋 Summary Commands

### Both servers need to run at the same time:

**Terminal 1 (Backend):**
```powershell
cd c:\Users\Joell\JoelVsCode\BrotoDesk\backend
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd c:\Users\Joell\JoelVsCode\BrotoDesk\frontend
npm run dev
```

---

## 🎯 Quick Start (If database is already setup)

```powershell
# Terminal 1
cd backend; npm run dev

# Terminal 2 (new terminal)
cd frontend; npm run dev
```

Then visit: **http://localhost:5173**

---

## ❌ Common Issues

### Backend crashes with "Invalid Prisma Client"
**Fix:**
```powershell
cd backend
npm run db:generate
npm run dev
```

### Backend crashes with database connection error
**Fix:** Check your DATABASE_URL in `backend\.env` is correct

### Frontend shows "Network Error"
**Fix:** Make sure backend is running on port 5000

### Port 5000 already in use
**Fix:** 
```powershell
# Kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/.env to 5001
```

---

## 🛑 How to Stop

Press **`Ctrl + C`** in each terminal to stop the servers.

---

## 🔄 Restart Servers

Just press `Ctrl + C` to stop, then run `npm run dev` again!

---

## 🎓 First Time Using the App

1. Click **"Register here"**
2. Create an account
3. Login
4. Create a test complaint
5. Success! 🎉

To become an admin:
```powershell
cd backend
npm run db:studio
```
- Click "users" table
- Find your user
- Change role to "ADMIN"
- Save
- Logout and login again
