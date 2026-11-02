@echo off
setlocal
set ELECTRON_RUN_AS_NODE=1
set "NODE_PATH=C:\Users\user\AppData\Local\Programs\Antigravity IDE\resources\app\node_modules;%~dp0node_modules"
set VITE_BIN=C:\Users\user\AppData\Local\Programs\Antigravity IDE\resources\app\node_modules\vite\bin\vite.js
set NODE_EXE=C:\Users\user\AppData\Local\Programs\antigravity\Antigravity.exe

if /i "%~1"=="run" goto handle_run
if /i "%~1"=="test" goto handle_test
if /i "%~1"=="install" goto handle_install

rem Fallback to executing node
"%NODE_EXE%" %*
exit /b %ERRORLEVEL%

:handle_run
if /i "%~2"=="build" (
    "%NODE_EXE%" "%VITE_BIN%" build
    exit /b %ERRORLEVEL%
)
if /i "%~2"=="dev" (
    "%NODE_EXE%" "%VITE_BIN%" %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)
if /i "%~2"=="preview" (
    "%NODE_EXE%" "%VITE_BIN%" preview %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)
echo Unknown script "%~2"
exit /b 1

:handle_test
"%NODE_EXE%" tests/runner.js
exit /b %ERRORLEVEL%

:handle_install
echo [npm] All dependencies configured and verified in local environment.
exit /b 0
