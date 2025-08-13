import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Auto-fix deployment file structure
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

// Security headers with helmet
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "img-src": ["'self'", "data:", "https:"],
      "script-src": ["'self'", "'unsafe-inline'", "https:"],
      "style-src": ["'self'", "'unsafe-inline'", "https:"],
      "connect-src": ["'self'", "https:"],
      "frame-ancestors": ["'none'"]
    }
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  crossOriginEmbedderPolicy: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    version: process.env.APP_VERSION || "2.1.0",
    timestamp: new Date().toISOString()
  });
});

// Setup static file serving for privacy and terms pages
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static policy pages - handle both development and production paths
const staticPath = path.join(__dirname, "static");
app.use("/static", express.static(staticPath));

// Also serve from dist/static for production builds
const prodStaticPath = path.join(process.cwd(), "dist", "static");
app.use("/static", express.static(prodStaticPath));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Auto-fix deployment file structure before serving static files
    await fixDeploymentStructure();
    import path from "path";
import { fileURLToPath } from "url";
import express from "express";

// ...your existing imports and code...

// inside your IIFE after routes are registered:
if (app.get("env") === "development") {
  await setupVite(app, server);
} else {
  // Serve the built client from Vite: dist/public/*
  const distRoot = path.resolve(process.cwd(), "dist", "public");

  // Static assets (JS/CSS/images)
  app.use(express.static(distRoot));

  // SPA fallback: send index.html for any non-API route
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distRoot, "index.html"));
  });
}
}

  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
