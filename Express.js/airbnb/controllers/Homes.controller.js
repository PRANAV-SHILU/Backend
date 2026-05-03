import { Favourite } from "../models/favourites.js";
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

export async function getHomeByID(req, res) {
  const homeID = req.params.homeID;
  Home.findByID(homeID, (home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/");
    }
    // because of static
    console.log(home);
    //for ejs
    res.render("home-detail", { home: home });
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

export async function postAddToFavourites(req, res) {
  console.log("favourites post", req.body);
  Favourite.addToFavourite(req.body.id, (error) => {
    if (error) console.log("Error is postAddToFavourites", error);
  });
  res.redirect("/favourites");
}
export async function getFavourites(req, res) {
  Favourite.getFavourites((favourites) => {
    Home.fetchAll((homes) => {
      const favouritesWithDetails = favourites.map(homeID => homes.find(home => home.id == homeID))
      res.render("favourites", { homes: favouritesWithDetails });
    })
  });
}
