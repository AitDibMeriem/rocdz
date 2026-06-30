import { connectMongo } from "./lib/mongodb";
import app from "./app";

connectMongo().catch(console.error);

export default app;
