# 🚀 QUICK REFERENCE - BrotoDesk

## 📍 You Need To Know

**IMPORTANT:** Always run commands from the **ROOT** folder: `C:\Users\Joell\JoelVsCode\BrotoDesk`

If you're in `backend` or `frontend` folder, go back first:
```powershell
cd ..
```

---

## ⚡ Quick Commands

### Start Everything:
```powershell
# Make sure you're in: C:\Users\Joell\JoelVsCode\BrotoDesk
.\start-all.ps1
```

### Stop Everything:
```powershell
# Just close the two terminal windows that opened
# OR press Ctrl+C in each window
```

### View Database:
```powershell
cd backend
npm run db:studio
# Opens at http://localhost:5555
```

---

## 🔐 Login Credentials

### Admin:
```
Email: admin@brototype.com
Password: admin123
```

### Student:
```
Email: student@brototype.com
Password: student123
```

---

## 🌐 Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Database Studio:** http://localhost:5555 (run `npm run db:studio` first)

---

## 📂 Folder Structure

```
BrotoDesk/                    ← YOU ARE HERE (root)
├── start-all.ps1            ← Run this to start
├── backend/
│   ├── npm run dev          ← Start backend only
│   └── npm run db:studio    ← View database
└── frontend/
    └── npm run dev          ← Start frontend only
```

---

## ✅ What's Running Now

After `.\start-all.ps1`:
- ✅ Backend server at http://localhost:5000
- ✅ Frontend app at http://localhost:5173
- ✅ Two terminal windows opened automatically

---

## 🧪 Test Now

1. Visit: **http://localhost:5173**
2. Login as Admin: `admin@brototype.com` / `admin123`
3. OR Login as Student: `student@brototype.com` / `student123`
4. Create complaints, manage them, enjoy! 🎉

---

## 🆘 Troubleshooting

### "start-all.ps1 not found"
```powershell
# You're in the wrong folder!
cd C:\Users\Joell\JoelVsCode\BrotoDesk
.\start-all.ps1
```

### "Port already in use"
```powershell
# Close the terminal windows and try again
# OR restart your computer
```

### Servers not responding
```powershell
# Close terminals and restart:
.\start-all.ps1
```

---

**Remember:** Always be in `C:\Users\Joell\JoelVsCode\BrotoDesk` when running `.\start-all.ps1`
