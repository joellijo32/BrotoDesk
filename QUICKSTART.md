# 🚀 BrotoDesk - Quick Start Guide

Follow these steps to get BrotoDesk running on your local machine in under 10 minutes!

## ⚡ Fast Setup (Development)

### 1. Install Dependencies

Open **two terminals** in VS Code:

**Terminal 1 (Backend):**
```powershell
cd c:\Users\Joell\JoelVsCode\BrotoDesk\backend
npm install
```

**Terminal 2 (Frontend):**
```powershell
cd c:\Users\Joell\JoelVsCode\BrotoDesk\frontend
npm install
```

### 2. Setup Database (Supabase - Free & Easy)

1. Go to [supabase.com](https://supabase.com/dashboard) and sign up
2. Click "New Project"
3. Fill in:
   - Name: `broto-desk`
   - Database Password: (create a strong password)
   - Region: Choose closest to you
4. Wait 2 minutes for project to be created
5. Go to: **Settings** → **Database** → **Connection String** → **URI**
6. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@...`)

### 3. Configure Backend

In Terminal 1:

```powershell
# Create .env file from example
copy .env.example .env

# Open .env and paste your Supabase connection string
notepad .env
```

In the `.env` file, update:
```env
DATABASE_URL="your-supabase-connection-string-here"
JWT_SECRET="your-random-secret-key-123456789"
```

Then run:
```powershell
# Push database schema to Supabase
npm run db:push

# Generate Prisma client
npm run db:generate

# Start backend server
npm run dev
```

✅ You should see: `✅ BrotoDesk Backend running on http://localhost:5000`

### 4. Configure Frontend

In Terminal 2:

```powershell
# Create .env file (optional - defaults work)
copy .env.example .env

# Start frontend
npm run dev
```

✅ Browser should open automatically at `http://localhost:5173`

---

## 🎉 You're Done!

### Test the Application

1. **Register a Student Account:**
   - Go to `http://localhost:5173/register`
   - Fill in the form (use any email format)
   - Click "Create Account"

2. **Login:**
   - Use your email and password to login
   - You'll see the student dashboard

3. **Create a Complaint:**
   - Click "New Complaint" button
   - Fill in title, description, select category
   - Submit

4. **Create an Admin Account:**

   Open a **third terminal** and run:
   
   ```powershell
   cd c:\Users\Joell\JoelVsCode\BrotoDesk\backend
   npm run db:studio
   ```
   
   This opens Prisma Studio in your browser:
   - Click on "users" table
   - Find your user
   - Change `role` from `STUDENT` to `ADMIN`
   - Save
   - Logout from frontend and login again
   - You'll be redirected to Admin Dashboard!

---

## 🎯 What You Have Now

- ✅ Full-stack TypeScript application
- ✅ Secure authentication with JWT
- ✅ PostgreSQL database (hosted on Supabase)
- ✅ React frontend with Tailwind CSS
- ✅ Express backend with Prisma ORM
- ✅ Student complaint submission
- ✅ Admin complaint management
- ✅ Real-time notifications

---

## 📖 Key URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Database Studio | http://localhost:5555 (when running `npm run db:studio`) |
| API Health Check | http://localhost:5000/health |

---

## 🛠️ Common Commands

### Backend (in `/backend` folder)
```powershell
npm run dev              # Start server with hot reload
npm run db:studio        # Open database GUI
npm run db:push          # Push schema changes to DB
```

### Frontend (in `/frontend` folder)
```powershell
npm run dev              # Start dev server
npm run build            # Build for production
```

---

## 🐛 Troubleshooting

### Backend won't start:
```powershell
# Delete node_modules and reinstall
rm -r node_modules
npm install
npm run db:generate
npm run dev
```

### Frontend shows blank page:
- Check browser console (F12) for errors
- Make sure backend is running
- Clear browser cache and reload

### Database connection error:
- Verify DATABASE_URL in `backend/.env`
- Make sure Supabase project is active
- Check if password in connection string is correct

### Port already in use:
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/.env
PORT=5001
```

---

## 🎨 Customization

### Change App Name:
1. Edit `frontend/index.html` - Update `<title>`
2. Edit `frontend/src/pages/Login.tsx` - Update logo text
3. Edit `frontend/src/pages/StudentDashboard.tsx` - Update header

### Change Colors:
Edit `frontend/tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#your-color',
    600: '#your-darker-color',
    // ...
  }
}
```

---

## 📚 Next Steps

1. **Add More Features:**
   - File attachments
   - Email notifications
   - Search and filters
   - Dark mode

2. **Deploy to Production:**
   - Backend: Railway, Render, AWS
   - Frontend: Vercel, Netlify
   - Database: Keep Supabase or move to AWS RDS

3. **Improve Security:**
   - Add rate limiting
   - Implement password reset
   - Add 2FA for admins

---

## 💡 Tips

- Keep both terminals running during development
- Use Prisma Studio to view/edit database data
- Check browser console and terminal for errors
- All TypeScript errors in VS Code are expected until packages are installed

---

**Need detailed documentation?** See:
- `README.md` (main project overview)
- `backend/README.md` (API documentation)
- `frontend/README.md` (UI documentation)

---

**Happy coding! 🚀**
