@echo off
echo ========================================
echo  Smart Bus Monitor - Backend Server
echo ========================================
echo.

cd backend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting backend server...
echo Server will run on http://localhost:5000
echo.
call npm run dev
