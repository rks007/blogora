import express from "express";
import { getUserProfile, loginUser, myProfile, updateProfilePic, updateUser } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
const router = express.Router();
router.post("/login", loginUser);
//@ts-ignore
router.get("/me", isAuth, myProfile);
router.get("/user/:id", getUserProfile);
//@ts-ignore
router.put("/user/update", isAuth, updateUser);
//@ts-ignore
router.put("/user/update/pic", isAuth, uploadFile, updateProfilePic);
export default router;
