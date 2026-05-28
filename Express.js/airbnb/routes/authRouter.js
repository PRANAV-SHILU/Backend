import express from 'express';
import { getLoginPage, postLoginPage, logout, getRegisterPage, postRegisterPage } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.get("/register",getRegisterPage)
authRouter.post("/register",postRegisterPage)

authRouter.get("/login", getLoginPage);
authRouter.post("/login", postLoginPage);
authRouter.get("/logout", logout)


export default authRouter;