import express from "express";

const app = express();

app.use("/", (req, res, next) => {
  console.log("hello, i am first middleware", req.url, req.method);
  // res.send("<p>Hello, I am first middleware</p>");  // terminates the request-response cycle , does not call next middleware
  next();
});

app.use("/submit", (req, res, next) => {
  console.log("hello, i am submit middleware", req.url, req.method);
  res.send("<p>Hello, I am submit middleware</p>");
  // next();
});

// Automatically creates server and listens on the specified port
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
