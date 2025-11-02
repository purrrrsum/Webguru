@echo off
echo Creating zip file for Hostinger deployment...
echo.

REM Create zip using PowerShell
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$files = Get-ChildItem -Path . -Recurse -File | ^
Where-Object { $_.FullName -notmatch 'node_modules|\.git|\.next|\.vercel|out|build|coverage|\.env\.local|\.DS_Store|\.log$|\.pnp|\.tsbuildinfo|next-env\.d\.ts' -and $_.FullName -notmatch '\\uploads\\(?!\.gitkeep)' }; ^
$zipPath = 'thesupport-agency-for-hostinger.zip'; ^
if (Test-Path $zipPath) { Remove-Item $zipPath }; ^
Compress-Archive -Path $files -DestinationPath $zipPath -Force; ^
Write-Host ''; ^
Write-Host 'Successfully created:' $zipPath; ^
$size = (Get-Item $zipPath).Length / 1MB; ^
Write-Host ('File size: {0:N2} MB' -f $size); ^
Write-Host ''; ^
Write-Host 'Ready to upload to Hostinger!'"

echo.
echo Done!
pause

