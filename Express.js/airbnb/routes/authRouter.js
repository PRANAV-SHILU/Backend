import express from 'express';
import { getLoginPage, postLoginPage } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.get("/", getLoginPage);
authRouter.post("/", postLoginPage);

export default authRouter;