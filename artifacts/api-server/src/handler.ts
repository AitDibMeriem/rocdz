import { connectMongo } from "./lib/mongodb";
import app from "./app";
import type { IncomingMessage, ServerResponse } from "http";

let mongoError: unknown = null;

// Start connecting immediately.
// .catch() prevents unhandledRejection crash; error is stored and returned as 503.
const mongoReady = connectMongo().catch((err) => {
  mongoError = err;
});

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  await mongoReady; // always resolves (error stored in mongoError)
  if (mongoError) {
    (res as any).statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Database unavailable", details: String(mongoError) }));
    return;
  }
  return app(req, res);
}
