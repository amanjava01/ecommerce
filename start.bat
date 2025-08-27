@echo off
echo Starting E-Commerce Application...
echo.

REM Check if Docker is running
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed or not running.
    echo Please install Docker Desktop and make sure it's running.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo Please edit .env file with your configuration before running again.
    pause
    exit /b 1
)

echo Building and starting containers...
docker-compose up -d

if errorlevel 1 (
    echo Error: Failed to start containers.
    pause
    exit /b 1
)

echo.
echo ========================================
echo E-Commerce Application Started!
echo ========================================
echo.
echo Frontend: https://localhost
echo Admin Panel: https://localhost/admin
echo API Documentation: https://localhost/api/swagger-ui.html
echo.
echo Default Admin Credentials:
echo Email: admin@ecommerce.com
echo Password: Admin123!
echo.
echo Press Ctrl+C to stop the application
echo ========================================

REM Wait for user input to stop
pause

echo Stopping application...
docker-compose down