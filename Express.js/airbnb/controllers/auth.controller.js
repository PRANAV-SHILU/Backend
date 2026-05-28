import mongoose from "mongoose";
import auth from "../models/authMONGOOSE.js";

export async function getRegisterPage(req, res) {
  res.render("register", { isLoggedIn: false });
}

export async function postRegisterPage(req, res) {
  const { email, password } = req.body;

  console.log("register data", email, password);

  const isExists = await auth.findOne({ email: email });

  if (isExists) {
    console.log("user already found");
    return res.redirect("/auth/register");
  }

  const newUser = new auth({ email: email, password: password });
  newUser.save().then((user) => {
    console.log("new user created", user);
    res.redirect("/");
  });
}

export async function getLoginPage(req, res) {
  res.render("login", { isLoggedIn: false });
}

export async function postLoginPage(req, res) {
  try {
    const { email, password } = req.body;
    console.log("login data", email, password);

    const isExists = await auth.findOne({ email: email, password: password });

    if (!isExists) {
      console.log("user not found");
      return res.redirect("/auth/login");
    }

    console.log("user found", isExists);
    req.session.isLoggedIn = true;
    // res.cookie("isLoggedIn", true);
    res.redirect("/");
  } catch (error) {
    console.log("error in post login", error);
    res.render("/auth/login");
  }
}

export async function logout(req, res) {
  // res.cookie("isLoggedIn", false);
  // res.clearCookie("isLoggedIn");

  req.session.destroy(() => {
    console.log("User loggedout");
    res.redirect("/auth/login");
  });

  // console.log("User loggedout");
  // res.redirect("/auth/login");
}
