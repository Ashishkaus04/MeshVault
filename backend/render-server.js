const fs = require("fs");
const http = require("http");
const path = require("path");
const WebSocket = require("ws");

const PORT = Number(process.env.PORT || 10000);
const HOST = "0.0.0.0";
const DIST_DIR = path.resolve(__dirname, "..", "frontend", "dist");

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js") return "application/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".ico") return "image/x-icon";
  if (ext === ".txt") return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

function safeJoin(base, requestedPath) {
  const resolvedPath = path.resolve(base, "." + requestedPath);
  if (!resolvedPath.startsWith(base)) {
    return null;
  }
  return resolvedPath;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url ? req.url.split("?")[0] : "/";

  if (urlPath === "/health") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (!fs.existsSync(DIST_DIR)) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Frontend build not found. Expected frontend/dist.");
    return;
  }

  let filePath = urlPath === "/" ? path.join(DIST_DIR, "index.html") : safeJoin(DIST_DIR, urlPath);

  if (!filePath) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Invalid path");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, "index.html");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Server error");
      return;
    }

    res.writeHead(200, {
      "Content-Type": getContentType(filePath),
      "Cache-Control": filePath.endsWith("index.html") ? "no-cache" : "public, max-age=31536000, immutable"
    });
    res.end(data);
  });
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  socket.on("message", (raw) => {
    let payload;
    try {
      payload = typeof raw === "string" ? raw : raw.toString();
    } catch (error) {
      console.error("Failed to process message payload:", error);
      return;
    }

    for (const client of wss.clients) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  });

  socket.on("error", (error) => {
    console.error("WebSocket client error:", error.message);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`MeshVault Render server listening on http://${HOST}:${PORT}`);
});
