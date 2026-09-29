import { Router } from "express";
import { login, signUp } from "../controller/user.controller.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";

const userRouter = Router();

userRouter.post('/signup', signUp);
userRouter.post('/login',login);

export default userRouter;