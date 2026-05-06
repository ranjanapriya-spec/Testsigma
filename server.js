const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const root = __dirname;
const dataDir = path.join(root, "data");
const notificationsPath = path.join(dataDir, "notifications.json");
const mailboxPath = path.join(dataDir, "mailbox.json");
const chatsPath = path.join(dataDir, "chats.json");
const quantestPath = path.join(dataDir, "quantest.json");

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function ensureDataFile(filePath) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readJsonFile(filePath) {
  ensureDataFile(filePath);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8") || "[]");
  } catch (error) {
    return [];
  }
}

function writeJsonFile(filePath, items) {
  ensureDataFile(filePath);
  fs.writeFileSync(filePath, JSON.stringify(Array.isArray(items) ? items : [], null, 2));
}

function readBody(req, callback) {
  let body = "";
  req.on("data", chunk => {
    body += chunk;
    if (body.length > 1e6) req.destroy();
  });
  req.on("end", () => callback(body));
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);

  if (urlPath === "/api/notifications") {
    if (req.method === "GET") {
      sendJson(res, 200, readJsonFile(notificationsPath));
      return;
    }
    if (req.method === "PUT") {
      readBody(req, body => {
        try {
          const notifications = JSON.parse(body || "[]");
          writeJsonFile(notificationsPath, notifications);
          sendJson(res, 200, { ok: true });
        } catch (error) {
          sendJson(res, 400, { ok: false, error: "Invalid JSON" });
        }
      });
      return;
    }
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }

  if (urlPath === "/api/mailbox") {
    if (req.method === "GET") {
      sendJson(res, 200, readJsonFile(mailboxPath));
      return;
    }
    if (req.method === "PUT") {
      readBody(req, body => {
        try {
          const messages = JSON.parse(body || "[]");
          writeJsonFile(mailboxPath, messages);
          sendJson(res, 200, { ok: true });
        } catch (error) {
          sendJson(res, 400, { ok: false, error: "Invalid JSON" });
        }
      });
      return;
    }
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }

  if (urlPath === "/api/chats") {
    if (req.method === "GET") {
      sendJson(res, 200, readJsonFile(chatsPath));
      return;
    }
    if (req.method === "PUT") {
      readBody(req, body => {
        try {
          const chats = JSON.parse(body || "[]");
          writeJsonFile(chatsPath, chats);
          sendJson(res, 200, { ok: true });
        } catch (error) {
          sendJson(res, 400, { ok: false, error: "Invalid JSON" });
        }
      });
      return;
    }
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }

  if (urlPath === "/api/quantest") {
    if (req.method === "GET") {
      sendJson(res, 200, readJsonFile(quantestPath));
      return;
    }
    if (req.method === "PUT") {
      readBody(req, body => {
        try {
          const items = JSON.parse(body || "[]");
          writeJsonFile(quantestPath, items);
          sendJson(res, 200, { ok: true });
        } catch (error) {
          sendJson(res, 400, { ok: false, error: "Invalid JSON" });
        }
      });
      return;
    }
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }

  const requested = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.join(root, requested);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "text/plain; charset=utf-8" });
    res.end(content);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`BDR project running at http://127.0.0.1:${PORT}`);
});
