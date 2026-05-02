// serving html pages and object
// intial learnign file

import http from "http";
import fs from "fs";
import path from "path";

const server = http.createServer((req, res) => {
  const { url, method } = req;
  // res.write(`URL: ${url}\n`);
  // res.write(`Method: ${method}\n\n`);
  let filePath;
  if (url === "/") {
    // manual handling, URL module helps for automatic handling,
    filePath = path.join(process.cwd(), "index.html");
  } else if (url === "/about") {
    filePath = path.join(process.cwd(), "about.html");
  } else if (url === "/users" && method === "GET") {
    const users = ["pranav", "rahul", "prince", "sahil"];
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(users));
    return;
  } else if (url === "/login" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        console.log(data);

        res.end("Data received");
      } catch (error) {
        res.statusCode = 400;
        res.end(`Invalid JSON - ${res.statusCode} - ${error}`);
      }
    });
  } else {
    res.statusCode = 404;
    res.end(`Page Not Found - ${res.statusCode}`);
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end("Internal Server Error");
    } else {
      res.setHeader("Content-Type", "text/html");
      res.end(data);
    }
  });
});

server.listen(3000);
