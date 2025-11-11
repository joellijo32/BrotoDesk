# 🎉 BrotoDesk - Feature Update Quick Guide

## ✅ What's New?

### 1️⃣ Admin Auto-Navigation
After updating a complaint, admins are automatically redirected to the dashboard.

### 2️⃣ Photo Upload for Complaints
Students can now upload photos as evidence when creating complaints!

---

## 🚀 How to Use

### For Students:

#### Creating a Complaint with Photo:

1. Login → `student@brototype.com` / `student123`
2. Click **"New Complaint"** button
3. Fill in:
   - ✍️ **Title** (min 5 characters)
   - 📁 **Category** (HOSTEL, PLACEMENT, MENTOR, etc.)
   - 📝 **Description** (min 10 characters)
4. **Upload Photo (Optional):**
   - Click the upload area
   - Select an image (JPEG, PNG, GIF, WebP)
   - Max size: **5MB**
   - See live preview ✨
5. Click **"Create Complaint"**
6. ✅ Done!

**Photo Guidelines:**
- 📸 Formats: JPEG, PNG, GIF, WebP
- 📏 Max size: 5MB
- 🎯 Optional but recommended for visual evidence

### For Admins:

#### Updating Complaints:

1. Login → `admin@brototype.com` / `admin123`
2. Click any complaint from dashboard
3. View complaint details (including photos if uploaded)
4. Update:
   - Select **Status** (Pending, In Progress, Resolved, etc.)
   - Add **Admin Response**
5. Click **"Update Complaint"**
6. ✅ **Automatically returns to dashboard!**

---

## 📸 Photo Upload Features

| Feature | Description |
|---------|-------------|
| **Drag & Drop** | Drag image onto upload area |
| **Live Preview** | See image before uploading |
| **File Validation** | Only images, max 5MB |
| **Remove Photo** | Click ❌ to remove before submitting |
| **Grid Display** | Photos shown in complaint details |

---

## 🎯 Test Scenarios

### ✅ Valid Photo Upload:
```
File: broken-laptop.jpg
Size: 2.3 MB
Type: JPEG
Result: ✅ Success!
```

### ❌ Invalid Uploads:

**Too Large:**
```
File: high-res-photo.jpg
Size: 8 MB
Result: ❌ "Image size must be less than 5MB"
```

**Wrong Type:**
```
File: document.pdf
Type: PDF
Result: ❌ "Only image files allowed"
```

---

## 🌐 URLs

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **Photos:** http://localhost:5000/uploads/{filename}

---

## 🔐 Login Credentials

**Admin:**
- Email: `admin@brototype.com`
- Password: `admin123`

**Student:**
- Email: `student@brototype.com`
- Password: `student123`

---

## 📊 Workflow Examples

### Example 1: Hostel Complaint with Photo

```
Title: "AC Not Working in Room 205"
Category: HOSTEL
Description: "The AC has been broken for 3 days. Room temperature is unbearable."
Photo: [Upload image of broken AC unit]
→ Submit
→ ✅ Complaint created with photo!
```

### Example 2: Admin Response

```
Admin views complaint
→ Sees photo of broken AC
→ Status: "RESOLVED"
→ Response: "AC repaired by maintenance team. Please check."
→ Update Complaint
→ ✅ Redirected to dashboard automatically!
```

---

## 🎨 UI Preview

### Upload Area (Empty):
```
┌────────────────────────────┐
│         📤                 │
│  Click to upload           │
│  or drag and drop          │
│                            │
│  PNG, JPG, GIF, WebP       │
│  (MAX. 5MB)                │
└────────────────────────────┘
```

### With Preview:
```
┌────────────────────────────┐
│  [Preview Image]       ❌  │
│                            │
│  broken-ac.jpg             │
│  2.5 KB                    │
└────────────────────────────┘
```

---

## 🔧 Troubleshooting

**Problem:** Can't upload photo
- ✅ Check file is an image (not PDF, Word, etc.)
- ✅ Ensure file is < 5MB
- ✅ Try different image format

**Problem:** Photo not showing
- ✅ Refresh the page
- ✅ Check browser console for errors
- ✅ Ensure backend server is running

**Problem:** Admin not redirected after update
- ✅ Clear browser cache
- ✅ Ensure servers are restarted

---

## 📝 Notes

- Photos are **optional** - you can create complaints without them
- Only the student who created a complaint can upload photos
- Photos are stored securely on the backend
- All images are validated before upload
- File names are auto-generated to prevent conflicts

---

**Status:** ✅ All features working
**Last Updated:** November 11, 2025
