# ✅ BrotoDesk Setup Checklist

Use this checklist to ensure everything is set up correctly.

## 📋 Pre-Installation

- [ ] **Node.js installed** (v18+)
  - Run: `node --version`
  - If not installed: [Download Node.js](https://nodejs.org/)

- [ ] **Git installed**
  - Run: `git --version`

- [ ] **VS Code installed** (recommended)

---

## 🗄️ Database Setup

### Option A: Supabase (Recommended)
- [ ] Created account at [supabase.com](https://supabase.com)
- [ ] Created new project
- [ ] Copied connection string (Settings → Database → Connection String → URI)
- [ ] Connection string saved

### Option B: Local PostgreSQL
- [ ] PostgreSQL installed and running
- [ ] Created database: `brotodesk`
- [ ] Connection string ready: `postgresql://user:password@localhost:5432/brotodesk`

---

## ⚙️ Backend Setup

Navigate to `backend/` folder:

- [ ] Installed dependencies
  ```powershell
  npm install
  ```

- [ ] Created `.env` file
  ```powershell
  copy .env.example .env
  ```

- [ ] Updated `.env` with:
  - [ ] `DATABASE_URL` (Supabase or local)
  - [ ] `JWT_SECRET` (any random string)

- [ ] Pushed database schema
  ```powershell
  npm run db:push
  ```

- [ ] Generated Prisma client
  ```powershell
  npm run db:generate
  ```

- [ ] Started backend server
  ```powershell
  npm run dev
  ```

- [ ] Verified backend is running
  - [ ] Terminal shows: `✅ BrotoDesk Backend running on http://localhost:5000`
  - [ ] Browser: Visit `http://localhost:5000/health` - should see `{"status":"OK",...}`

---

## 🎨 Frontend Setup

Navigate to `frontend/` folder:

- [ ] Installed dependencies
  ```powershell
  npm install
  ```

- [ ] Created `.env` file (optional)
  ```powershell
  copy .env.example .env
  ```

- [ ] Started frontend dev server
  ```powershell
  npm run dev
  ```

- [ ] Verified frontend is running
  - [ ] Terminal shows: `Local: http://localhost:5173/`
  - [ ] Browser opened automatically with login page

---

## 🧪 Functionality Tests

### Test Authentication

- [ ] **Registration Works**
  1. Go to `http://localhost:5173/register`
  2. Fill in: Name, Email, Password (6+ chars)
  3. Click "Create Account"
  4. Should see success message and redirect to login

- [ ] **Login Works**
  1. Go to `http://localhost:5173/login`
  2. Enter registered email and password
  3. Click "Sign In"
  4. Should redirect to `/dashboard`

### Test Student Features

- [ ] **Dashboard Loads**
  - See "BrotoDesk" header
  - See stats cards (Total, Pending, Resolved)
  - See "New Complaint" button

- [ ] **Create Complaint**
  1. Click "New Complaint"
  2. Fill in:
     - Title: "Test Complaint"
     - Category: Select any
     - Description: "This is a test"
  3. Click "Create Complaint"
  4. Should see success toast
  5. Complaint appears in list

- [ ] **View Complaint**
  - Click on created complaint
  - Should see detail page with title, description, status

### Test Admin Features

- [ ] **Create Admin User**
  1. Open Prisma Studio:
     ```powershell
     npm run db:studio
     ```
  2. Click "users" table
  3. Find your user
  4. Change `role` from `STUDENT` to `ADMIN`
  5. Click "Save 1 change"

- [ ] **Admin Dashboard**
  1. Logout from student account
  2. Login again with same credentials
  3. Should redirect to `/admin` (Admin Dashboard)
  4. See 4 stat cards
  5. See complaints table

- [ ] **Update Complaint**
  1. Click "View Details" on any complaint
  2. Change status (e.g., to "In Progress")
  3. Add admin response
  4. Click "Update Complaint"
  5. Should see success message

---

## 🔍 Visual Checks

### UI/UX
- [ ] Login page looks clean (centered card, blue button)
- [ ] Register page loads properly
- [ ] Dashboard has cards and header
- [ ] Buttons have hover effects
- [ ] Forms have proper spacing
- [ ] Toast notifications appear on actions
- [ ] Loading spinners show during API calls
- [ ] Status badges have colors (yellow/blue/green)

### Responsive Design
- [ ] Resize browser - UI adapts to screen size
- [ ] Mobile view (< 768px) - cards stack vertically
- [ ] Tablet view (768-1024px) - grid adjusts
- [ ] Desktop view (> 1024px) - full layout

---

## 🐛 Common Issues & Fixes

### Backend Issues

**❌ Error: `Cannot find module 'express'`**
```powershell
cd backend
rm -r node_modules
npm install
```

**❌ Database connection error**
- Check `.env` file has correct `DATABASE_URL`
- Verify Supabase project is active
- Test connection string in Prisma Studio

**❌ Port 5000 already in use**
```powershell
# Change port in backend/.env
PORT=5001
```

### Frontend Issues

**❌ Blank page in browser**
- Open browser console (F12)
- Check for errors
- Verify backend is running on port 5000

**❌ API errors (401/403)**
- Logout and login again
- Check token in localStorage (F12 → Application → Local Storage)
- Restart backend server

**❌ npm install errors**
```powershell
cd frontend
rm -r node_modules
rm package-lock.json
npm install
```

---

## 📊 Health Check Commands

Run these to verify everything works:

### Backend Health
```powershell
cd backend

# Check server is running
curl http://localhost:5000/health

# Open database GUI
npm run db:studio

# View logs in terminal
# Should see: ✅ BrotoDesk Backend running...
```

### Frontend Health
```powershell
cd frontend

# Check dev server
# Terminal should show: Local: http://localhost:5173/

# Build test (optional)
npm run build
```

---

## 🎉 Success Criteria

You're all set when:

✅ Backend running on port 5000  
✅ Frontend running on port 5173  
✅ Can register new user  
✅ Can login successfully  
✅ Can create a complaint  
✅ Can view complaint details  
✅ Admin can update complaint status  
✅ Database has data (check Prisma Studio)  
✅ No errors in browser console  
✅ No errors in terminal  

---

## 📞 Need Help?

1. **Read the docs:**
   - `QUICKSTART.md` - Fast setup guide
   - `README.md` - Full documentation
   - `backend/README.md` - API details
   - `frontend/README.md` - UI details

2. **Check browser console:**
   - Press F12
   - Go to Console tab
   - Look for error messages

3. **Check terminal logs:**
   - Backend terminal for API errors
   - Frontend terminal for build errors

4. **Common fixes:**
   - Restart both servers
   - Clear browser cache
   - Delete `node_modules` and reinstall

---

## 🚀 Next Steps

Once everything works:

1. **Explore the code:**
   - Read backend routes in `backend/src/routes/`
   - Check frontend pages in `frontend/src/pages/`
   - Understand database schema in `backend/prisma/schema.prisma`

2. **Customize:**
   - Change colors in `frontend/tailwind.config.js`
   - Add new complaint categories
   - Modify UI text and branding

3. **Extend features:**
   - Add file upload
   - Implement email notifications
   - Add search and filters
   - Create admin management panel

4. **Deploy:**
   - Backend → Railway/Render
   - Frontend → Vercel/Netlify
   - See deployment guides in main README

---

**✨ Happy coding!**

If all checkboxes are ✅, you're ready to develop and deploy BrotoDesk! 🎉
