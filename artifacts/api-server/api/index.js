// CommonJS wrapper for Vercel — dynamically imports the pre-built ESM bundle
let _app;

async function getApp() {
  if (!_app) {
    const mod = await import("../dist/handler.mjs");
    _app = mod.default;
  }
  return _app;
}

module.exports = async (req, res) => {
  const handler = await getApp();
  handler(req, res);
};
