import Message from "../model/message";
import Messages from "../models/Message";
import User from "../models/User"
import cloudinary from "../lib/cloudinary";
import { io,userSocketMap } from "../server"; 

export const getUsersForSideBar=async(req,res)=>{
    try{
        const userId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password");

        const unseenMessages={};
        const promises=filteredUsers.map(async(user)=>{
            const messages=await Message.find({senderId:user._id, receiverId:userId, seen:false})
            if(messages.length>0){
                unseenMessages[user._id]=messages.length;

            }
        })
        await Promise.all(promises);
        res.json({
            success:true,
            filteredUsers,
            unseenMessages
        })
    }catch(error){
        console.log(error.mesage);
        res.json({
            success:false,
            message:error.message
        })
    }
}


export const getMessage=async(req,res)=>{
    try{
        const {id:selectedUserId}=req.params;
        const myId=req.user._id

        const message=await Message.find({
            $or: [
                {senderId:myId,receiverId:selectedUserId},
                {senderId:selectedUserId,receiverId:myId},
            ]
        })
        await Message.updateMany({senderId:selectedUserId, receiverId:myId},{seen:true});
        res.json({
            succes:true,
            message
        })

    }catch(error){
        console.log(error.message);
        res.json({
            success:false,
            message:error.message
        })
    }
}

export const markMessageSeen=async(req,res)=>{
    try{
        const {id}=req.params;
        await Message.findByIdAndUpdate(id,{seen:true});
        res.json({
            success:true
        })
    }
    catch(error){
        console.log(error.message);
        res.json({
            succes:false,
            message:error.message
        })
    }
}

export const sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body;
        const receiverId=req.params.id;
        const senderId=req.user._id;
        
        let imageURL;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageURL=uploadResponse.secure_url
        }
        const newMessage=await Message.create({
            senderId,
            receiverId,
            text,
            image:imageURL
        })
        const receiverSocketId=userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("New message", newMessage);
        }

        res.json({
            succes:true,
            newMessage
        })
    }catch(error){
        console.log(error.message);
        res.json({
            success:false,
            message:error.message
        })
    }
}