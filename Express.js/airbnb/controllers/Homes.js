import { Home } from "../models/home.js";

export async function getHome(req, res, next) {
  // due to callback
  Home.fetchAll((homes) => {
    // because of static
    console.log(homes);
    //for ejs
    res.render("home", { homes: homes });
  });
}

export async function getAddHome(req, res) {
  // res.sendFile(path.join(rootDir, "views", "add-home.html"));
  res.render("add-home");
}

export async function postAddHome(req, res) {
  console.log("Home registered successfully for:", req.body);
  const home = new Home(req.body.name, req.body.location, req.body.price);
  home.save();
  res.render("homeAdded", { ...req.body });
}
