import User from "../lib/lib"
import bcrypt, { genSalt } from "bcryptjs"
import { generateToken } from "../lib/utils";
import cloudinary from "../lib/cloudinary";

export const singup=async(req,res)=>{
    const {fullName,email,password,bio}=req.body;
    try{
        if(!fullName||!email||!password||!bio){
            return res.json({
                success:false,
                message:"Missing Details"
            })
        }
        const user=await User.findOne({email});
        if(user){
            return res.json({
                success:false,
                message:"Accoutn already exits"
            })
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=await User.create({
            fullName,email,password:hashedPassword,bio
        })
        const token=generateToken(newUser._id);
        res.json({
            success:true,
            userData:newUser,
            token,
            message:"Account created successfully"
        })
    }
    catch(error){
        console.log(error,message);
        res.json({
            success:false,
            message:error.message
        })
    }
}

export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const userData=User.findOne({email});
        const isPassword=await bcrypt.compare(password,userData.password)
        if(!isPassword){
            res.json({
                success:false,
                message:"Invalid credentials"
            })
        }
        const token=generateToken(newUser._id);
        res.json({
            success:true,
            userData,
            token,
            message:"Account created successfully"
        })
    }
    catch(error){
        console.log(error,message);
        res.json({
            success:false,
            message:error.message
        })
    }
}

export const checkAuth=(req,res)=>{
    res.json({
        success:true,
        user:req.user
    })
}

export const updateProfile=async(req,res)=>{
    try{
        const {profilePic,bio,fullName}=req.body;
        const userId=req.user._id;
        let updatedUser;
        if(!profilePic){
            updatedUser=await User.findByIdAndUpdate(userId,{bio,fullName},{new:true})
        }
        else{
            const upload=await cloudinary.uploader.upload(profilePic);
            updatedUser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true});
        }
        res.json({
            success:true,
            user:updatedUser
        })
    }catch(error){
        console.log(error.message);
        res.json({
            success:false,
            message:error.message
        })
    }
}

