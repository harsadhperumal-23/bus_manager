@echo off
echo ========================================
echo  Smart Bus Monitor - Database Seeding
echo ========================================
echo.

cd backend

echo Seeding database with sample data...
echo This will create:
echo - Admin user: admin@bus.com / password
echo - Viewer user: viewer@bus.com / password
echo - Sample bus data
echo - Sample seat occupancy
echo - Sample trip snapshots
echo - Sample alerts
echo - Sample access logs
echo.

call npm run seed

echo.
echo ========================================
echo  Database seeding completed!
echo ========================================
pause
