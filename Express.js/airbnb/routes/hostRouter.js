import express from "express";
import path from "path";
import rootDir from "../utils/pathUtil.js";
import { getAddHome, postAddHome } from "../controllers/Homes.controller.js";

const hostRouter = express.Router();

// hostRouter.get("/host/add-home", // if not used /host as common path at index.js
hostRouter.get("/add-home", getAddHome);

hostRouter.post("/add-home", postAddHome);

export default hostRouter;
