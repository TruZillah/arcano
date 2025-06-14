@echo off
echo 🔄 Starting Firebase configuration update...

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

:: Check if Firebase CLI is installed
where firebase >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Firebase CLI is not installed. Installing...
    call npm install -g firebase-tools
    if %ERRORLEVEL% neq 0 (
        echo ❌ Failed to install Firebase CLI
        exit /b 1
    )
)

:: Check if user is logged in to Firebase
firebase login:list >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 🔐 Please log in to Firebase...
    call firebase login
    if %ERRORLEVEL% neq 0 (
        echo ❌ Firebase login failed
        exit /b 1
    )
)

:: Check if project is set
firebase projects:list >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 📁 Please select your Firebase project...
    call firebase use --add
    if %ERRORLEVEL% neq 0 (
        echo ❌ Failed to set Firebase project
        exit /b 1
    )
)

:: Run the Node.js script
echo 📝 Running Firebase config update script...
node scripts/get-firebase-config.js

if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to update Firebase configuration
    exit /b 1
)

echo.
echo ✅ Firebase configuration updated successfully!
echo 📋 Two files have been created:
echo   1. firebase-config.json - Raw Firebase configuration
echo   2. .env - Environment variables for your application
echo.
echo 🔄 Please restart your development server to apply the changes. 