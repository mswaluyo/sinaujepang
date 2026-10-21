@echo off

rem ------------------------------------------------------------
rem Deploy script for SinauJepang project
rem ------------------------------------------------------------

rem Usage: deploy.bat "Commit message"
if "%~1"=="" (
    echo Error: Commit message not provided.
    echo Usage: %~nx0 "Your commit message"
    exit /b 1
)

set "COMMIT_MSG=%~1"

rem Stage all changes
git add .
if errorlevel 1 (
    echo Failed to stage files.
    exit /b 1
)

rem Commit
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo Nothing to commit or commit failed.
    exit /b 1
)

rem Push to remote
git push origin main
if errorlevel 1 (
    echo Git push failed.
    exit /b 1
)

rem Optional: clear old releases to avoid quota issues
rem Uncomment the next line if you hit Hosting storage quota
rem firebase hosting:channel:clear live

rem Deploy to Firebase Hosting (target sinaujepang)
firebase deploy --only hosting:sinaujepang --project sinau-jepang
if errorlevel 1 (
    echo Firebase deploy failed.
    exit /b 1
)

echo Deployment completed successfully.
exit /b 0
