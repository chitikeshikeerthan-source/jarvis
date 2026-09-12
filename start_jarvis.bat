@echo off
title JARVIS Local Mission Control Server (Port 8080)
echo =========================================================================
echo   🚀 LAUNCHING JARVIS ASTRONAUT ASSISTANCE MISSION CONTROL SYSTEM
echo   Running HTTP Server on http://localhost:8080
echo =========================================================================
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0serve.ps1"

pause
