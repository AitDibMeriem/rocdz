import { connectMongo } from "./lib/mongodb";
import app from "./app";
import type { IncomingMessage, ServerResponse } from "http";

// Initiate connection immediately — promise is reused across warm invocations
const mongoReady = connectMongo();

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    await mongoReady;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Database unavailable" }));
    return;
  }
  return app(req, res);
}
