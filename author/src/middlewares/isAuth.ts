import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface IUser extends Document {
    _id: string,
    name: string,
    email: string,
    image: string,
    linkedin: string,
    bio: string
}

export interface AuthenticatedRequest extends Request{
    user: IUser | null
}

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) : Promise<void> => {
    try {
        
        const authHeader = req.headers.authorization;
         

        if(!authHeader || !authHeader.startsWith("Bearer")){
            res.status(401).json({
                message: "Please Login- no auth header"
            })
            return
        }

        const token = authHeader.split(" ")[1];

        const decodevalue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        
        if(!decodevalue || !decodevalue.user){
            res.status(401).json({
                message: "Invalid token"
            })

            return;
        }

        req.user = decodevalue.user;

        next();

    } catch (error) {
        console.log("JWT verification error: ", error);
        res.status(401).json({
            message: "Please login - Jwt error"
        })
    }   
}

