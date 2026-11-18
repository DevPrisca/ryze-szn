@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing packages, please wait...
  call npm install
)
echo Starting RYZE...
call npm run dev
pause
