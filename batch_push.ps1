# Batch Git Push Script
# Pushes files in batches of 5, with 2-minute intervals between pushes

$BATCH_SIZE = 5
$WAIT_MINUTES = 2

Write-Host "=== Batch Git Push Script ===" -ForegroundColor Cyan
Write-Host "Batch Size: $BATCH_SIZE files" -ForegroundColor Yellow
Write-Host "Interval: $WAIT_MINUTES minutes between batches`n" -ForegroundColor Yellow

# Get all untracked and modified files
$modifiedFiles = git diff --name-only
$untrackedFiles = git ls-files --others --exclude-standard

# Combine all files and exclude batch_push.ps1
$allFiles = @()
if ($modifiedFiles) { $allFiles += $modifiedFiles }
if ($untrackedFiles) { $allFiles += $untrackedFiles }

# Filter out batch_push.ps1
$allFiles = $allFiles | Where-Object { $_ -ne "batch_push.ps1" }

if ($allFiles.Count -eq 0) {
    Write-Host "No files to commit!" -ForegroundColor Red
    exit 0
}

Write-Host "Total files to commit: $($allFiles.Count)" -ForegroundColor Green
Write-Host "Total batches: $([Math]::Ceiling($allFiles.Count / $BATCH_SIZE))`n" -ForegroundColor Green

# Split files into batches
$batches = @()
for ($i = 0; $i -lt $allFiles.Count; $i += $BATCH_SIZE) {
    $end = [Math]::Min($i + $BATCH_SIZE - 1, $allFiles.Count - 1)
    $batches += , @($allFiles[$i..$end])
}

# Process each batch
$batchNumber = 1
foreach ($batch in $batches) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Processing Batch $batchNumber of $($batches.Count)" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
    # Show files in this batch
    Write-Host "`nFiles in this batch:" -ForegroundColor Yellow
    foreach ($file in $batch) {
        Write-Host "  - $file" -ForegroundColor White
    }
    
    # Stage files
    Write-Host "`nStaging files..." -ForegroundColor Yellow
    foreach ($file in $batch) {
        git add $file
    }
    
    # Commit
    Write-Host "`nEnter your commit message for this batch:" -ForegroundColor Yellow
    $commitMessage = Read-Host "Commit message"
    
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "batch commit $batchNumber/$($batches.Count)"
        Write-Host "Using default message: '$commitMessage'" -ForegroundColor Gray
    }
    
    Write-Host "Committing with message: '$commitMessage'" -ForegroundColor Yellow
    git commit -m $commitMessage
    
    # Push
    Write-Host "Pushing to remote..." -ForegroundColor Yellow
    git push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Batch $batchNumber pushed successfully!" -ForegroundColor Green
    }
    else {
        Write-Host "✗ Failed to push batch $batchNumber" -ForegroundColor Red
        Write-Host "You may need to resolve conflicts or pull first." -ForegroundColor Red
        
        $continue = Read-Host "Continue with next batch? (y/n)"
        if ($continue -ne 'y') {
            Write-Host "Exiting script." -ForegroundColor Yellow
            exit 1
        }
    }
    
    # Wait before next batch (unless it's the last one)
    if ($batchNumber -lt $batches.Count) {
        Write-Host "`nWaiting $WAIT_MINUTES minutes before next batch..." -ForegroundColor Magenta
        Write-Host "Next batch will start at: $((Get-Date).AddMinutes($WAIT_MINUTES).ToString('HH:mm:ss'))" -ForegroundColor Magenta
        
        # Countdown timer
        for ($i = $WAIT_MINUTES * 60; $i -gt 0; $i--) {
            $minutes = [Math]::Floor($i / 60)
            $seconds = $i % 60
            Write-Progress -Activity "Waiting for next batch" -Status "$minutes min $seconds sec remaining" -PercentComplete ((($WAIT_MINUTES * 60 - $i) / ($WAIT_MINUTES * 60)) * 100)
            Start-Sleep -Seconds 1
        }
        Write-Progress -Activity "Waiting for next batch" -Completed
    }
    
    $batchNumber++
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "All batches completed successfully! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
