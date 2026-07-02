import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { fileURLToPath } from "url";
import path from "path";
import { existsSync } from "fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// pino-http v10 TypeScript compatibility workaround
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const httpLogger = pinoHttp as unknown as (opts: any) => any;
app.use(
  httpLogger({
    logger,
    serializers: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      req: (req: any) => ({
        id: req.id,
        method: req.method,
        url: req.url?.split("?")[0],
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res: (res: any) => ({
        statusCode: res.statusCode,
      }),
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname_app = path.dirname(fileURLToPath(import.meta.url));
// Check multiple candidate locations so the path works regardless of how
// Vercel resolves import.meta.url (direct dist/ vs re-exported via api/)
const publicDirCandidates = [
  path.join(__dirname_app, "public"),                   // dist/public  (Replit / normal)
  path.join(__dirname_app, "..", "dist", "public"),     // api/../dist/public  (Vercel re-export)
];
const publicDir =
  publicDirCandidates.find((d) => existsSync(path.join(d, "index.html"))) ??
  publicDirCandidates[0];
const hasFrontend = existsSync(path.join(publicDir, "index.html"));

if (hasFrontend) {
  app.use(express.static(publicDir));
}

app.use("/api", router);

if (hasFrontend) {
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.json({ status: "ok", name: "ROC DZ API", version: "1.0.0" });
  });
}

export default app;
