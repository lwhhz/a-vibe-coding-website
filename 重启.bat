@echo off
chcp 65001 >nul 2>&1
cls

echo ==============================
echo    正在重启 前端 + 后端 + 后台
echo ==============================

taskkill /f /im node.exe >nul 2>&1

echo 重启前端...
cd /d D:\TraeAgent_output\Callduck_company\frontend
start cmd /k "npm run dev"

echo 重启后端...
cd /d D:\TraeAgent_output\Callduck_company\backend
start cmd /k "npm start"

echo 重启后台...
cd /d D:\TraeAgent_output\Callduck_company\backend\admin
start cmd /k "npm run dev"

echo 重启后台咨询...
cd /d D:\TraeAgent_output\Callduck_company\backend\admin-contact
start cmd /k "npm run dev"

echo 重启完成！
pause
