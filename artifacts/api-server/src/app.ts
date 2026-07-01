import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
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

app.get("/", (_req, res) => {
  res.json({ status: "ok", name: "ROC DZ API", version: "1.0.0" });
});

app.use("/api", router);

export default app;
