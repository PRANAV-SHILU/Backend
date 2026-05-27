import "dotenv/config";
import express from "express";
import userRouter from "./routes/userRouter.js";
import hostRouter from "./routes/hostRouter.js";
import authRouter from "./routes/authRouter.js";
import path from "path";
import rootDir from "./utils/pathUtil.js";
import db from "./utils/databaseUtilSQL.js";
import mongoConnect from "./utils/databaseUtilMONGO.js";
import mongoose from "mongoose";

// promise way
// db.execute("SELECT * FROM homes").then((rows) => console.log("Data from sql", rows)).catch(err => console.log("error while creating serevr", err));

// FOR SQL
// async-await way
// const [data] = await db.execute("SELECT * FROM homes");
// console.log("Server started by await", data);



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

// middlewear for cookies
app.use((req, res, next) => {
  console.log("cookies", req.get("Cookie"));
  req.isLoggedIn = req.get("Cookie")?.split('=')[1] === "true" || false;
  next();
})

app.use("/", userRouter);

// middlewear checks cookie in req set by previous middleware
app.use("/host", (req, res, next) => {
  if (!req.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
});

app.use("/host", hostRouter);
app.use("/auth", authRouter);

// if none of above routes matches then this default 404, must be at below
app.use((req, res) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

// app.use((req, res) => {
//   res.status(404).send(`<h1>Page Not Found</h1>
//     <a href="/">Back to Home page</a>`);
// });


// for mongoDB
// mongoConnect(() => {
//   app.listen(3000, () => {
//     console.log("🚀 Server running on http://localhost:3000");
//   });
// });

mongoose.connect(process.env.MONGO_URL_FOR_MONGOOSE).then(() => {
  console.log("connected to mongo");
  app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
}).catch((err) => {
  console.log("error while connecting to mongo", err);
});
