# 🚀 QUICK START GUIDE

## Prerequisites

1. **Node.js** installed (v14 or higher)
2. **MongoDB** installed and running on port 27017

## First Time Setup

### Option 1: Automated Setup (Recommended)

Simply double-click: **`quick-start.bat`**

This will:
- ✅ Check if MongoDB is running
- ✅ Seed the database with sample data
- ✅ Start the backend server
- ✅ Start the frontend

### Option 2: Manual Setup

#### Step 1: Start MongoDB
```bash
net start MongoDB
```

#### Step 2: Seed Database
Double-click: **`seed-database.bat`**

Or run manually:
```bash
cd backend
npm run seed
```

#### Step 3: Start Backend
Double-click: **`start-backend.bat`**

Or run manually:
```bash
cd backend
npm run dev
```

#### Step 4: Start Frontend
Open new terminal:
```bash
npm start
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Login Credentials

### Admin Account (Full Access)
- Email: `admin@bus.com`
- Password: `password`
- Can view access logs

### Viewer Account (Limited Access)
- Email: `viewer@bus.com`
- Password: `password`
- Cannot view access logs

## Troubleshooting

### MongoDB Not Running
```bash
# Start MongoDB service
net start MongoDB

# Or if installed manually
mongod
```

### Port Already in Use
- Backend uses port 5000
- Frontend uses port 3000
- Change ports in `backend/.env` if needed

### Backend Connection Error
1. Make sure MongoDB is running
2. Check backend terminal for errors
3. Verify `backend/.env` has correct MongoDB URI

### Frontend Can't Connect
1. Make sure backend is running on port 5000
2. Check browser console for errors
3. Verify proxy in `package.json` is set to `http://localhost:5000`

## Features

✅ Session-based authentication
✅ Role-based access control (Admin/Viewer)
✅ Complete access logging and audit trail
✅ Real-time bus monitoring
✅ Seat occupancy tracking
✅ Performance analytics
✅ Alert management
✅ CSV export of access logs

## Project Structure

```
smart-bus-monitor-v3/
├── backend/              # Node.js + Express backend
│   ├── src/
│   │   ├── config/      # Database config
│   │   ├── models/      # Mongoose models
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Auth & logging
│   │   ├── routes/      # API routes
│   │   └── utils/       # Utilities
│   └── .env             # Environment variables
│
├── src/                 # React frontend
│   ├── components/      # UI components
│   ├── context/         # Auth context
│   ├── pages/           # Page components
│   └── services/        # API service
│
├── quick-start.bat      # Automated setup
├── start-backend.bat    # Start backend only
└── seed-database.bat    # Seed database only
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- GET `/api/auth/session` - Get session

### Bus Data
- GET `/api/bus/status` - Bus status
- GET `/api/bus/seats` - Seat occupancy
- POST `/api/bus/snapshot` - ESP32 data

### Analytics
- GET `/api/analytics` - Analytics data
- GET `/api/analytics/performance` - Performance metrics
- GET `/api/analytics/alerts` - Alerts

### Access Logs (Admin Only)
- GET `/api/access-logs` - Get logs
- GET `/api/access-logs/stats` - Statistics
- GET `/api/access-logs/export` - Export CSV

## Next Steps

1. **Test the application**
   - Login with both admin and viewer accounts
   - Navigate through all pages
   - Test access logs (admin only)

2. **Customize**
   - Update bus routes
   - Modify seat layout
   - Add custom alerts

3. **Deploy**
   - Set up production environment
   - Configure HTTPS
   - Use Redis for sessions
   - Add rate limiting

## Support

For detailed documentation, see:
- [README.md](README.md) - Complete documentation
- [backend/README.md](backend/README.md) - Backend API docs

---

**Enjoy your Smart Bus Monitoring System! 🚌**
