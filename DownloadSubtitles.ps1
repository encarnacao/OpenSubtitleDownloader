# Honestly I barely wrote this script. This is a mix of Github Copilot and I'm trying to learn how to use it.

#It's been a few hours since the statement above and I actually had to write another script so this little program could work properly which broadened my understanding of how to use PowerShell. Still a little raw but I'm starting to get the hang of it.

# I need to separate the scriptFolder from the episodeFolder because I need to run the Node.js script from a specific location
# to use the .env file correctly.
param(
    [string] $episodeFolder
)

$scriptFolder = Split-Path -Parent $MyInvocation.MyCommand.Path

# All the removals from the directory listing is specific for my Doctor Who episodes
# Adapt the condition as needed for your use case
Get-ChildItem -Path $episodeFolder | Where-Object {
  $_.Name -notmatch "(Bonus|Outro|Intro|BBC Recon|animation|BW)" -and $_.Name -match "\.(avi|mkv|mp4)$"
} | ForEach-Object { 
  $filePath = Join-Path $episodeFolder $_.Name

  # Change location to the script folder
  Push-Location $scriptFolder

  # Call the node script with the full file path
  & node .\src\app.js "$filePath"

  # Return to the episode folder
  Pop-Location
}

# # Await for the user to press a key before closing the script
Write-Host "Press any key to continue..."
[void][System.Console]::ReadKey($true)

# # End of script