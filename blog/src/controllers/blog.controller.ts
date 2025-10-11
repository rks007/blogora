import axios from "axios";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/tryCatch.js";
import { redisClient } from "../server.js";

export const getAllBlogs = TryCatch(async (req, res) => {

    const {searchQuery = "", category = ""} = req.query;

    const cacheKey = `blogs:${searchQuery}:${category}`;

    const cached = await redisClient.get(cacheKey);

    if(cached){
        console.log("Serving from redis cache");
        res.json(JSON.parse(cached))
        return;
    }

    let blogs;

    if(searchQuery && category){
        blogs = await sql`SELECT * FROM blogs 
        WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"})
        AND category = ${category} 
        ORDER BY created_at DESC
        `;
    } else if(searchQuery){
        blogs = await sql`SELECT * FROM blogs 
        WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"})
        ORDER BY created_at DESC
        `;
    } else if(category){
        blogs = await sql`SELECT * FROM blogs
        WHERE category=${category}
        ORDER BY created_at DESC
        `;
    } else {
        blogs = await sql`SELECT * FROM blogs ORDER BY created_at DESC`
    }

    console.log("serving from db");

    await redisClient.set(cacheKey, JSON.stringify(blogs), {EX: 3600}); //expiration after 1 hour
    
    res.json(blogs);
})

export const getSingleBlog = TryCatch(async (req, res) => {
    const {id} = req.params;

    const cacheKey = id;

    const cached = await redisClient.get(cacheKey);

    if(cached){
        console.log("serving from redis");
        res.json(JSON.parse(cached));
        return;
    }

    const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;

    if(blog.length == 0){
        res.status(404).json({
            message: "No blog with this id"
        })
        return;
    }



    const {data} = await axios.get(`${process.env.USER_SERVICE}/api/v1/user/${blog[0].author}`)

    console.log("serving from db");

    const responseData = { blog: blog[0], author: data };
    
    await redisClient.set(cacheKey, JSON.stringify(responseData), {EX: 3600});

    res.json({
        blog: blog[0],
        author: data
    });
})