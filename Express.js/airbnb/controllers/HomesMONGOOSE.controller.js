import mongoose from "mongoose";
import authMONGOOSE from "../models/authMONGOOSE.js";
import homeMONGOOSE from "../models/homeMONGOOSE.js";

export async function getHome(req, res, next) {
  try {
    const homesData = await homeMONGOOSE.find();

    // Build a plain array of favourite home ID strings for the view
    let userFavourites = [];
    if (req.isLoggedIn && req.session.user) {
      const dbUser = await authMONGOOSE.findById(req.session.user._id).lean();
      userFavourites = (dbUser?.favourites || []).map((id) => id.toString());
    }

    res.render("home", {
      homes: homesData,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      userFavourites,
    });
  } catch (err) {
    console.log(err);
  }
}

// export async function getHome(req, res, next) {
//     homeMONGOOSE.find().then((homesData) => {
//         res.render("home", { homes: homesData, isLoggedIn: req.isLoggedIn, user: req.session.user });
//     }).catch(err => console.log(err));
// }

export async function getHomeByID(req, res) {
  const homeID = req.params.homeID;
  homeMONGOOSE
    .findById(homeID)
    .then((homeData) => {
      if (!homeData) {
        console.log("Home not found");
        res.redirect("/");
      }
      console.log(homeData);
      res.render("home-detail", {
        home: homeData,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((err) => console.log(err));
}

export async function getAddHome(req, res) {
  // res.sendFile(path.join(rootDir, "views", "add-home.html"));
  res.render("add-home", {
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
}

export async function getEditHome(req, res) {
  const homeID = req.params.id;
  homeMONGOOSE
    .findById(homeID)
    .then((homeData) => {
      if (!homeData) {
        console.log("Home not found");
        res.redirect("/");
      }
      res.render("edit-home", {
        home: homeData,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((err) => console.log(err));
}

export async function postAddHome(req, res) {
  console.log("Home detail for save:", req.body);
  const home = new homeMONGOOSE({
    name: req.body.name,
    location: req.body.location,
    price: req.body.price,
  });
  home
    .save()
    .then(() => {
      console.log("Home added successfully");
      res.render("homeAdded", {
        ...req.body,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((err) => console.log("Error is postAddHome", err));
}

export async function postEditHome(req, res) {
  const homeID = req.params.id;
  homeMONGOOSE
    .findByIdAndUpdate(homeID, req.body)
    .then((homeData) => {
      if (!homeData) {
        console.log("Home not found");
        res.redirect("/");
      }
      res.redirect(`/`);
    })
    .catch((err) => console.log("Error is postEditHome", err));
}

// POST /favourites  — add a home to the logged-in user's favourites array
export async function postAddToFavourites(req, res) {
  try {
    if (!req.isLoggedIn || !req.session.user) {
      return res.redirect("/auth/login");
    }
    const homeID = new mongoose.Types.ObjectId(req.body.id);

    // $addToSet prevents duplicates automatically
    await authMONGOOSE.findByIdAndUpdate(req.session.user._id, {
      $addToSet: { favourites: homeID },
    });

    console.log("Home added to favourites:", homeID);
    res.redirect("/");
  } catch (err) {
    console.log("Error in postAddToFavourites:", err.message);
    res.redirect("/");
  }
}

// export async function postAddToFavourites(req, res) {
//     try {
//         console.log("favourites post", req.body);
//         const homeID = new mongoose.Types.ObjectId(req.body.id);
//         console.log("Converted homeID:", homeID);
//         const existingFav = await FavouriteMONGOOSE.findOne({ houseId: homeID });
//         if (existingFav) {
//             console.log("Home is already in favourites");
//             return res.redirect("/favourites");
//         }
//         const favourite = new FavouriteMONGOOSE({ houseId: homeID });
//         const savedFav = await favourite.save();
//         console.log("Home added to favourites successfully:", savedFav);
//         res.redirect("/favourites");
//     } catch (err) {
//         console.log("Error in postAddToFavourites:", err.message);
//         res.redirect("/favourites");
//     }
// }

// DELETE /favourites/:homeID  — remove a home from the user's favourites array

export async function deleteFromFavourites(req, res) {
  try {
    if (!req.isLoggedIn || !req.session.user) {
      return res.status(401).json({ message: "Not logged in" });
    }
    const homeID = new mongoose.Types.ObjectId(req.params.homeID);

    await authMONGOOSE.findByIdAndUpdate(req.session.user._id, {
      $pull: { favourites: homeID },
    });

    console.log("Home removed from favourites:", homeID);
    res.status(200).json({ message: "Removed from favourites" });
  } catch (err) {
    console.log("Error in deleteFromFavourites:", err.message);
    res.status(500).json({ message: "Could not remove from favourites" });
  }
}

// GET /favourites  — show all favourited homes for the logged-in user
export async function getFavourites(req, res) {
  try {
    if (!req.isLoggedIn || !req.session.user) {
      return res.redirect("/auth/login");
    }
    // Fetch fresh from DB and populate the Home refs
    const dbUser = await authMONGOOSE
      .findById(req.session.user._id)
      .populate("favourites");
    const favouriteHomes = dbUser?.favourites || [];

    console.log("favourites", favouriteHomes);
    res.render("favourites", {
      homes: favouriteHomes,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.log("Error in getFavourites:", err.message);
    res.redirect("/");
  }
}

// export async function getFavourites(req, res) {
//     FavouriteMONGOOSE.find().populate("houseId").then((favourites) => {
//         const favouritesWithDetails = favourites.map(fav => fav.houseId);
//         console.log("favourite", favouritesWithDetails);
//         res.render("favourites", { homes: favouritesWithDetails, isLoggedIn: req.isLoggedIn, user: req.session.user });
//     }).catch(err => console.log(err));
// }

export async function deleteHome(req, res) {
  try {
    const homeID = req.params.id;

    await homeMONGOOSE.findByIdAndDelete(homeID);

    // Remove this home from every user's favourites array
    await authMONGOOSE.updateMany(
      { favourites: homeID },
      { $pull: { favourites: homeID } }
    );

    res.status(200).json({ message: "Home deleted successfully" });
  } catch (err) {
    console.log("Error deleting home or favourite", err);
    res.status(500).json({ message: "Could not delete home" });
  }
}

// export async function deleteHome(req, res) {
//   const homeID = req.params.id;
//   homeMONGOOSE
//     .findByIdAndDelete(homeID)
//     .then(() => {
//       res.status(200).json({ message: "Home deleted successfully" });
//     })
//     .catch((err) => {
//       console.log("Error deleting home or favourite", err);
//       res.status(500).json({ message: "Could not delete home" });
//     });
// }
