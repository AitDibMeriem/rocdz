import { connectMongo } from "./lib/mongodb";
import app from "./app";
import type { IncomingMessage, ServerResponse } from "http";

// Start connecting immediately — result is cached for warm invocations
const mongoReady = connectMongo().catch(console.error);

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  // Ensure MongoDB is connected before handling any request
  await mongoReady;
  return app(req, res);
}
