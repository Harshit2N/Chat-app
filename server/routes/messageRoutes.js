import { getMessage, getUsersForSideBar, markMessageSeen, sendMessage } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/auth.js";
import express from "express"
const messageRouter=express.Router();
messageRouter.get("/users",protectRoute, getUsersForSideBar)
messageRouter.get("/:id",protectRoute, getMessage);
messageRouter.get("mark/:id",protectRoute, markMessageSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage);


export default messageRouter;
