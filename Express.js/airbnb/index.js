import express from "express";
import userRouter from "./routes/userRouter.js";
import hostRouter from "./routes/hostRouter.js";
import path from "path";
import rootDir from "./utils/pathUtil.js";

const app = express();
// for EJS, MUST REQUIRED
app.set("view engine", "ejs");
app.set("views", "views"); // define html folder at right

// default middlewear for console
app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

app.use(express.static(path.join(rootDir, "public"))); //for css file
app.use(express.urlencoded()); // getting and parsing body for POST

app.use(userRouter);
app.use("/host", hostRouter);

// if none of above routes matches then this default 404, must be at below
app.use((req, res) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});
// app.use((req, res) => {
//   res.status(404).send(`<h1>Page Not Found</h1>
//     <a href="/">Back to Home page</a>`);
// });

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
