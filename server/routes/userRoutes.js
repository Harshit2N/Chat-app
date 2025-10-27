import express from "express";
import { checkAuth, login, singup, updateProfile } from "../controllers/userController";
import { protectRoute } from "../middleware/auth";

const userRouter=express.Router();
userRouter.post("/signup",singup);
userRouter.post("/login",login);
userRouter.put("/update-profile",protectRoute, updateProfile);
userRouter.post("/check",protectRoute,checkAuth);

export default userRouter;