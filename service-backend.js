(function () {
    "use strict";
    var http = require("http");
    var https = require("https");
    var net = require("net");
    var dgram = require("dgram");
    var fs = require("fs");
    var os = require("os");
    var path = require("path");
    var url = require("url");
    var crypto = require("crypto");
    var vm = require("vm");
    var domain = require("domain");
    var VERSION = "4.20.1";
    var SHA256 = "3330aace3f69425d6c6abc99cc4345bbb51acfdf12b621f2fa9e9a4fa43cdeab";
    var TRUSTED_CA = ["-----BEGIN CERTIFICATE-----\nMIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw\nTzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh\ncmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4\nWhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu\nZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY\nMTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc\nh77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+\n0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U\nA5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW\nT8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH\nB5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC\nB5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv\nKBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn\nOlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn\njh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw\nqHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI\nrU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV\nHRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq\nhkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL\nubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ\n3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK\nNFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5\nORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur\nTkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC\njNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc\noyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq\n4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA\nmRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d\nemyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=\n-----END CERTIFICATE-----\n", "-----BEGIN CERTIFICATE-----\nMIICGzCCAaGgAwIBAgIQQdKd0XLq7qeAwSxs6S+HUjAKBggqhkjOPQQDAzBPMQsw\nCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJuZXQgU2VjdXJpdHkgUmVzZWFyY2gg\nR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBYMjAeFw0yMDA5MDQwMDAwMDBaFw00\nMDA5MTcxNjAwMDBaME8xCzAJBgNVBAYTAlVTMSkwJwYDVQQKEyBJbnRlcm5ldCBT\nZWN1cml0eSBSZXNlYXJjaCBHcm91cDEVMBMGA1UEAxMMSVNSRyBSb290IFgyMHYw\nEAYHKoZIzj0CAQYFK4EEACIDYgAEzZvVn4CDCuwJSvMWSj5cz3es3mcFDR0HttwW\n+1qLFNvicWDEukWVEYmO6gbf9yoWHKS5xcUy4APgHoIYOIvXRdgKam7mAHf7AlF9\nItgKbppbd9/w+kHsOdx1ymgHDB/qo0IwQDAOBgNVHQ8BAf8EBAMCAQYwDwYDVR0T\nAQH/BAUwAwEB/zAdBgNVHQ4EFgQUfEKWrt5LSDv6kviejM9ti6lyN5UwCgYIKoZI\nzj0EAwMDaAAwZQIwe3lORlCEwkSHRhtFcP9Ymd70/aTSVaYgLXTWNLxBo1BfASdW\ntL4ndQavEi51mI38AjEAi/V3bNTIZargCyzuFJ0nN6T5U6VR5CmD1/iQMVtCnwr1\n/q4AaOeMSQ+2b1tbFfLn\n-----END CERTIFICATE-----\n"];
    var LIMITS = {connections: 16, memoryCacheMiB: 48, idleSeconds: 60};
    var runtime = null;
    var generation = 0;
    var state = "stopped";
    var lastError = null;
    var ERROR_MESSAGES = {
        DOWNLOAD_FAILED: "Could not download the verified server bundle.",
        HASH_MISMATCH: "The downloaded server bundle failed verification.",
        SOURCE_CHANGED: "The server bundle does not match the supported source.",
        STORAGE_UNAVAILABLE: "The app could not create its temporary directory.",
        PORT_IN_USE: "The local streaming port is already in use.",
        RUNTIME_FAILED: "The streaming runtime stopped after an error.",
        DIAGNOSTICS_UNAVAILABLE: "The local controller port is already in use."
    };
    var PATCHES = [
        ["server.listen(port)", "server.listen(port,\"127.0.0.1\")", 3],
        ["hwAccelProfiler(server.address().port)", "void 0", 1],
        ["https.setOptions({appPath:appPath,apiEndpoint:apiCertifficateEndpoint});var sserver=https.createServer(app);if(sserver.listen(12470),sserver.on(\"listening\",(function(){console.log(\"EngineFS HTTPS endpoint at https://local.strem.io:12470\")})),sserver.on(\"error\",(function(err){console.warn(err)})),argv.open||process.env.OPEN)", "0;if(false)", 1],
        ["enginefs.engine=__webpack_require__(969)", "enginefs.engine=__webpack_require__(969),global.__backendEngine=enginefs", 1]
    ];

    function current(run) { return runtime === run && !run.stopping; }
    function send(res, code, body) {
        res.writeHead(code, {"Content-Type": "application/json", "Cache-Control": "no-store"});
        res.end(JSON.stringify(body));
    }
    function status() {
        return {state: state, version: VERSION, error: lastError, limits: LIMITS,
            activeTorrents: runtime && runtime.engine ? runtime.engine.list().length : 0};
    }
    function stop(nextState, code) {
        var run = runtime;
        generation += 1;
        runtime = null;
        state = nextState || "stopped";
        lastError = code ? {code: code, message: ERROR_MESSAGES[code] || ERROR_MESSAGES.RUNTIME_FAILED} : null;
        if (!run) return;
        run.stopping = true;
        if (run.download) run.download.abort();
        clearTimeout(run.downloadDeadline);
        clearTimeout(run.readyDeadline);
        clearInterval(run.idleTimer);
        if (run.engine) run.engine.list().forEach(function (hash) {
            try { run.engine.remove(hash); } catch (error) {}
        });
        run.requests.forEach(function (request) { try { request.abort(); } catch (error) {} });
        run.sockets.forEach(function (socket) { try { socket.destroy(); } catch (error) {} });
        run.udp.forEach(function (socket) { try { socket.close(); } catch (error) {} });
        run.servers.forEach(function (server) { try { server.close(); } catch (error) {} });
        run.timers.forEach(function (kind, timer) { clearTimeout(timer); clearInterval(timer); });
        run.timers.clear();
        if (run.httpAgent) run.httpAgent.destroy();
        if (run.httpsAgent) run.httpsAgent.destroy();
        run.engine = null;
        run.sandbox = null;
    }
    function fail(run, code) { if (current(run)) stop("error", code); }
    function protect(run, callback) {
        return function () {
            try { return callback.apply(this, arguments); }
            catch (error) { fail(run, "RUNTIME_FAILED"); }
        };
    }
    function trackSocket(run, socket) {
        run.sockets.add(socket);
        socket.once("close", function () { run.sockets.delete(socket); });
        return socket;
    }
    function trackRequest(run, request) {
        run.requests.add(request);
        request.once("close", function () { run.requests.delete(request); });
        request.once("response", function (response) {
            response.once("end", function () { run.requests.delete(request); });
            response.once("close", function () { run.requests.delete(request); });
        });
        return request;
    }
    function timer(run, repeat, callback, delay, args) {
        var handle = (repeat ? setInterval : setTimeout)(function () {
            if (!repeat) run.timers.delete(handle);
            if (current(run)) protect(run, callback).apply(null, args);
        }, delay);
        run.timers.set(handle, repeat);
        return handle;
    }
    function removeTimer(run, handle) {
        run.timers.delete(handle);
        clearTimeout(handle);
        clearInterval(handle);
    }
    function retire(run, hash) {
        if (!run.engine || run.hash === hash) return;
        run.streams.slice().forEach(function (stream) {
            if (stream.hash !== hash) stream.res.destroy();
        });
        run.engine.list().forEach(function (existing) {
            if (existing !== hash) run.engine.remove(existing);
        });
        run.hash = hash;
    }
    function attachHTTP(run, handler) {
        var server = http.createServer(function (req, res) {
            if (!current(run)) return send(res, 503, {error: "Server stopped"});
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Range, Content-Type");
            res.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges");
            if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
            if ((req.method !== "GET" && req.method !== "HEAD") || req.url.length > 8192) return send(res, 403, {error: "Unsupported request"});
            var pathname = url.parse(req.url).pathname;
            if (pathname === "/settings") return send(res, 200, {options: [], values: {
                serverVersion: VERSION, cacheSize: 0, btMaxConnections: LIMITS.connections,
                localAddonEnabled: false, remoteHttps: "", transcodeHardwareAccel: false
            }});
            var media = /^\/([a-f0-9]{40})\/(-1|[0-9]{1,6})$/i.exec(pathname);
            var stats = pathname === "/stats.json" || /^\/[a-f0-9]{40}(?:\/(?:-1|[0-9]{1,6}))?\/stats\.json$/i.test(pathname);
            if (!media && !stats) return send(res, 403, {error: "Unsupported route"});
            if (media) {
                var hash = media[1].toLowerCase();
                retire(run, hash);
                var stream = {hash: hash, res: res};
                run.streams.push(stream);
                run.lastActivity = Date.now();
                var finished = function () {
                    var index = run.streams.indexOf(stream);
                    if (index >= 0) run.streams.splice(index, 1);
                    run.lastActivity = Date.now();
                };
                res.once("finish", finished);
                res.once("close", finished);
            }
            run.domain.run(function () {
                try {
                    handler(req, res, function () {
                        if (!res.headersSent) send(res, 500, {error: "Streaming request failed"});
                        else res.destroy();
                    });
                } catch (error) {
                    if (!res.headersSent) send(res, 500, {error: "Streaming request failed"});
                    else res.destroy();
                }
            });
        });
        run.servers.add(server);
        server.once("close", function () { run.servers.delete(server); });
        server.on("connection", function (socket) { trackSocket(run, socket); });
        server.on("error", function (error) { fail(run, error.code === "EADDRINUSE" ? "PORT_IN_USE" : "RUNTIME_FAILED"); });
        var listen = server.listen;
        server.listen = function (port) {
            if (!current(run)) return server;
            if (port !== 11470) { fail(run, "PORT_IN_USE"); return server; }
            return listen.call(server, 11470, "127.0.0.1");
        };
        server.once("listening", function () {
            if (current(run)) { clearTimeout(run.readyDeadline); state = "running"; }
        });
        return server;
    }
    function configureEngine(run) {
        var engine = run.sandbox.__backendEngine;
        if (!engine) throw new Error("Engine export unavailable");
        run.engine = engine;
        engine.loggingEnabled = false;
        var defaults = engine.getDefaults;
        engine.getDefaults = function (hash) {
            var options = defaults(hash);
            options.connections = LIMITS.connections;
            options.peerSearch.min = 4;
            options.peerSearch.max = 24;
            options.buffer = 8388608;
            options.circularBuffer = {type: "memory", size: LIMITS.memoryCacheMiB * 1048576};
            return options;
        };
        engine.on("engine-create", function (hash) { retire(run, hash); });
        engine.on("engine-destroyed", function (hash) { if (run.hash === hash) run.hash = null; });
        run.idleTimer = setInterval(protect(run, function () {
            if (!current(run) || run.streams.length || Date.now() - run.lastActivity < LIMITS.idleSeconds * 1000) return;
            engine.list().forEach(function (hash) { engine.remove(hash); });
        }), 5000);
    }
    function execute(run, data) {
        var source = data.toString("utf8");
        for (var index = 0; index < PATCHES.length; index += 1) {
            var patch = PATCHES[index], parts = source.split(patch[0]);
            if (parts.length - 1 !== patch[2]) return fail(run, "SOURCE_CHANGED");
            source = parts.join(patch[1]);
        }
        try {
            run.directory = path.join(os.tmpdir(), "stremio-tv-backend-" + Date.now() + "-" + run.id);
            fs.mkdirSync(run.directory);
        } catch (error) { return fail(run, "STORAGE_UNAVAILABLE"); }
        var processView = Object.create(process);
        processView.env = Object.assign({}, process.env, {APP_PATH: run.directory, HLS_V2_DISABLED: "1", CASTING_DISABLED: "1", DISABLE_CACHING: "1", YTDL_NO_UPDATE: "1", OPEN: ""});
        processView.argv = ["node", "stremio-tv-backend.js"];
        processView.exit = function () { fail(run, "RUNTIME_FAILED"); };
        var blockedChildProcess = {};
        ["exec", "execFile", "execSync", "execFileSync", "spawn", "spawnSync", "fork"].forEach(function (name) {
            blockedChildProcess[name] = function () { throw new Error("Transcoding is unavailable"); };
        });
        var httpView = Object.create(http), httpsView = Object.create(https), netView = Object.create(net), udpView = Object.create(dgram);
        run.httpAgent = new http.Agent();
        run.httpsAgent = new https.Agent();
        httpView.globalAgent = run.httpAgent;
        httpsView.globalAgent = run.httpsAgent;
        function outbound(nativeModule, agent, options, callback) {
            if (!current(run)) throw new Error("Server stopped");
            var config = typeof options === "string" ? url.parse(options) : Object.assign({}, options);
            if (config.agent === undefined) config.agent = agent;
            return trackRequest(run, nativeModule.request(config, callback));
        }
        httpView.createServer = function (handler) { return attachHTTP(run, handler); };
        httpView.request = function (options, callback) { return outbound(http, run.httpAgent, options, callback); };
        httpView.get = function (options, callback) { var request = httpView.request(options, callback); request.end(); return request; };
        httpsView.request = function (options, callback) { return outbound(https, run.httpsAgent, options, callback); };
        httpsView.get = function (options, callback) { var request = httpsView.request(options, callback); request.end(); return request; };
        netView.connect = netView.createConnection = function () { if (!current(run)) throw new Error("Server stopped"); return trackSocket(run, net.connect.apply(net, arguments)); };
        netView.Socket = function (options) { if (!current(run)) throw new Error("Server stopped"); return trackSocket(run, new net.Socket(options)); };
        netView.Socket.prototype = net.Socket.prototype;
        netView.createServer = function () { if (!current(run)) throw new Error("Server stopped"); var server = net.createServer.apply(net, arguments); run.servers.add(server); server.once("close", function () { run.servers.delete(server); }); server.on("connection", function (socket) { trackSocket(run, socket); }); return server; };
        udpView.createSocket = function () {
            if (!current(run)) throw new Error("Server stopped");
            var socket = dgram.createSocket.apply(dgram, arguments);
            run.udp.add(socket);
            socket.once("close", function () { run.udp.delete(socket); });
            return socket;
        };
        var quiet = function () {};
        run.sandbox = {Buffer: Buffer, Uint8Array: Object.getPrototypeOf(Buffer.prototype).constructor, ArrayBuffer: new Buffer(1).buffer.constructor,
            console: {log: quiet, warn: quiet, error: quiet, info: quiet, debug: quiet}, process: processView,
            module: {exports: {}}, exports: {},
            require: function (name) {
                if (name === "http") return httpView;
                if (name === "https") return httpsView;
                if (name === "net") return netView;
                if (name === "dgram") return udpView;
                if (name === "child_process") return blockedChildProcess;
                return require(name);
            },
            setTimeout: function (callback, delay) { return timer(run, false, callback, delay, Array.prototype.slice.call(arguments, 2)); },
            setInterval: function (callback, delay) { return timer(run, true, callback, delay, Array.prototype.slice.call(arguments, 2)); },
            clearTimeout: function (handle) { removeTimer(run, handle); },
            clearInterval: function (handle) { removeTimer(run, handle); },
            setImmediate: function (callback) { return timer(run, false, callback, 0, Array.prototype.slice.call(arguments, 1)); },
            clearImmediate: function (handle) { removeTimer(run, handle); }
        };
        run.sandbox.global = run.sandbox;
        run.readyDeadline = setTimeout(function () { fail(run, "RUNTIME_FAILED"); }, 15000);
        run.domain.run(function () {
            try { vm.runInNewContext(source, run.sandbox, {filename: "stremio-tv-server.js", timeout: 10000}); configureEngine(run); }
            catch (error) { fail(run, "RUNTIME_FAILED"); }
        });
    }
    function start() {
        if (state === "starting" || state === "running") return;
        var run = {id: ++generation, stopping: false, domain: domain.create(), engine: null, sandbox: null,
            servers: new Set(), sockets: new Set(), udp: new Set(), requests: new Set(), timers: new Map(), streams: [], hash: null, lastActivity: Date.now()};
        runtime = run;
        state = "starting";
        lastError = null;
        run.domain.on("error", function () { fail(run, "RUNTIME_FAILED"); });
        run.downloadDeadline = setTimeout(function () { fail(run, "DOWNLOAD_FAILED"); }, 25000);
        try {
            run.download = https.get({hostname: "dl.strem.io", path: "/server/v4.20.1/tizen/server.js", ca: TRUSTED_CA}, function (response) {
                if (!current(run)) { response.resume(); return; }
                if (response.statusCode !== 200) { response.resume(); return fail(run, "DOWNLOAD_FAILED"); }
                var chunks = [], length = 0;
                response.on("data", function (chunk) {
                    if (!current(run)) return;
                    length += chunk.length;
                    if (length > 4500000) return fail(run, "DOWNLOAD_FAILED");
                    chunks.push(chunk);
                });
                response.on("error", function () { fail(run, "DOWNLOAD_FAILED"); });
                response.on("end", function () {
                    if (!current(run)) return;
                    clearTimeout(run.downloadDeadline);
                    var data = Buffer.concat(chunks);
                    if (crypto.createHash("sha256").update(data).digest("hex") !== SHA256) return fail(run, "HASH_MISMATCH");
                    execute(run, data);
                });
            });
            run.download.on("error", function () { fail(run, "DOWNLOAD_FAILED"); });
        } catch (error) { fail(run, "DOWNLOAD_FAILED"); }
    }
    var diagnostics = http.createServer(function (req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Range");
        if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
        if (req.method === "GET" && req.url === "/status") return send(res, 200, status());
        if (req.method === "POST" && req.url === "/start") { start(); return send(res, 202, status()); }
        if (req.method === "POST" && req.url === "/stop") { stop(); return send(res, 200, status()); }
        send(res, 404, {error: "Unknown operation"});
    });
    diagnostics.on("error", function () { stop("error", "DIAGNOSTICS_UNAVAILABLE"); });
    diagnostics.listen(18480, "127.0.0.1", start);
})();
