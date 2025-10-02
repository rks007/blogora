import mongoose from "mongoose";
const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongodb");
    }
    catch (error) {
        console.log("error while database connect", error.message);
    }
};
export default connectDB;
