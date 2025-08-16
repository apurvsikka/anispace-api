@echo off
setlocal enabledelayedexpansion

set URL=http://localhost:3000/api/manga/latest

for /L %%i in (1,1,300000) do (
    echo [%%i] GET %URL%
    curl -i -X GET "%URL%"
    echo -------------------------------
)
