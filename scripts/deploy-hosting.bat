@echo off
rem ------------------------------------------------------------
rem Automated deployment script for SinauJepang project
rem ------------------------------------------------------------

rem Optional: clear old releases to avoid quota issues
rem Uncomment the next line if you encounter Hosting storage quota errors
rem firebase hosting:channel:clear live

rem Stage all changes
git add .

rem Commit with a timestamped message
git commit -m "Automated deployment %DATE% %TIME%"
if errorlevel 1 (
    echo No changes to commit or commit failed.
) else (
    rem Push to remote (adjust branch if needed)
    git push origin main
    if errorlevel 1 (
        echo Push failed.
        exit /b 1
    )
)

rem Deploy to Firebase Hosting
firebase deploy --only hosting:sinaujepang --project sinau-jepang
if errorlevel 1 (
    echo Firebase deploy failed.
    exit /b 1
)

echo Deployment completed successfully.
pause
exit /b 0
