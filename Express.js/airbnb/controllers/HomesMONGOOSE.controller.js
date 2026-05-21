import { ObjectId } from "mongodb";
import FavouriteMONGOOSE  from "../models/favouritesMONGOOSE.js";
import homeMONGOOSE from "../models/homeMONGOOSE.js";

export async function getHome(req, res, next) {
    homeMONGOOSE.find().then((homesData) => {
        console.log("fetchAll MONGOOSE", homesData);
        res.render("home", { homes: homesData });
    }).catch(err => console.log(err));
}

export async function getHomeByID(req, res) {
    const homeID = req.params.homeID;
    homeMONGOOSE.findById(homeID).then((homeData) => {
        if (!homeData) {
            console.log("Home not found");
            res.redirect("/");
        }
        console.log(homeData);
        res.render("home-detail", { home: homeData });
    }).catch(err => console.log(err));
}

export async function getAddHome(req, res) {
    // res.sendFile(path.join(rootDir, "views", "add-home.html"));
    res.render("add-home");
}

export async function getEditHome(req, res) {
    const homeID = req.params.id;
    homeMONGOOSE.findById(homeID).then((homeData) => {
        if (!homeData) {
            console.log("Home not found");
            res.redirect("/");
        }
        res.render("edit-home", { home: homeData });
    }).catch(err => console.log(err));
}

export async function postAddHome(req, res) {
    console.log("Home detail for save:", req.body);
    const home = new homeMONGOOSE({ name: req.body.name, location: req.body.location, price: req.body.price });
    home.save().then(() => {
        console.log("Home added successfully");
        res.render("homeAdded", { ...req.body });
    }).catch(err => console.log("Error is postAddHome", err));
}

export async function postEditHome(req, res) {
    const homeID = req.params.id;
    homeMONGOOSE.findByIdAndUpdate(homeID, req.body).then((homeData) => {
        if (!homeData) {
            console.log("Home not found");
            res.redirect("/");
        }
        res.redirect(`/`);
    }).catch(err => console.log("Error is postEditHome", err));
}

export async function postAddToFavourites(req, res) {
    console.log("favourites post", req.body);

    //check if home is already in favourites or not, if not then add to favourites
    const homeID = req.body.id;
    FavouriteMONGOOSE.getFavourites().then((favourites) => {
        const isFavourite = favourites.some(fav => String(fav.houseId) === String(homeID));
        if (!isFavourite) {
            const favourite = new Favourite(homeID);
            FavouriteMONGOOSE.save().then((result) => {
                console.log("Home added to favourites successfully", result);
            }).catch(err => console.log("Error is postAddToFavourites", err));
        }
    }).catch(err => console.log("Error is postAddToFavourites", err)).finally(() => {
        res.redirect("/favourites");
    });
}

export async function getFavourites(req, res) {
    FavouriteMONGOOSE.getFavourites().then((favourites) => {
        favourites = favourites.map(fav => String(fav.houseId));
        homeMONGOOSE.find().then((homes) => {
            console.log(favourites, homes);
            const favouritesWithDetails = homes.filter(home => favourites.includes(String(home._id)));
            console.log("favourite With Details", favouritesWithDetails);
            res.render("favourites", { homes: favouritesWithDetails });
        }).catch(err => console.log(err));
    });
}

export async function deleteHome(req, res) {
    const homeID = req.params.id;
    homeMONGOOSE.findByIdAndDelete(homeID)
        .then(() => FavouriteMONGOOSE.deleteFromFavourite(homeID))
        .then(() => {
            res.status(200).json({ message: "Home deleted successfully" });
        })
        .catch(err => {
            console.log("Error deleting home or favourite", err);
            res.status(500).json({ message: "Could not delete home" });
        });
}