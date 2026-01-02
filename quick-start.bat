@echo off
echo ========================================
echo  Smart Bus Monitor - Quick Start
echo ========================================
echo.
echo This script will:
echo 1. Check MongoDB status
echo 2. Seed the database
echo 3. Start the backend server
echo 4. Start the frontend
echo.
echo Press any key to continue...
pause > nul

echo.
echo [1/4] Checking MongoDB...
sc query MongoDB | find "RUNNING" > nul
if %errorlevel% equ 0 (
    echo ✓ MongoDB is running
) else (
    echo ✗ MongoDB is not running
    echo Starting MongoDB...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: Could not start MongoDB
        echo Please start MongoDB manually and run this script again
        pause
        exit /b 1
    )
)

echo.
echo [2/4] Seeding database...
cd backend
call npm run seed
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Database seeding failed
    pause
    exit /b 1
)
cd ..

echo.
echo [3/4] Starting backend server...
start "Smart Bus Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 > nul

echo.
echo [4/4] Starting frontend...
start "Smart Bus Frontend" cmd /k "npm start"

echo.
echo ========================================
echo  Smart Bus Monitor is starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Login credentials:
echo   Admin:  admin@bus.com / password
echo   Viewer: viewer@bus.com / password
echo.
echo Press any key to exit this window...
pause > nul
