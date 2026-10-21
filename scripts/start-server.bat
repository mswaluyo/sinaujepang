@echo off
title SinauJepang - Local Dev Server (With Live Logs)
cd /d "%~dp0\.."

echo ========================================================
echo   MENJALANKAN SERVER LOKAL SINAUJEPANG (FIREBASE SERVE)
echo ========================================================
echo.
echo Direktori: %CD%
echo URL: http://localhost:5000
echo Mode: Live Debug Logging Enabled (firebase-debug.log)
echo Tekan Ctrl + C untuk mematikan server.
echo.

call npx firebase-tools serve --only hosting --debug

pause
