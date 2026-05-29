import mongoose from "mongoose";
import FavouriteMONGOOSE from "../models/favouritesMONGOOSE.js";
import homeMONGOOSE from "../models/homeMONGOOSE.js";

export async function getHome(req, res, next) {
    homeMONGOOSE.find().then((homesData) => {
        // console.log("fetchAll MONGOOSE", homesData);
        res.render("home", { homes: homesData, isLoggedIn: req.isLoggedIn, user: req.session.user });
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
        res.render("home-detail", { home: homeData, isLoggedIn: req.isLoggedIn, user: req.session.user });
    }).catch(err => console.log(err));
}

export async function getAddHome(req, res) {
    // res.sendFile(path.join(rootDir, "views", "add-home.html"));
    res.render("add-home", {isLoggedIn: req.isLoggedIn, user: req.session.user});
}

export async function getEditHome(req, res) {
    const homeID = req.params.id;
    homeMONGOOSE.findById(homeID).then((homeData) => {
        if (!homeData) {
            console.log("Home not found");
            res.redirect("/");
        }
        res.render("edit-home", { home: homeData, isLoggedIn: req.isLoggedIn, user: req.session.user });
    }).catch(err => console.log(err));
}

export async function postAddHome(req, res) {
    console.log("Home detail for save:", req.body);
    const home = new homeMONGOOSE({ name: req.body.name, location: req.body.location, price: req.body.price });
    home.save().then(() => {
        console.log("Home added successfully");
        res.render("homeAdded", { ...req.body, isLoggedIn: req.isLoggedIn, user: req.session.user });
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
    try {
        console.log("favourites post", req.body);
        const homeID = new mongoose.Types.ObjectId(req.body.id);
        console.log("Converted homeID:", homeID);

        //check if home is already in favourites or not, if not then add to favourites
        const existingFav = await FavouriteMONGOOSE.findOne({ houseId: homeID });

        if (existingFav) {
            console.log("Home is already in favourites");
            return res.redirect("/favourites");
        }

        const favourite = new FavouriteMONGOOSE({ houseId: homeID });
        console.log("Favourite object created:", favourite);

        const savedFav = await favourite.save();
        console.log("Home added to favourites successfully:", savedFav);
        res.redirect("/favourites");

    } catch (err) {
        console.log("Error in postAddToFavourites:", err.message);
        console.log("Full error:", err);
        res.redirect("/favourites");
    }
}

export async function getFavourites(req, res) {
    FavouriteMONGOOSE.find().populate("houseId").then((favourites) => {
        const favouritesWithDetails = favourites.map(fav => fav.houseId);
        console.log("favourite", favouritesWithDetails);
        res.render("favourites", { homes: favouritesWithDetails, isLoggedIn: req.isLoggedIn, user: req.session.user });
    }).catch(err => console.log(err));
}

export async function deleteHome(req, res) {
    const homeID = req.params.id;
    homeMONGOOSE.findByIdAndDelete(homeID)
        .then(() => {
            res.status(200).json({ message: "Home deleted successfully" });
        })
        .catch(err => {
            console.log("Error deleting home or favourite", err);
            res.status(500).json({ message: "Could not delete home" });
        });
}