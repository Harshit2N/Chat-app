import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./lib/lib.js";
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";
import "dotenv/config";

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
export const io = new Server(server, {
  cors: { origin: "*" },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("Server is live");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to database
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
