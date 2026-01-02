# Smart Bus Monitor - Backend

Node.js + Express + MongoDB backend for the Smart Bus Monitoring System.

## Features

- ✅ Session-based authentication
- ✅ Role-based access control (ADMIN/VIEWER)
- ✅ Complete access logging and audit trail
- ✅ Real-time bus data handling
- ✅ MongoDB storage with Mongoose
- ✅ RESTful API endpoints
- ✅ CORS enabled for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)

## Installation

```bash
cd backend
npm install
```

## Environment Setup

The `.env` file is already configured with:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-bus
SESSION_SECRET=supersecretkey_smart_bus_monitor_2024
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## Running the Server

### Start the server
```bash
npm start
```

### Start with auto-reload (development)
```bash
npm run dev
```

### Seed the database
```bash
npm run seed
```

Or use the API endpoint:
```bash
curl -X POST http://localhost:5000/api/seed/all
```

## Default Credentials

After seeding:

**Admin Account:**
- Email: `admin@bus.com`
- Password: `password`
- Role: ADMIN (can view access logs)

**Viewer Account:**
- Email: `viewer@bus.com`
- Password: `password`
- Role: VIEWER (cannot view access logs)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Bus Data
- `GET /api/bus/status` - Get current bus status (protected)
- `GET /api/bus/seats` - Get seat occupancy (protected)
- `POST /api/bus/snapshot` - ESP32 pushes live data

### Analytics
- `GET /api/analytics` - Get analytics data (protected)
- `GET /api/analytics/performance` - Get performance metrics (protected)
- `GET /api/analytics/alerts` - Get alerts (protected)

### Access Logs (ADMIN only)
- `GET /api/access-logs` - Get access logs with filtering
- `GET /api/access-logs/stats` - Get access statistics
- `GET /api/access-logs/export` - Export logs as CSV

### Development
- `POST /api/seed/all` - Seed database (development only)
- `GET /health` - Health check

## Database Collections

- **users** - User accounts with roles
- **accesslogs** - Audit trail of all activities
- **buses** - Bus information and status
- **seats** - Seat occupancy data
- **tripsnapshots** - Historical trip data
- **alerts** - System alerts and warnings

## Access Logging

Every API request is automatically logged with:
- User ID and username
- Action performed
- Route and HTTP method
- IP address and user agent
- Response status code and time
- Timestamp

## Testing

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bus.com","password":"password"}'

# Get bus status (requires session cookie)
curl http://localhost:5000/api/bus/status \
  --cookie "connect.sid=YOUR_SESSION_COOKIE"
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/                # Mongoose models
│   │   ├── User.js
│   │   ├── AccessLog.js
│   │   ├── Bus.js
│   │   ├── Seat.js
│   │   ├── TripSnapshot.js
│   │   └── Alert.js
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── busController.js
│   │   ├── analyticsController.js
│   │   └── accessLogsController.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js
│   │   ├── roleCheck.js
│   │   └── logAccess.js
│   ├── routes/                # API routes
│   │   ├── auth.routes.js
│   │   ├── bus.routes.js
│   │   ├── analytics.routes.js
│   │   ├── accessLogs.routes.js
│   │   └── seed.routes.js
│   ├── utils/                 # Utilities
│   │   ├── seedData.js
│   │   └── seedDatabase.js
│   └── server.js              # Main server file
├── .env                       # Environment variables
└── package.json
```

## Notes

- MongoDB must be running before starting the server
- Sessions are stored in memory (use Redis for production)
- Access logs are stored indefinitely (add cleanup job if needed)
- CORS is configured for http://localhost:3000
