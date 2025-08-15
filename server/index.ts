import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite"; // removed serveStatic
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Auto-fix deployment file structure (kept from your code)
async function fixDeploymentStructure() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distDir = path.resolve(__dirname, "..");
  const publicDir = path.resolve(distDir, "public");

  if (fs.existsSync(publicDir)) {
    log("🔧 Auto-fixing deployment file structure...");
    try {
      const files = fs.readdirSync(publicDir);
      for (const file of files) {
        const srcPath = path.join(publicDir, file);
        const destPath = path.join(distDir, file);
        if (fs.statSync(srcPath).isDirectory()) {
          fs.cpSync(srcPath, destPath, { recursive: true, force: true });
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
      log("✅ Deployment structure fixed automatically");
    } catch (error) {
      log(`❌ Error fixing deployment structure: ${(error as Error).message}`);
    }
  }
}

const app = express();

/* ---------- Security ---------- */
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:", "https:"],
        "script-src": ["'self'", "'unsafe-inline'", "https:"],
        "style-src": ["'self'", "'unsafe-inline'", "https:"],
        "connect-src": ["'self'", "https:"],
        "frame-ancestors": ["'none'"],
      },
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ---------- Health ---------- */
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    version: process.env.APP_VERSION || "2.1.0",
    timestamp: new Date().toISOString(),
  });
});

/* ---------- Static policy pages ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticPath = path.join(__dirname, "static");
app.use("/static", express.static(staticPath));

const prodStaticPath = path.join(process.cwd(), "dist", "static");
app.use("/static", express.static(prodStaticPath));

/* ---------- API timing log (only for /api) ---------- */
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  (res as any).json = (bodyJson: any) => {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        } catch {}
      }
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register routes and get the server instance you use to listen()
  const server = await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Dev vs Prod
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Prepare and serve the built client
    await fixDeploymentStructure();

    // Prefer dist/public (as per your Vite output); fall back to dist if needed
    const distPublic = path.resolve(process.cwd(), "dist", "public");
    const distFallback = path.resolve(process.cwd(), "dist");
    const distRoot = fs.existsSync(distPublic) ? distPublic : distFallback;

    log(`[static] using distRoot: ${distRoot}`);

    app.use(express.static(distRoot));

    // Sanity route to confirm which folder is served
    app.get("/__ping", (_req, res) => res.json({ ok: true, distRoot }));

    // SPA fallback: send index.html for non-API routes
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(distRoot, "index.html"));
    });
  }

  // Listen on Railway's assigned port on 0.0.0.0
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, () => { log(`serving on port ${port}`); });
})();
