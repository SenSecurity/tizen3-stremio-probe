(function () {
    "use strict";
    var http = require("http");
    var https = require("https");
    var crypto = require("crypto");
    var rows = [];
    var request;
    var finishedDownload = false;
    function record(event, value) {
        if (rows.length < 80) rows.push({time: new Date().toISOString(), event: event, value: value});
    }
    var diagnostics = http.createServer(function (req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Content-Type", "application/json");
        if (req.method !== "GET" || req.url !== "/status") {
            res.writeHead(404);
            return res.end("{}");
        }
        res.end(JSON.stringify(rows));
    });
    diagnostics.on("error", function (error) { record("diagnostics-error", error.message); });
    diagnostics.listen(18471, "127.0.0.1");
    var lifetime = setTimeout(function () {
        if (request) request.abort();
        diagnostics.close();
    }, 90000);
    lifetime.unref();
    record("downloading", "Official Stremio Tizen bundle, v4.20.1");
    var downloadDeadline = setTimeout(function () {
        if (!finishedDownload) {
            record("download-error", "25 second deadline");
            if (request) request.abort();
        }
    }, 25000);
    request = https.get({hostname: "dl.strem.io", path: "/server/v4.20.1/tizen/server.js", ca: ["-----BEGIN CERTIFICATE-----\nMIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw\nTzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh\ncmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4\nWhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu\nZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY\nMTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc\nh77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+\n0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U\nA5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW\nT8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH\nB5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC\nB5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv\nKBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn\nOlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn\njh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw\nqHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI\nrU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV\nHRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq\nhkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL\nubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ\n3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK\nNFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5\nORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur\nTkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC\njNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc\noyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq\n4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA\nmRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d\nemyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=\n-----END CERTIFICATE-----\n", "-----BEGIN CERTIFICATE-----\nMIICGzCCAaGgAwIBAgIQQdKd0XLq7qeAwSxs6S+HUjAKBggqhkjOPQQDAzBPMQsw\nCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJuZXQgU2VjdXJpdHkgUmVzZWFyY2gg\nR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBYMjAeFw0yMDA5MDQwMDAwMDBaFw00\nMDA5MTcxNjAwMDBaME8xCzAJBgNVBAYTAlVTMSkwJwYDVQQKEyBJbnRlcm5ldCBT\nZWN1cml0eSBSZXNlYXJjaCBHcm91cDEVMBMGA1UEAxMMSVNSRyBSb290IFgyMHYw\nEAYHKoZIzj0CAQYFK4EEACIDYgAEzZvVn4CDCuwJSvMWSj5cz3es3mcFDR0HttwW\n+1qLFNvicWDEukWVEYmO6gbf9yoWHKS5xcUy4APgHoIYOIvXRdgKam7mAHf7AlF9\nItgKbppbd9/w+kHsOdx1ymgHDB/qo0IwQDAOBgNVHQ8BAf8EBAMCAQYwDwYDVR0T\nAQH/BAUwAwEB/zAdBgNVHQ4EFgQUfEKWrt5LSDv6kviejM9ti6lyN5UwCgYIKoZI\nzj0EAwMDaAAwZQIwe3lORlCEwkSHRhtFcP9Ymd70/aTSVaYgLXTWNLxBo1BfASdW\ntL4ndQavEi51mI38AjEAi/V3bNTIZargCyzuFJ0nN6T5U6VR5CmD1/iQMVtCnwr1\n/q4AaOeMSQ+2b1tbFfLn\n-----END CERTIFICATE-----\n"]}, function (response) {
        if (response.statusCode !== 200) {
            response.resume();
            clearTimeout(downloadDeadline);
            record("download-error", "HTTP " + response.statusCode);
            return;
        }
        var chunks = [];
        var size = 0;
        response.on("data", function (chunk) {
            size += chunk.length;
            if (size > 4500000) {
                request.abort();
                return record("download-error", "Bundle exceeds size limit");
            }
            chunks.push(chunk);
        });
        response.on("error", function (error) { record("download-error", error.message); });
        response.on("end", function () {
            clearTimeout(downloadDeadline);
            finishedDownload = true;
            var data = Buffer.concat(chunks);
            if (crypto.createHash("sha256").update(data).digest("hex") !== "3330aace3f69425d6c6abc99cc4345bbb51acfdf12b621f2fa9e9a4fa43cdeab") {
                return record("download-error", "SHA-256 mismatch");
            }
            var source = data.toString("utf8");
            var changes = [["server.listen(port)", "server.listen(port,\"127.0.0.1\")", 3], ["hwAccelProfiler(server.address().port)", "console.log(\"Probe skips hardware profiling\")", 1], ["https.setOptions({appPath:appPath,apiEndpoint:apiCertifficateEndpoint});var sserver=https.createServer(app);if(sserver.listen(12470),sserver.on(\"listening\",(function(){console.log(\"EngineFS HTTPS endpoint at https://local.strem.io:12470\")})),sserver.on(\"error\",(function(err){console.warn(err)})),argv.open||process.env.OPEN)", "0;if(false)", 1]];
            try {
                changes.forEach(function (change) {
                    var parts = source.split(change[0]);
                    if (parts.length - 1 !== change[2]) throw new Error("Unexpected upstream source");
                    source = parts.join(change[1]);
                });
                (function (nativeRequire) {
    "use strict";
    var fs = nativeRequire("fs");
    var os = nativeRequire("os");
    var path = nativeRequire("path");
    var vm = nativeRequire("vm");
    var http = nativeRequire("http");
    var probeDir = path.join(os.tmpdir(), "stremio-startup-probe-" + Date.now());
    fs.mkdirSync(probeDir);
    var logFile = path.join(probeDir, "result.jsonl");
    var servers = [];
    var timers = [];
    var stopped = false;
    function note(event, value) {
        var row = JSON.stringify({time: new Date().toISOString(), event: event, value: value});
        record(event, value);
        fs.appendFileSync(logFile, row + "\n");
    }
    function stop(reason) {
        if (stopped) return;
        stopped = true;
        timers.forEach(function (timer) { clearTimeout(timer); clearInterval(timer); });
        servers.forEach(function (server) { server.close(); });
        note("stopped", {reason: reason, memory: process.memoryUsage()});
    }
    var processView = Object.create(process);
    processView.env = Object.assign({}, process.env, {
        APP_PATH: probeDir,
        HLS_V2_DISABLED: "1",
        CASTING_DISABLED: "1",
        DISABLE_CACHING: "1",
        YTDL_NO_UPDATE: "1",
        OPEN: ""
    });
    processView.argv = ["node", "stremio-startup-probe.js"];
    processView.exit = function (code) { stop("bundle requested exit " + code); };
    var httpView = Object.create(http);
    httpView.globalAgent = new http.Agent();
    httpView.createServer = function (handler) {
        var server = http.createServer(function (req, res) {
            if (req.method !== "GET" || req.url !== "/stats.json") {
                res.writeHead(403);
                return res.end("Startup probe only");
            }
            handler(req, res);
        });
        servers.push(server);
        server.once("listening", function () {
            note("listening", server.address());
            var request = http.get({host: "127.0.0.1", port: server.address().port, path: "/stats.json"}, function (response) {
                var body = "";
                response.on("data", function (chunk) { body += chunk.toString(); });
                response.on("end", function () {
                    note("status", {code: response.statusCode, body: body.slice(0, 2048)});
                    stop("status request complete");
                });
            });
            request.setTimeout(5000, function () { request.abort(); stop("status timeout"); });
            request.on("error", function (error) { note("request-error", error.message); stop("request failed"); });
        });
        return server;
    };
    var blockedChildProcess = {};
    ["exec", "execFile", "execSync", "execFileSync", "spawn", "spawnSync", "fork"].forEach(function (key) {
        blockedChildProcess[key] = function () { throw new Error("Probe excludes child processes"); };
    });
    var sandbox = {
        Buffer: Buffer,
        console: console,
        process: processView,
        module: {exports: {}},
        exports: {},
        require: function (name) {
            if (name === "http") return httpView;
            if (name === "child_process") return blockedChildProcess;
            return nativeRequire(name);
        },
        setTimeout: function (callback, delay) { var t = setTimeout(callback, delay); timers.push(t); return t; },
        clearTimeout: clearTimeout,
        setInterval: function (callback, delay) { var t = setInterval(callback, delay); timers.push(t); return t; },
        clearInterval: clearInterval,
        setImmediate: setImmediate,
        clearImmediate: clearImmediate
    };
    sandbox.global = sandbox;
    note("runtime", {node: process.version, platform: process.platform, arch: process.arch, memory: process.memoryUsage(), directory: probeDir});
    setTimeout(function () { stop("60 second deadline"); }, 60000).unref();
    try {
        vm.runInNewContext(source, sandbox, {filename: "stremio-tizen-startup.js", timeout: 10000});
        note("bundle-loaded", true);
    } catch (error) {
        note("startup-error", String(error.stack || error));
        stop("startup failed");
    }
})(require);

            } catch (error) {
                record("probe-error", String(error.stack || error));
            }
        });
    });
    request.on("error", function (error) {
        clearTimeout(downloadDeadline);
        record("download-error", error.message);
    });
})();
