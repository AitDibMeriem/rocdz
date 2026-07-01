import { fileURLToPath } from "url";
import { pathToFileURL } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let _handler;

async function getHandler() {
  if (!_handler) {
    const handlerPath = path.resolve(__dirname, "..", "dist", "handler.mjs");
    const mod = await import(pathToFileURL(handlerPath).href);
    _handler = mod.default;
  }
  return _handler;
}

export default async function handler(req, res) {
  const h = await getHandler();
  h(req, res);
}
