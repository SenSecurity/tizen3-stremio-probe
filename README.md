# Stremio TV server for Tizen 3

TizenBrew module that runs the legacy Stremio torrent engine on the TV and opens an existing StremioK installation. No PC streaming server is required.

This is an experimental client setup, independent of the official Stremio Samsung app. Short TV-side startup, torrent-range and audiovisual tests passed on Tizen 3.0 with Node 4.4.3. Long playback and other TV models require separate verification.

## Set up StremioK

1. Install TizenBrew and add `npm/stremiok`.
2. Add `gh/SenSecurity/tizen3-stremio-probe@v0.1.0` as a GitHub module.
3. Open **Stremio na TV**. It starts the local server and opens your existing StremioK.
4. In StremioK, select **Settings > Content > Streaming server**.
5. Select **Stremio server** and enter `http://127.0.0.1:11470`.
6. Keep conversion disabled.
7. To open this setup automatically, select **Stremio na TV** in TizenBrew's Autolaunch Settings.

Keep TizenBrew's Developer Mode host set to `127.0.0.1` as its installation guide requires. Existing StremioK addons and account settings stay in the existing installation.

## Operation

The module downloads the official [v4.20.1 Tizen server bundle](https://dl.strem.io/server/v4.20.1/tizen/server.js) and verifies its SHA-256 before execution. HTTPS verification stays enabled, with public ISRG root certificates from [Let's Encrypt](https://letsencrypt.org/certificates/).

The server accepts local requests on `127.0.0.1:11470`. It handles one torrent at a time, with up to 16 connections and a 48 MiB memory cache. These limits are not a measurement of total TV or app RAM. Switching torrents retires the previous engine. After 60 seconds without an active streaming request, the module removes idle engines. The server stays available while the TizenBrew service is running.

Internet access is needed to load the module and server bundle. Keep the repository public for jsDelivr delivery. Making the repository private does not guarantee removal of existing CDN copies.

Software transcoding and local-file addons are disabled. Playback depends on formats supported by the TV. Active torrents can upload pieces to peers.

## Local controls

The launcher uses a loopback-only controller at `http://127.0.0.1:18480`:

- `GET /status` reports the lifecycle state, version, limits, and a sanitized error.
- `POST /start` starts a stopped server.
- `POST /stop` closes the streaming runtime and its torrent connections.

The controller is separate from StremioK's streaming server address.

## Privacy

This repository contains generic code, not TV identifiers, addon configuration, account credentials, or device logs. It does not read or modify the addon list or Samsung account. CDN and torrent requests still disclose the usual network information to those services and peers.

The package.json `private` flag prevents accidental npm publication. It does not make the GitHub repository private.

References: [TizenBrew modules](https://github.com/reisxd/TizenBrew/blob/main/docs/MODULES.md), [StremioK](https://github.com/Kepler75/StremioK), [jsDelivr](https://github.com/jsdelivr/jsdelivr).
