# Smart Bus Monitor v3.0 - Full-Stack Application

Complete Smart Bus Passenger Monitoring & Anti-Cheating System with real-time tracking, access logging, and role-based authentication.

## 🏗️ Architecture

- **Frontend**: React 18 + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: Session-based with bcrypt password hashing
- **Database**: MongoDB (local instance)
- **Communication**: REST APIs with CORS

## 📁 Project Structure

```
smart-bus-monitor-v3/
├── backend/                    # Node.js backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── models/            # Mongoose models
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Auth & logging middleware
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Utilities & seeding
│   │   └── server.js          # Main server file
│   ├── .env                   # Environment variables
│   └── package.json
│
├── src/                       # React frontend
│   ├── components/            # Reusable components
│   ├── context/               # React Context (Auth)
│   ├── pages/                 # Page components
│   ├── services/              # API service layer
│   └── App.jsx
│
└── package.json               # Frontend dependencies

```

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (running locally on port 27017)

### Installation

#### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 2. Start MongoDB

Make sure MongoDB is running:

```bash
# Windows
net start MongoDB

# Or if installed manually
mongod
```

#### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@bus.com` / `password`
- Viewer user: `viewer@bus.com` / `password`
- Sample bus data
- Sample seat occupancy
- Sample trip snapshots
- Sample alerts
- Sample access logs

#### 4. Start the Backend Server

```bash
cd backend
npm run dev
```

Backend will run on **http://localhost:5000**

#### 5. Start the Frontend

Open a new terminal:

```bash
npm start
```

Frontend will run on **http://localhost:3000**

## 🔐 Login Credentials

### Admin Account (Full Access)
- **Email**: admin@bus.com
- **Password**: password
- **Permissions**: Can view access logs

### Viewer Account (Limited Access)
- **Email**: viewer@bus.com
- **Password**: password
- **Permissions**: Cannot view access logs

## 📊 Features

### Frontend Pages

1. **Login Page**
   - Session-based authentication
   - Error handling
   - Animated UI

2. **Operations Dashboard**
   - Real-time bus status
   - Seat occupancy map
   - Live alerts feed
   - GPS location tracking

3. **Performance Page**
   - Historical metrics
   - Trip statistics
   - Performance charts

4. **Analytics Page**
   - Seat utilization heatmap
   - Passenger trends
   - Peak hours analysis

5. **Access Logs Page** (Admin Only)
   - Complete audit trail
   - Filter by date, user, action
   - Export to CSV
   - Real-time statistics

### Backend Features

- ✅ **Authentication**: Session-based with bcrypt
- ✅ **Authorization**: Role-based access control
- ✅ **Access Logging**: Every API call logged to MongoDB
- ✅ **Bus Data Management**: Real-time status and seat tracking
- ✅ **Analytics**: Aggregated metrics and insights
- ✅ **ESP32 Integration**: Endpoint for IoT device data
- ✅ **Database Seeding**: Sample data for testing

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Bus Data
- `GET /api/bus/status` - Get current bus status
- `GET /api/bus/seats` - Get seat occupancy
- `POST /api/bus/snapshot` - ESP32 pushes live data

### Analytics
- `GET /api/analytics` - Get analytics data
- `GET /api/analytics/performance` - Get performance metrics
- `GET /api/analytics/alerts` - Get alerts

### Access Logs (Admin Only)
- `GET /api/access-logs` - Get access logs with filtering
- `GET /api/access-logs/stats` - Get access statistics
- `GET /api/access-logs/export` - Export logs as CSV

### Development
- `POST /api/seed/all` - Seed database
- `GET /health` - Health check

## 🗄️ Database Schema

### Collections

1. **users** - User accounts with roles
2. **accesslogs** - Complete audit trail
3. **buses** - Bus information and status
4. **seats** - Seat occupancy data
5. **tripsnapshots** - Historical trip data
6. **alerts** - System alerts and warnings

## 🔧 Configuration

### Backend Environment Variables

Located in `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-bus
SESSION_SECRET=supersecretkey_smart_bus_monitor_2024
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend Proxy

The frontend is configured to proxy API requests to the backend. See `package.json`:

```json
"proxy": "http://localhost:5000"
```

## 🧪 Testing

### Test Backend

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bus.com","password":"password"}'
```

### Test Frontend

1. Open http://localhost:3000
2. Login with admin@bus.com / password
3. Navigate through all pages
4. Check Access Logs page (admin only)

## 📝 Access Logging

Every API request is automatically logged with:

- User ID and username
- User role (ADMIN/VIEWER)
- Action performed
- Route and HTTP method
- IP address
- User agent
- Response status code
- Response time (ms)
- Timestamp

View logs in the **Access Logs** page (admin only).

## 🎨 UI Features

- Modern glassmorphic design
- Dark theme
- Smooth animations with Framer Motion
- Responsive layout
- Real-time data updates
- Color-coded status indicators
- Role badges
- Interactive charts

## 🔒 Security

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ Session-based authentication
- ✅ HTTP-only cookies
- ✅ CORS configured for specific origin
- ✅ Role-based access control
- ✅ Complete audit trail
- ✅ Input validation

## 📦 Dependencies

### Backend
- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- express-session - Session management
- cors - Cross-origin resource sharing
- dotenv - Environment variables
- morgan - HTTP request logger

### Frontend
- react - UI library
- react-router-dom - Routing
- framer-motion - Animations
- lucide-react - Icons
- tailwindcss - Styling
- recharts - Charts
- leaflet - Maps

## 🚨 Troubleshooting

### MongoDB Connection Error

```bash
# Make sure MongoDB is running
net start MongoDB

# Or check if mongod process is running
tasklist | findstr mongod
```

### Backend Port Already in Use

```bash
# Change PORT in backend/.env
PORT=5001
```

### Frontend Can't Connect to Backend

1. Make sure backend is running on port 5000
2. Check proxy configuration in frontend package.json
3. Restart both servers

## 📄 License

MIT

## 👨‍💻 Author

Smart Bus Monitoring System v3.0

---

**Note**: This is a development setup. For production deployment:
- Use environment-specific .env files
- Enable HTTPS
- Use Redis for session storage
- Add rate limiting
- Implement JWT tokens for API authentication
- Set up proper MongoDB authentication
- Use PM2 or similar for process management
