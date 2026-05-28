import express from 'express';
import { getLoginPage, postLoginPage, logout, getRegisterPage, postRegisterPage, registerValidation } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.get("/register",getRegisterPage)
authRouter.post("/register", registerValidation, postRegisterPage)

authRouter.get("/login", getLoginPage);
authRouter.post("/login",registerValidation, postLoginPage);
authRouter.get("/logout", logout)


export default authRouter;