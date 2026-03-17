const SAMPLE_2XX = Number(process.env.LOG_SAMPLE_2XX ?? 0.1);
const SAMPLE_4XX = Number(process.env.LOG_SAMPLE_4XX ?? 0.3);
const SLOW_MS = Number(process.env.LOG_SLOW_MS ?? 1000);

function durationMs(req) {
    if (!req._startAtNs) return undefined;
    const ns = process.hrtime.bigint() - req._startAtNs;
    return Number(ns / 1000000n);
}

function isHealth(req) {
    const u = req.originalUrl || req.url || "";
    return u === "/health" || u === "/ready";
}

function isCritical(req) {
    const u = req.originalUrl || req.url || "";
    return u.startsWith("/auth") || u.startsWith("/payments") || u.startsWith("/admin");
}

function shouldLog({ req, statusCode, dMs }) {
    if (isHealth(req) && statusCode < 400) return false;

    if (statusCode >= 500) return true;
    if (typeof dMs === "number" && dMs >= SLOW_MS) return true;
    if (isCritical(req)) return true;
    if ([401, 403, 429].includes(statusCode)) return true;

    if (statusCode >= 400) return Math.random() < SAMPLE_4XX;
    return Math.random() < SAMPLE_2XX;
}

export function accessLogger() {
    return (req, res, next) => {
        res.on("finish", () => {
            const statusCode = res.statusCode || 0;
            const dMs = durationMs(req);

            if (!shouldLog({ req, statusCode, dMs })) return;

            const entry = {
                type: "access",
                requestId: req.requestId,
                method: req.method,
                path: req.originalUrl || req.url,
                statusCode,
                durationMs: dMs,
                ip: req.ip,
                userAgent: typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : undefined,
            };

            if (req.user?.id) entry.userId = req.user.id;
            if (req.authLogMeta) entry.auth = req.authLogMeta; // safe metadata only

            if (statusCode >= 500) req.log.error(entry, "HTTP request failed");
            else if (statusCode >= 400) req.log.warn(entry, "HTTP request rejected");
            else req.log.info(entry, "HTTP request completed");
        });

        next();
    };
}