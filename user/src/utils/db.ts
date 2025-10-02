import mongoose from "mongoose";    

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI as string);

        console.log("Connected to mongodb");
        
    } catch (error: any) {
        console.log("error while database connect", error.message);
        
    }
}

export default connectDB;