param([Parameter(Mandatory=$true)][string]$BaseUrl)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$output = Join-Path $root '_site'
$uri = $null
if (![Uri]::TryCreate($BaseUrl, [UriKind]::Absolute, [ref]$uri) -or $uri.Scheme -ne 'https' -or $uri.Query -or $uri.Fragment -or $uri.UserInfo) {
    throw 'BaseUrl doit etre une adresse HTTPS sans parametres ni fragment.'
}
$base = $uri.AbsoluteUri.TrimEnd('/') + '/'
if (Test-Path -LiteralPath $output) { throw '_site existe deja. Utiliser un dossier de sortie neuf.' }
$items = Get-ChildItem -LiteralPath $root -Force | Where-Object {
    $_.Name -notin @('_site','tmp','tools') -and
    (!$_.Name.StartsWith('.') -or $_.Name -eq '.nojekyll') -and
    $_.Extension -notin @('.md','.ps1')
}
$bytes = 0L
foreach ($item in $items) {
    if ($item.PSIsContainer) { $bytes += (Get-ChildItem -LiteralPath $item.FullName -Recurse -File | Measure-Object Length -Sum).Sum }
    else { $bytes += $item.Length }
}
if ($bytes -ge 1GB) { throw 'Le site depasse la limite de taille de GitHub Pages.' }
New-Item -ItemType Directory -Path $output | Out-Null
foreach ($item in $items) { Copy-Item -LiteralPath $item.FullName -Destination $output -Recurse }
$utf8 = [Text.UTF8Encoding]::new($false)
$urls = @()
foreach ($file in Get-ChildItem -LiteralPath $output -Filter '*.html' -File) {
    $html = [IO.File]::ReadAllText($file.FullName)
    $path = if ($file.Name -eq 'index.html') { '' } else { [Uri]::EscapeDataString($file.Name) }
    $url = $base + $path
    $escaped = [System.Net.WebUtility]::HtmlEncode($url)
    $html = [regex]::Replace($html, '<link\b[^>]*rel="canonical"[^>]*>|<meta\b[^>]*property="og:url"[^>]*>', '')
    $meta = '<link rel="canonical" href="' + $escaped + '">' + "`n" + '<meta property="og:url" content="' + $escaped + '">'
    if ($file.Name -eq 'recherche.html') { $meta += "`n" + '<meta name="robots" content="noindex,follow">' }
    else { $urls += $url }
    $html = $html.Replace('</head>', $meta + "`n</head>")
    if ($file.Name -eq 'index.html') {
        $match = [regex]::Match($html, '(?s)<script type="application/ld\+json" id="osd-identity">(.*?)</script>')
        if (!$match.Success) { throw 'Identite OSD absente de la page accueil.' }
        $identity = $match.Groups[1].Value | ConvertFrom-Json
        $identity | Add-Member -NotePropertyName url -NotePropertyValue $base -Force
        $identity | Add-Member -NotePropertyName logo -NotePropertyValue ($base + 'assets/250PXhauteur.jpg') -Force
        $json = ConvertTo-Json $identity -Depth 6 -Compress
        $html = $html.Replace($match.Value, '<script type="application/ld+json" id="osd-identity">' + $json + '</script>')
        $website = @{'@context'='https://schema.org'; '@type'='WebSite'; name=$identity.name; alternateName='OSD'; url=$base} | ConvertTo-Json -Compress
        $html = $html.Replace('</head>', '<script type="application/ld+json">' + $website + '</script>' + "`n</head>")
        $html = $html.Replace('content="./favImage.png"', 'content="' + $base + 'favImage.png"')
    }
    [IO.File]::WriteAllText($file.FullName, $html, $utf8)
}
$entries = $urls | Sort-Object | ForEach-Object { '<url><loc>' + [System.Security.SecurityElement]::Escape($_) + '</loc></url>' }
$xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ($entries -join '') + '</urlset>'
[IO.File]::WriteAllText((Join-Path $output 'sitemap.xml'), $xml, $utf8)
[IO.File]::WriteAllText((Join-Path $output 'robots.txt'), "User-agent: *`nAllow: /`nSitemap: ${base}sitemap.xml`n", $utf8)
Write-Output ('Site pret : {0}, {1} pages dans le sitemap, {2:N1} Mio.' -f $base, $urls.Count, ($bytes / 1MB))
