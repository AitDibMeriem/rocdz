// Vercel serverless entry — loads the pre-built ESM bundle from dist/
const path = require("path");
const { pathToFileURL } = require("url");

let _handler;

async function getHandler() {
  if (!_handler) {
    const handlerPath = path.resolve(__dirname, "..", "dist", "handler.mjs");
    const mod = await import(pathToFileURL(handlerPath).href);
    _handler = mod.default;
  }
  return _handler;
}

module.exports = async (req, res) => {
  const handler = await getHandler();
  handler(req, res);
};
