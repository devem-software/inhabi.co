@echo off
setlocal enabledelayedexpansion
cd /d "D:\00.DEV\inhabi.co"

echo [1/4] Abriendo Zed en el proyecto...
start "" zed .

echo [2/4] Iniciando Vite (npm run dev)...
:: Creamos un archivo temporal para capturar la salida del servidor
if exist temp_url.txt del temp_url.txt

:: Lanzamos npm run dev en un proceso hijo y filtramos la salida para capturar el localhost
for /f "tokens=*" %%i in ('npm run dev -- --host') do (
    echo %%i
    REM Buscamos el puerto o la URL que arroja Vite (ej. http://localhost:5173/)
    echo %%i | findstr /R "http://localhost:[0-9]*" >nul
    if !errorlevel! == 0 (
        REM Extraemos la URL y la guardamos
        for %%a in (%%i) do (
            echo %%a | findstr "http" >nul
            if !errorlevel! == 0 set "URL_DEV=%%a"
        )
    )
)

pause
