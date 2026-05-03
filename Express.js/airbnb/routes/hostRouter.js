import express from "express";
import path from "path";
import rootDir from "../utils/pathUtil.js";

const hostRouter = express.Router();

// hostRouter.get("/host/add-home", // if not used /host as common path at index.js
hostRouter.get("/add-home", (req, res) => {
  // res.sendFile(path.join(rootDir, "views", "add-home.html"));
  res.render("add-home");
});

const homes = [];

hostRouter.post("/add-home", (req, res) => {
  console.log("Home registered successfully for:", req.body);
  homes.push({ ...req.body });
  res.render("homeAdded", { ...req.body });
});

export { homes };
export default hostRouter;
