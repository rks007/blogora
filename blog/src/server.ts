import express from "express"
import dotenv from "dotenv";
import blogrouter from "./routes/blog.route.js"
import {createClient} from "redis"

dotenv.config();

const app = express();

const port = process.env.PORT;

export const redisClient = createClient({
    url: process.env.REDIS_URL
})

redisClient.connect()
.then(() => {
    console.log("Connect to redis");
})
.catch((error) => {
    console.log("error", error.message);  
})


app.use("/api/v1/", blogrouter);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    
})