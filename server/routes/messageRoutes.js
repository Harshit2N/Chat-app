import { getMessage, getUsersForSideBar, markMessageSeen, sendMessage } from "../controllers/messageController";
import { protectRoute } from "../middleware/auth";

const messageRouter=express.Router();
messageRouter.get("/users",protectRoute, getUsersForSideBar)
messageRouter.get("/:id",protectRoute, getMessage);
messageRouter.get("mark/:id",protectRoute, markMessageSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage);


export default messageRouter;
