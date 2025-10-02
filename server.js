// server.js
const { createServer } = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(PORT, HOST, (err) => {
    if (err) throw err;
    console.log(`✅ Next.js a correr em http://${HOST}:${PORT} (NODE_ENV=${process.env.NODE_ENV})`);
  });
});
