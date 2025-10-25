import mongoose from "mongoose";

const connectToMongodb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB)
        console.log("Database Connected Successfully")

    }catch(error){
        console.log("Error connecting",error.message)
    }
}


export default connectToMongodb;