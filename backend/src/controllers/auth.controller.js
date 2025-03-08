import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
export const signup=async(req,res)=>{
    const {fullName,email,password}=req.body;
    try {

        if(!fullName || !email || !password){
            res.status(400).json({message:"All fields required"})
        }
         if(password.length<6){ 
            return res.status(400).json({message:"Passowrd must be at least 6 characters"})
         }
         const user=await User.findOne({email})
         if(user){return res.status(400).json({message:"Emails exists"})}

         //hash pass
         const salt=await bcrypt.genSalt(10)
         const hashedPass=await bcrypt.hash(password,salt)

         const newUser=new User({
            fullName,
            email,
            password:hashedPass
         })
         if(newUser){
            //now generate jsonwebtokens
            generateToken(newUser._id,res)
            await newUser.save()


            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName, 
                email:newUser.email,
                profilePic:newUser.profilePic
            })
         }
         else{
            res.status(400).json({message:"Invail user"})
         }
    } catch (error) {
        console.log("Error in signup",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}
export const login=async(req,res)=>{
    const {email,password}=req.body;
    try {
         const user=await User.findOne({email})
         if(!user){return res.status(400).json({message:"Invalid creditials"})}

        
       const isPassowrdCorrect=await bcrypt.compare(password,user.password)
       if(!isPassowrdCorrect){
        return res.status(400).json({message:"Invaild creditails"})
       }

       generateToken(user._id,res)
       res.status(200).json({
        _id:user_id,
        fullName:user.fullName,
        email:user.email,
        profilePic:user.profilePic,
       })
    } catch (error) {
        console.log("Error in signup",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}
export const logout=(req,res)=>{
   try {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logged out"})
   } catch (error) {
    console.log("Error in logout",error.message)
        res.status(500).json({message:"Internal Server Error"})
   }
}

export const updateProfile=async(req,res)=>{
    try {
        const {profilePic}=req.body;
        const userId=req.user._id;

        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required bro"})

        }

        const uploadResponse=await cloudinary.uploader.upload(profilePic)

        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("Error in uploading profiile",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const checkAuth=async(req,res)=>{
    try {
        res.status(200).json(req.user)

    } catch (error) {
         console.log("Error in checking auth",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}