import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar=async(req,res)=>{
     try {
        const loggedInUser=req.user._id;
        const filtereedUsers=await User.find({_id:{$ne:loggedInUser}}).select("-password")

        res.status(200).json(filtereedUsers)
     } catch (error) {
        console.log("Error in getting users",error.message)
        res.status(500).json({message:"Internal Server Error"})
     }
}
export const getMessages=async(req,res)=>{
    try {
        const { id:userToChatId }=req.params;
        const myId=req.user._id;
        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId},

            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getting messages ",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}
export const sendMessage=async(req,res)=>{
try {
    const { text,image }=req.body;
    const{ id:receiverId }=req.params;
    const senderId=req.user._id

    let imageUrl;
    if(image){
        //uplaod on cloudianary
        const uplaodResponse=await cloudinary.uploader.upload(image);
        imageUrl=uplaodResponse.secure_url


    }

    const newMessage=new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl,
    })
    await newMessage.save();

    res.status(201).json(newMessage)
} catch (error) {
    console.log("Error in sending msgs auth",error.message)
    res.status(500).json({message:"Internal Server Error"})
}
}