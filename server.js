// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Erro no servidor:", err);
      res.statusCode = 500;
      res.end("Erro interno do servidor");
    }
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log(`🚀 Servidor a correr em http://localhost:${process.env.PORT || 3000}`);
  });
});
