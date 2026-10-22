@echo off
title SinauJepang - Local Dev Server (With Live Logs)
cd /d "%~dp0\.."

echo ========================================================
echo   MENJALANKAN SERVER LOKAL SINAUJEPANG (FIREBASE SERVE)
echo ========================================================
echo.
echo Direktori: %CD%
echo URL: http://localhost:5000
echo Mode: Fast Local Hosting Server (Target: sinaujepang)
echo Tekan Ctrl + C untuk mematikan server.
echo.

call firebase serve --only hosting:sinaujepang

pause
