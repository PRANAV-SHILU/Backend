import express from "express";
import path from "path";
import rootDir from "../utils/pathUtil.js";
// import { getAddHome, postAddHome, getEditHome, postEditHome, deleteHome } from "../controllers/HomesFILE.controller.js";
import { getAddHome, postAddHome, getEditHome, postEditHome, deleteHome } from "../controllers/HomesSQL.controller.js";

const hostRouter = express.Router();

// hostRouter.get("/host/add-home", // if not used /host as common path at index.js
hostRouter.get("/add-home", getAddHome);

hostRouter.get("/edit-home/:id", getEditHome);

hostRouter.post("/edit-home/:id", postEditHome);

hostRouter.post("/add-home", postAddHome);

hostRouter.delete("/delete-home/:id", deleteHome);

export default hostRouter;
