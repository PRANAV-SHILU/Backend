import mongoose from "mongoose";
import auth from "../models/authMONGOOSE.js"

export async function getLoginPage(req, res) {
    res.render("login", { isLoggedIn: false });
}

export async function postLoginPage(req, res) {
    try {
        const { email, password } = req.body;
        console.log("login data", email, password);
        req.session.isLoggedIn = true;
        // res.cookie("isLoggedIn", true);
        res.redirect("/")

        // const isExists = await auth.findOne({ email: email })

        // if (isExists) {
        //     console.log("user already found");
        //     return res.redirect("/auth/login",{isLoggedIn: false});
        // }

        // const newUser = new auth({email: email, password: password})
        // home.save().then((user)=>{
        //     console.log("new user created",user)
        //     res.render("/",{isLoggedIn})
        // })

    } catch (error) {
        console.log("error in post login", error)
        res.render("/auth/login")
    }
}

export async function logout(req, res) {
    // res.cookie("isLoggedIn", false);
    // res.clearCookie("isLoggedIn");

    req.session.destroy(() => {
        console.log("User loggedout");
        res.redirect("/auth/login");
    })

    // console.log("User loggedout");
    // res.redirect("/auth/login");
}