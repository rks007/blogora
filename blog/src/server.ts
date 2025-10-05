import express from "express"
import dotenv from "dotenv";
import blogrouter from "./routes/blog.route.js"

dotenv.config();

const app = express();

const port = process.env.PORT;


app.use("/api/v1/", blogrouter);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    
})