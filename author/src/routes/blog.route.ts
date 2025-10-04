import express from "express"
import { isAuth } from "../middlewares/isAuth.js";
import { createBlog, deleteBlog, updateBlog } from "../controllers/blog.controller.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

//@ts-ignore
router.post("/blog/new", isAuth, uploadFile, createBlog)

//@ts-ignore
router.put("/blog/:id", isAuth, uploadFile, updateBlog)

//@ts-ignore 
router.delete("/blog/:id", isAuth, deleteBlog)

export default router;