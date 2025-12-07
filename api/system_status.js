export default async function handler(req,res){
    const Begin = Date.now();

   async function measure(path, options = {}) {
    const base =
      req.headers.host && req.headers.host.startsWith("localhost")
        ? `http://${req.headers.host}`
        : `https://${req.headers.host}`;

    const url = `${base}${path}`;

    const t0 = performance.now();
    try {
      const response = await fetch(url, options);
      const latency = Math.round(performance.now() - t0);
      const ok = response.ok;
      let json = null;
      try {
        json = await response.json();
      } catch {

      }
      return { ok, latency, json, error: null, url };
    } catch (err) {
      return {
        ok: false,
        latency: null,
        json: null,
        error: err.message || "Unknown error",
        url,
      };
    }
  }


    const [backendHealth, pingCheck, errorPipeline] = await Promise.all([
    measure("/api/health"),
    measure("/api/ping"),
    measure("/api/client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "system-status-health-check",
        timestamp: new Date().toISOString(),
        payload: { source: "system-status" },
      }),
    }),
  ]);
    const statusSummary = {
    generatedAt: new Date().toISOString(),
    totalLatencyMs: Date.now() - Begin,

    checks: {
      backend: backendHealth,
      ping: pingCheck,
      clientErrorPipeline: errorPipeline,
    },

    buildInfo: {
      vercelEnv: process.env.VERCEL_ENV || "local",
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA || null,
      commitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || null,
      branch: process.env.VERCEL_GIT_COMMIT_REF || null,
    },
  };

  return res.status(200).json(statusSummary);
}