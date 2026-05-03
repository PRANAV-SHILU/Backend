import express from "express";
import rootDir from "../utils/pathUtil.js";
import path from "path";
import { getHome } from "../controllers/Homes.js";

const userRouter = express.Router();

// serving HTML files
userRouter.get("/", getHome);

// userRouter.get("/", (req, res, next) => {
//   console.log(homes);
//   //for ejs
//   res.render("home", { homes: homes });
// });

// userRouter.get("/", (req, res, next) => {
//   res.send(`<h1>Welcome to airbnb</h1>
//     <a href="/host/add-home">Add Home</a>`);
// });

export default userRouter;
