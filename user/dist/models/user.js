import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    linkedin: {
        type: String,
    },
    bio: {
        type: String
    }
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;
