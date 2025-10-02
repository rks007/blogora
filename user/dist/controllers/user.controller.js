import User from "../models/user.js";
import jwt from "jsonwebtoken";
import TryCatch from "../utils/tryCatch.js";
import getBuffer from "../utils/dataUri.js";
import { v2 as cloudinary } from "cloudinary";
export const loginUser = async (req, res) => {
    try {
        const { email, name, image } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                image
            });
        }
        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });
        res.status(200).json({
            message: "Login success",
            token,
            user
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
export const getUserProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            message: "no user with this id"
        });
    }
    res.json(user);
});
export const updateUser = TryCatch(async (req, res) => {
    const { name, linkedin, bio } = req.body;
    const userId = req.user?._id;
    const user = await User.findByIdAndUpdate(userId, {
        name,
        linkedin,
        bio
    }, { new: true });
    //create new token because user is updated
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    res.json({
        message: "user updated",
        token,
        user
    });
});
//upload image or we can say update user profile pic
export const updateProfilePic = TryCatch(async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "No file to Upload"
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(400).json({
            message: "Failed to generate buffer"
        });
        return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "blogs"
    });
    const userId = req.user?._id;
    const user = await User.findByIdAndUpdate(userId, {
        image: cloud.secure_url
    }, { new: true });
    //create new token because user is updated
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    res.json({
        message: "user profile picture updated",
        token,
        user
    });
});
