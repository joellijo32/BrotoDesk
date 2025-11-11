# BrotoDesk Frontend

Modern React-based frontend for the BrotoDesk Complaint Management System.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Backend API running (see `../backend/README.md`)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
# Copy the example env file
copy .env.example .env

# Edit .env if needed (default points to localhost:5000)
```

3. **Start development server:**
```bash
npm run dev
```

The app will open automatically at `http://localhost:5173`

## 📦 Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

## 🎨 Features

### Student Portal
- **Dashboard** - View all submitted complaints with status
- **Create Complaint** - Submit new complaints with category selection
- **Track Status** - Real-time status updates (Pending, In Progress, Resolved)
- **Notifications** - Get notified when admin responds

### Admin Portal
- **Analytics Dashboard** - Overview stats (total, pending, in progress, resolved)
- **Complaint Management** - View, filter, and manage all complaints
- **Status Updates** - Change complaint status and add responses
- **Student Information** - View student details for each complaint

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## 📂 Project Structure

```
src/
├── components/       # Reusable components
│   └── ProtectedRoute.tsx
├── context/          # React context providers
│   └── AuthContext.tsx
├── lib/              # Utilities and API client
│   └── api.ts
├── pages/            # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── StudentDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── ComplaintDetail.tsx
├── types/            # TypeScript types
│   └── index.ts
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## 🔐 Authentication

The app uses JWT tokens stored in localStorage. All authenticated routes are protected using the `ProtectedRoute` component.

**Login Credentials (after registration):**
- Students: Use registered email and password
- Admins: Register with admin role (or create via backend)

## 🎨 Design System

### Colors
- **Primary:** Blue (#0ea5e9) - Used for CTAs and important actions
- **Success:** Green - Resolved complaints
- **Warning:** Yellow - Pending complaints
- **Info:** Blue - In-progress complaints

### Components
- `btn-primary` - Primary action buttons
- `btn-secondary` - Secondary actions
- `input` - Form inputs with focus states
- `card` - Content containers with shadow

## 🌐 API Integration

The frontend connects to the backend API at `http://localhost:5000/api/v1` by default.

To change the API URL, edit `.env`:
```env
VITE_API_URL=https://your-api-url.com/api/v1
```

## 📱 Responsive Design

The UI is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚦 Available Scripts

```bash
npm run dev       # Start dev server with hot reload
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## 🎯 User Flows

### Student Flow
1. Register → 2. Login → 3. Dashboard → 4. Create Complaint → 5. Track Status

### Admin Flow
1. Login → 2. Admin Dashboard → 3. View Complaints → 4. Update Status → 5. Add Response

## 🔧 Customization

### Changing Theme Colors
Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      }
    }
  }
}
```

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Protect with `ProtectedRoute` if needed

## 📝 Notes

- All API calls include the JWT token automatically via Axios interceptor
- Error handling is done via toast notifications
- Loading states are handled with spinners
- Form validation is done client-side before API calls
