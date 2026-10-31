# Tizen 3 Stremio startup probe

Temporary TizenBrew module to check whether the legacy Stremio Tizen server can start inside a TV's Node service. This is a startup diagnostic, not a streaming application.

The module downloads the official v4.20.1 Tizen bundle from `dl.strem.io` and checks its SHA-256 before execution. It does not redistribute that bundle. The download explicitly trusts the public ISRG Root X1 and X2 certificates from [Let's Encrypt](https://letsencrypt.org/certificates/), while retaining TLS certificate and hostname validation.

The diagnostic binds only to TV loopback. It requests `/stats.json`, then closes the test server. The startup deadline is 60 seconds; the result endpoint closes after 90 seconds. Child processes, hardware profiling, HTTPS certificate setup and casting are excluded. No torrent or media request is made. A small diagnostic log is written to a new temporary directory.

## Installation

Add this GitHub module in TizenBrew:

```text
gh/SenSecurity/tizen3-stremio-probe@main
```

Open "Stremio startup test". Do not enable service autostart. To repeat after completion, restart TizenBrew's service or reboot the TV.

## Verification limits

The generated module was exercised with the official Windows Node 4.4.3 executable. It downloaded and hash-checked the bundle, started a loopback HTTP server, received HTTP 200 from `/stats.json`, and requested shutdown. This is not evidence of TV compatibility or playback.

TV startup, torrent networking, codecs, media playback and sustained resource use remain unverified.

## Privacy

This repository contains only generic diagnostic code. It contains no TV addresses, account credentials, addon settings or device logs. Runtime diagnostics remain on the TV. The TV contacts the distribution CDN and official Stremio download host, which receive the usual network request information.

The `private` package.json flag prevents accidental npm publication. It does not make this GitHub repository private.

TizenBrew Old loads module files through the public jsDelivr CDN. Making the repository private later prevents normal fresh loads, and does not guarantee removal of previously cached files.

References: [TizenBrew modules](https://github.com/reisxd/TizenBrew/blob/main/docs/MODULES.md), [Stremio Tizen bundle](https://dl.strem.io/server/v4.20.1/tizen/server.js), [jsDelivr](https://github.com/jsdelivr/jsdelivr).

## Optional torrent range diagnostic

`service-media.js` is a separate diagnostic for a 64 KiB HTTP range from the public [Sintel test torrent](https://webtorrent.io/torrents/sintel.torrent). Sintel is by the Blender Foundation and licensed under [CC BY 3.0](https://durian.blender.org/about/). This diagnostic embeds public torrent metadata, uses up to six peer connections and a 16 MiB circular buffer, and requests engine shutdown after completion or a 90 second deadline. P2P operation can upload pieces while active. It is not started by the default module entry. No user addon or account data is included.
