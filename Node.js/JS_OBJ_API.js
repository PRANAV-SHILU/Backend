// Fake API using JavaScript objects

import http from "http";
import fs from "fs";

const contentType = "Content-Type";
const appJSON = "application/json";

let users = JSON.parse(fs.readFileSync("users.json", "utf-8"));

const server = http.createServer((req, res) => {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allo-w-Methods",
    "GET, POST, PUT, PATCH, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // 🏠 Home
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/plain");
    return res.end("Welcome to home page");
  }

  // 📥 GET all users
  if (req.url === "/users" && req.method === "GET") {
    res.setHeader(contentType, appJSON);
    return res.end(JSON.stringify(users));
  }

  // 🔍 GET user by ID
  if (req.url.startsWith("/users/") && req.method === "GET") {
    const id = Number(req.url.split("/")[2]);

    const user = users.find((u) => u.id === id);

    if (!user) {
      res.statusCode = 404;
      res.setHeader(contentType, appJSON);
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    res.setHeader(contentType, appJSON);
    return res.end(JSON.stringify(user));
  }

  // ➕ POST create user
  if (req.url === "/users" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      let data;

      // ✅ Safe JSON parse
      try {
        data = JSON.parse(body);
      } catch (err) {
        res.statusCode = 400;
        res.setHeader(contentType, appJSON);
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      // ✅ Basic validation
      if (!data.name || !data.email) {
        res.statusCode = 400;
        res.setHeader(contentType, appJSON);
        return res.end(JSON.stringify({ error: "Name and Email required" }));
      }

      const maxId = users.length ? Math.max(...users.map((u) => u.id)) : 0;

      const newUser = {
        id: maxId + 1,
        name: data.name,
        email: data.email,
        age: Number(data.age),
        role: data.role,
      };

      users.push(newUser);

      // ✅ Pretty JSON + save
      fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

      res.statusCode = 201;
      res.setHeader(contentType, appJSON);
      return res.end(JSON.stringify(newUser));
    });

    return;
  }

  // ❌ DELETE user
  if (req.url.startsWith("/users/") && req.method === "DELETE") {
    const id = Number(req.url.split("/")[2]);

    const beforeLength = users.length;

    users = users.filter((u) => u.id !== id);

    if (beforeLength === users.length) {
      res.statusCode = 404;
      res.setHeader(contentType, appJSON);
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

    res.statusCode = 200;
    res.setHeader(contentType, appJSON);
    return res.end(JSON.stringify({ message: "User deleted successfully" }));
  }

  // ❌ Not found
  res.statusCode = 404;
  res.setHeader(contentType, appJSON);
  res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(3000, () => {
  console.log("Server running on PORT 3000");
});
