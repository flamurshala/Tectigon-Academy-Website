$ErrorActionPreference = 'Stop'

$navbarPath = Join-Path $PSScriptRoot '..\components\navbar.tsx'
$repoRoot = Join-Path $PSScriptRoot '..'
$appDir = Join-Path $repoRoot 'app'

if (!(Test-Path $navbarPath)) {
  throw "Cannot find navbar at: $navbarPath"
}

$src = Get-Content -Raw $navbarPath
$pattern = "const LOGO1_SRC\s*=\s*`r?`n\s*'data:image/png;base64,([^']+)'"
$m = [regex]::Match($src, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
if (-not $m.Success) {
  throw 'LOGO1_SRC base64 not found in components/navbar.tsx'
}

$b64 = $m.Groups[1].Value
$bytes = [Convert]::FromBase64String($b64)

$tmp = Join-Path $env:TEMP 'tectigon-logo1.png'
[IO.File]::WriteAllBytes($tmp, $bytes)

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($tmp)

if (!(Test-Path $appDir)) {
  New-Item -ItemType Directory -Path $appDir | Out-Null
}

function Save-ResizedPng([System.Drawing.Image] $image, [int] $size, [string] $path) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.DrawImage($image, 0, 0, $size, $size)
  $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

Save-ResizedPng $img 32 (Join-Path $appDir 'icon.png')
Save-ResizedPng $img 180 (Join-Path $appDir 'apple-icon.png')

$img.Dispose()
Remove-Item $tmp -Force

Write-Host 'Generated app/icon.png and app/apple-icon.png from LOGO1_SRC'

