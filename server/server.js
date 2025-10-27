import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connectDB } from './lib/lib.js';
import messageRouter from './routes/messageRoutes.js';
import Server from "socket.io"
import { object } from 'zod/v4-mini';

dotenv.config({ path: "./server/.env" });
const app=express();
const server=http.createServer(app);
export const io=new Server(server,{
    cors:{origin:"*"}
})
export const userSocketMap={};

io.on("connection",
    (socket)=>{
        const userId=socket.handshake.query.userId
        console.log("User connected");
        if(userId){
            userSocketMap[userId]=socket.id;
        }
        io.emit("getOnlineUserd",Object.keys(userSocketMap));
        socket.on("disconnect",()=>{
            console.log("User Disconnected",userId);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers",Object.keys(userSocketMap))
        })
    }
)
app.use(express.json({limit:"4mb"}));
app.use(cors());
app.use("/api/status",(req,res)=>{
    res.send("Server is live")
})
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter)

//connect to db 
await connectDB();
const PORT=process.env.PORT||5000;
server.listen(PORT,()=>console.log("Server is running on PORT "+PORT))