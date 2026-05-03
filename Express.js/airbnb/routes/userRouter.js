import express from "express";
import rootDir from "../utils/pathUtil.js";
import path from "path";
import {
  getFavourites,
  getHome,
  getHomeByID,
  postAddToFavourites,
} from "../controllers/Homes.controller.js";

const userRouter = express.Router();

// serving HTML files
userRouter.get("/", getHome);

userRouter.get("/homes/:homeID", getHomeByID);

userRouter.post("/favourites", postAddToFavourites);

userRouter.get("/favourites", getFavourites);

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
