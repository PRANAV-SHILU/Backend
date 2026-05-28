import express from 'express';
import { getLoginPage, postLoginPage, logout, getRegisterPage, postRegisterPage, registerValidation, loginValidation } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.get("/register",getRegisterPage)
authRouter.post("/register", registerValidation, postRegisterPage)

authRouter.get("/login", getLoginPage);
authRouter.post("/login",loginValidation, postLoginPage);
authRouter.get("/logout", logout)


export default authRouter;