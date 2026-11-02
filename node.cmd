@echo off
set ELECTRON_RUN_AS_NODE=1
set "NODE_PATH=C:\Users\user\AppData\Local\Programs\Antigravity IDE\resources\app\node_modules;%~dp0node_modules"
"C:\Users\user\AppData\Local\Programs\antigravity\Antigravity.exe" %*

