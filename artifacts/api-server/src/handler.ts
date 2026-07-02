import { connectMongo } from "./lib/mongodb";
import app from "./app";
import type { IncomingMessage, ServerResponse } from "http";

// Start connecting immediately — result is cached for warm invocations
const mongoReady = connectMongo();

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    await mongoReady;
  } catch (err) {
    (res as any).statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Database unavailable", details: String(err) }));
    return;
  }
  return app(req, res);
}
