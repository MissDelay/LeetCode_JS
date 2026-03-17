const http = require("http");
const fs = require("fs");
const path = require("path");
const { bloggers, dailyTopics } = require("./src/data");
const { analyzeTopicIdea } = require("./src/insights");

const port = process.env.PORT || 3000;

function sendJson(res, code, payload) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) reject(new Error("Payload too large"));
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function serveStatic(req, res) {
  const requestPath = req.url === "/" ? "/index.html" : req.url;
  const normalized = path.normalize(requestPath).replace(/^\.\.(\/|\\|$)/, "");
  const filePath = path.join(__dirname, "public", normalized);
  const publicRoot = path.join(__dirname, "public");

  if (!filePath.startsWith(publicRoot)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }

    const ext = path.extname(filePath);
    const type = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8"
    }[ext] || "text/plain; charset=utf-8";

    res.writeHead(200, { "Content-Type": type });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/bloggers") {
    const top30 = bloggers.slice(0, 30).map((b) => ({
      id: b.id,
      name: b.name,
      avatar: b.avatar,
      followers: b.followers
    }));
    sendJson(res, 200, { rankDate: new Date().toISOString().slice(0, 10), list: top30 });
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/api/bloggers/")) {
    const id = req.url.split("/").pop();
    const blogger = bloggers.find((b) => b.id === id);
    if (!blogger) {
      sendJson(res, 404, { error: "未找到该博主" });
      return;
    }
    sendJson(res, 200, blogger);
    return;
  }

  if (req.method === "GET" && req.url === "/api/topics") {
    sendJson(res, 200, {
      date: new Date().toISOString().slice(0, 10),
      track: "小红书 AI 赛道",
      topics: dailyTopics
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/topic-analysis") {
    try {
      const { idea, audience } = await parseBody(req);
      const result = analyzeTopicIdea(idea, audience || "默认");
      sendJson(res, 200, result);
      return;
    } catch (error) {
      sendJson(res, 400, { error: error.message || "请求失败" });
      return;
    }
  }

  if (req.method === "GET") {
    serveStatic(req, res);
    return;
  }

  res.writeHead(405);
  res.end("Method Not Allowed");
});

server.listen(port, () => {
  console.log(`App running: http://localhost:${port}`);
});
