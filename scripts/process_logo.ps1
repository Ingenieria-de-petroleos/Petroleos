Add-Type -AssemblyName System.Drawing

$inputPath = (Resolve-Path "img/logo-ambiental.jpg").Path
$bmp = New-Object System.Drawing.Bitmap $inputPath
$w = $bmp.Width
$h = $bmp.Height
Write-Host "Image size: $w x $h"

# Find bounds of circular emblem
# The emblem is at the top, text is at the bottom
$minX = $w; $maxX = 0; $minY = $h; $maxY = 0

for ($y = 0; $y -lt 450; $y += 2) {
    for ($x = 0; $x -lt $w; $x += 2) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Emblem bounds: X=[$minX..$maxX], Y=[$minY..$maxY]"
$emblemW = $maxX - $minX
$emblemH = $maxY - $minY
$centerX = [int](($minX + $maxX) / 2)
$centerY = [int](($minY + $maxY) / 2)
$emblemRadius = [int]([Math]::Max($emblemW, $emblemH) / 2)
Write-Host "Emblem Center: ($centerX, $centerY), Radius: $emblemRadius"

# Let's create a perfect square crop of the emblem with slight margin (e.g. 512x512)
$cropSize = [int]($emblemRadius * 2 + 30)
$cropX = [int]($centerX - $cropSize / 2)
$cropY = [int]($centerY - $cropSize / 2)

$squareBmp = New-Object System.Drawing.Bitmap 512, 512
$g = [System.Drawing.Graphics]::FromImage($squareBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.Clear([System.Drawing.Color]::White)

$srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropSize, $cropSize
$destRect = New-Object System.Drawing.Rectangle 0, 0, 512, 512
$g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$squareBmp.Save((Resolve-Path ".").Path + "\img\logo-ambiental-emblema.png", [System.Drawing.Imaging.ImageFormat]::Png)
$squareBmp.Save((Resolve-Path ".").Path + "\img\logo-ambiental.png", [System.Drawing.Imaging.ImageFormat]::Png)
$squareBmp.Dispose()

# Also let's save full logo (with text) cleaned as well
$fullMinX = $w; $fullMaxX = 0; $fullMinY = $h; $fullMaxY = 0
for ($y = 0; $y -lt $h; $y += 2) {
    for ($x = 0; $x -lt $w; $x += 2) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            if ($x -lt $fullMinX) { $fullMinX = $x }
            if ($x -gt $fullMaxX) { $fullMaxX = $x }
            if ($y -lt $fullMinY) { $fullMinY = $y }
            if ($y -gt $fullMaxY) { $fullMaxY = $y }
        }
    }
}
Write-Host "Full content bounds: X=[$fullMinX..$fullMaxX], Y=[$fullMinY..$fullMaxY]"

$pad = 20
$fullCropX = [Math]::Max(0, $fullMinX - $pad)
$fullCropY = [Math]::Max(0, $fullMinY - $pad)
$fullCropW = [Math]::Min($w - $fullCropX, ($fullMaxX - $fullMinX) + 2 * $pad)
$fullCropH = [Math]::Min($h - $fullCropY, ($fullMaxY - $fullMinY) + 2 * $pad)

$fullBmp = New-Object System.Drawing.Bitmap $fullCropW, $fullCropH
$gFull = [System.Drawing.Graphics]::FromImage($fullBmp)
$gFull.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gFull.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gFull.Clear([System.Drawing.Color]::White)

$srcFullRect = New-Object System.Drawing.Rectangle $fullCropX, $fullCropY, $fullCropW, $fullCropH
$destFullRect = New-Object System.Drawing.Rectangle 0, 0, $fullCropW, $fullCropH
$gFull.DrawImage($bmp, $destFullRect, $srcFullRect, [System.Drawing.GraphicsUnit]::Pixel)
$gFull.Dispose()

$fullBmp.Save((Resolve-Path ".").Path + "\img\logo-ambiental-completo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fullBmp.Dispose()

$bmp.Dispose()
Remove-Item -Path "temp_check.ps1" -ErrorAction SilentlyContinue
Write-Host "Processed images saved successfully."
