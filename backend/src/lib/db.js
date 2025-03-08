import mongoose from "mongoose"

export const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Mongodb connected successfully')

    }
    catch(error
    ){
console.log("Mongodb error it is",error)
    }
}