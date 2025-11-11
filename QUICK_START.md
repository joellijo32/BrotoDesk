# ⚡ Quick Start - No Supabase Required!

## 🎯 One Command Setup (If you have Docker)

```powershell
.\start-dev.ps1
```

That's it! The script will:
- ✅ Check Docker is installed and running
- ✅ Start PostgreSQL database in Docker
- ✅ Setup database schema
- ✅ Generate Prisma Client

Then just start the servers:

```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Visit: **http://localhost:5173** 🎉

---

## 🚀 Even Faster - Start Everything

```powershell
.\start-all.ps1
```

This opens two new terminal windows with backend and frontend running!

---

## 📋 Requirements

1. **Docker Desktop** - Download from: https://www.docker.com/products/docker-desktop
2. **Node.js** - Already installed ✓
3. **npm packages** - Already installed ✓

---

## 🛑 Stop Everything

```powershell
.\stop-all.ps1
```

Or manually:
```powershell
docker-compose down
```

---

## 🔧 Database Access

The local database runs with these credentials:

- **Host:** localhost
- **Port:** 5432
- **Database:** brotoDesk
- **Username:** postgres
- **Password:** brotoDesk2025

To view/edit database:
```powershell
cd backend
npm run db:studio
```

Opens Prisma Studio at: http://localhost:5555

---

## 📦 What's Running?

After running `start-dev.ps1`:

1. **PostgreSQL** - Docker container on port 5432
2. **Backend API** - http://localhost:5000
3. **Frontend App** - http://localhost:5173

---

## ⚠️ Don't Have Docker?

### Option 1: Install Docker (Recommended)
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Install and start it
3. Run `.\start-dev.ps1`

### Option 2: Use SQLite (No Docker needed)

Edit `backend\prisma\schema.prisma`:

Change line 2-4 from:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

To:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

Then:
```powershell
cd backend
npm run db:push
npm run db:generate
npm run dev
```

In another terminal:
```powershell
cd frontend
npm run dev
```

---

## 🎓 First Time Using BrotoDesk

1. Visit http://localhost:5173
2. Click **"Register here"**
3. Create account:
   - Name: Your Name
   - Email: your@email.com
   - Student ID: ANY123
   - Password: password123
4. Login with your credentials
5. Create a test complaint!

### Make Yourself an Admin

```powershell
cd backend
npm run db:studio
```

- Click **users** table
- Find your user
- Change `role` from `STUDENT` to `ADMIN`
- Save
- Logout and login again
- Now you can access Admin Dashboard!

---

## 🔄 Daily Usage

### Starting (with Docker)
```powershell
.\start-all.ps1
```

### Stopping
```powershell
.\stop-all.ps1
```

---

## 🆘 Troubleshooting

### "Docker is not running"
- Open Docker Desktop
- Wait for it to start (whale icon in system tray)
- Run the script again

### "Port 5432 already in use"
Another PostgreSQL is running. Either:
- Stop the other PostgreSQL service
- Or change the port in `docker-compose.yml`:
  ```yaml
  ports:
    - "5433:5432"  # Use 5433 instead
  ```
  Then update `backend\.env`:
  ```
  DATABASE_URL="postgresql://postgres:brotoDesk2025@localhost:5433/brotoDesk"
  ```

### "Cannot connect to database"
```powershell
# Restart the database
docker-compose down
docker-compose up -d

# Wait 5 seconds
Start-Sleep -Seconds 5

# Try again
cd backend
npm run dev
```

### Reset Database (Clear all data)
```powershell
docker-compose down -v
.\start-dev.ps1
```

---

## 📊 Useful Commands

```powershell
# Check if database is running
docker ps

# View database logs
docker logs broto-desk-db

# Stop database
docker-compose down

# Start database
docker-compose up -d

# Remove database and all data
docker-compose down -v

# View Prisma Studio
cd backend
npm run db:studio
```

---

## 🎉 That's It!

No Supabase account needed. Everything runs locally on your machine!

**Next Steps:**
1. Run `.\start-dev.ps1` (one time setup)
2. Run `.\start-all.ps1` (starts everything)
3. Visit http://localhost:5173
4. Register and start using BrotoDesk!

Happy coding! 🚀
