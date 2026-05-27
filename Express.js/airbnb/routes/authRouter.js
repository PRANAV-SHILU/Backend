import express from 'express';
import { getLoginPage, postLoginPage, logout } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.get("/login", getLoginPage);
authRouter.post("/login", postLoginPage);
authRouter.get("/logout", logout)


export default authRouter;