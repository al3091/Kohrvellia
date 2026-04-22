# Kohrvellia Sound Downloader
# Downloads all 53 sound effects and BGM from Epidemic Sound CDN
# Run this script from the sounds folder: right-click -> Run with PowerShell
# Or open PowerShell, cd to this folder, and run: .\download_all_sounds.ps1

$ErrorActionPreference = "Continue"
$baseUrl = "https://audiocdn.epidemicsound.com/lqmp3"
$baseDir = $PSScriptRoot

# All sounds: path|CDN_ID
$sounds = @(
    # SFX - Combat
    "sfx/combat/attack.mp3|01HYDYM7J9MKJYT6KSKXKADVTR",
    "sfx/combat/attack_critical.mp3|01KHM5W7S4FCBREY8N5466VY5J",
    "sfx/combat/hit.mp3|01KJYY579H2GGZYNYK8MW2KM7D",
    "sfx/combat/hit_heavy.mp3|01KHY0N48YTQZKYGZG9VKEPBP9",
    "sfx/combat/miss.mp3|01KJD7R5VP9YRKQZP5257YSAZP",
    "sfx/combat/defend.mp3|01KJFWCYQSD50E81SNCGMTJN4T",
    "sfx/combat/heal.mp3|01KJQ08RF0Y8EDER2W6DYWSQSE",
    "sfx/combat/buff.mp3|01KJZ56R7W8PVHGZXS096WJS02",
    "sfx/combat/debuff.mp3|01KJQ08RHH0DS7M72FGD1MY7FJ",
    # SFX - Rewards
    "sfx/rewards/victory.mp3|01KJAGAR3YH69EXYSQSFQD16DP",
    "sfx/rewards/defeat.mp3|01KJWCJBQ160A10GYVPZ6DD1QY",
    "sfx/rewards/level_up.mp3|01KHPC7GSTTPF8V5JHSAK2FM46",
    "sfx/rewards/achievement.mp3|01KJ2VHCM19ZBHWPM4SGJK0A3A",
    "sfx/rewards/item_pickup.mp3|01KJ2CKN6MSP5PZCEDVED7K4WW",
    "sfx/rewards/item_equip.mp3|01KJ6ZB76Q80R467CRZVWX4XP2",
    "sfx/rewards/gold_pickup.mp3|01KK1JVJ0KPV5KG8WB6EFZFEB3",
    # SFX - UI
    "sfx/ui/button_click.mp3|01KJD3XNB5STHJ47RBWQYHADAZ",
    "sfx/ui/button_confirm.mp3|01KJD74G2GATGSY35HY1FKSHT2",
    "sfx/ui/button_cancel.mp3|01HYAG30N4G0FB047K7GKVS04P",
    "sfx/ui/error.mp3|01KJFS1W7K7A09AECHKDA7MPB9",
    # SFX - Exploration
    "sfx/exploration/door_open.mp3|01KHKT7P7DCYCNN1P650180GNM",
    "sfx/exploration/step.mp3|01KHTJMVYQD120X92NM9GGXYSD",
    "sfx/exploration/shrine_chime.mp3|01KJCZ6AQBXDMEVFTA8QRY1447",
    "sfx/exploration/treasure_open.mp3|01KJQ08RKGX2VBZWDC69GZ1RQH",
    "sfx/exploration/treasure_creak.mp3|01KJQGNBWNQWZ0MQGKVZCKCZW1",
    "sfx/exploration/mimic_growl.mp3|01KHKH8368SFWC5JN4G14TXPKC",
    # SFX - Blessing
    "sfx/blessing/blessing_start.mp3|01KJ36XT81RE6REHBTNGDJ5JX4",
    "sfx/blessing/blessing_loop.mp3|01KJZ6G84VMR4BNWZ3A8DVQ92P",
    "sfx/blessing/blessing_complete.mp3|01KJFX0TYS08FDJJH1MPQJZK4N",
    "sfx/blessing/stat_reveal.mp3|01J8FFWZJSQHG99VDH2B63ZJ58",
    "sfx/blessing/grade_up.mp3|01KJAMF1FNRDFDCT2KZD7WT9RN",
    # SFX - Ambient
    "sfx/ambient/dungeon_drip.mp3|01KJCTTEKCP25EA2Q45T1MFRVC",
    "sfx/ambient/wind.mp3|01KJCZTBT7234QFSWKWEGNB0TJ",
    "sfx/ambient/fire_crackle.mp3|01KJPYT64BYR6WVPFJV1DWX1AA",
    "sfx/ambient/cave_echo.mp3|01KJARJGCRKESPNRTV40CK6TVX",
    "sfx/ambient/forest_ambient.mp3|01KJCSQSK80P4ANJHADBBPQZKC",
    # BGM - Core
    "bgm/title.mp3|01KJWHEKK70XXKG4FGX9KEVPM5",
    "bgm/dungeon.mp3|01KK45BQ5M04DR73V7W66XNJPA",
    "bgm/combat.mp3|01KJR1HV9C3PE1AX75Z1RAKC2K",
    "bgm/boss.mp3|01KK285983WNEDPMWE20DX7V42",
    "bgm/victory.mp3|01KK41CC3H07QD04Y0CPJ8XPDE",
    "bgm/defeat.mp3|01KJQ36JJRRGEZ0FAMMPT0X1VV",
    "bgm/shop.mp3|01KK8S27BYV2QNX8RPN5SYZ4QF",
    "bgm/rest.mp3|01KJZH9AYQ9M4V288W5VZDGHAF",
    # BGM - Blessing Themes
    "bgm/blessing_generic.mp3|01KK0A65EYH08N2DGNRVQ0Q6PY",
    "bgm/blessing_war.mp3|01KJQBFQC6KHCDKVMEJT58TJ7P",
    "bgm/blessing_magic.mp3|01KK4KG5TQAMTFAH46VBMFA4GG",
    "bgm/blessing_death.mp3|01KK367N4RSA23XA9E9S3GW8AH",
    "bgm/blessing_fortune.mp3|01KJS3Y2BG5PWV4Q3TBHCPQGEA",
    "bgm/blessing_nature.mp3|01KJJHQDCP90KGHMNEPZ5ES5NY",
    "bgm/blessing_wisdom.mp3|01KJXVVYQB931D4A17FYKZVX6G",
    "bgm/blessing_life.mp3|01KK48HTH2H7D1FP1H9FR87M4E",
    "bgm/blessing_fire.mp3|01KJVRQQZMZ4ENAMX1TCJACBKB"
)

$total = $sounds.Count
$success = 0
$failed = @()

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Kohrvellia Sound Downloader" -ForegroundColor Cyan
Write-Host " Downloading $total sounds from Epidemic Sound CDN" -ForegroundColor Cyan
Write-Host " Destination: $baseDir" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

for ($i = 0; $i -lt $sounds.Count; $i++) {
    $parts = $sounds[$i].Split('|')
    $filePath = $parts[0]
    $cdnId = $parts[1]
    $url = "$baseUrl/$cdnId.mp3"
    $destPath = Join-Path $baseDir $filePath.Replace('/', '\')

    # Create directory if needed
    $dir = Split-Path $destPath -Parent
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    # Skip if already exists and has content
    if ((Test-Path $destPath) -and (Get-Item $destPath).Length -gt 0) {
        Write-Host "[$($i+1)/$total] SKIP $filePath (already exists)" -ForegroundColor DarkGray
        $success++
        continue
    }

    Write-Host "[$($i+1)/$total] Downloading $filePath..." -ForegroundColor White -NoNewline

    try {
        Invoke-WebRequest -Uri $url -OutFile $destPath -UseBasicParsing
        $size = (Get-Item $destPath).Length
        Write-Host " OK ($([math]::Round($size/1024, 1)) KB)" -ForegroundColor Green
        $success++
    } catch {
        Write-Host " FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $failed += $filePath
    }

    # Small delay
    Start-Sleep -Milliseconds 200
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Done! $success/$total files downloaded." -ForegroundColor $(if ($success -eq $total) { "Green" } else { "Yellow" })

if ($failed.Count -gt 0) {
    Write-Host ""
    Write-Host " $($failed.Count) failures:" -ForegroundColor Red
    foreach ($f in $failed) {
        Write-Host "   - $f" -ForegroundColor Red
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
