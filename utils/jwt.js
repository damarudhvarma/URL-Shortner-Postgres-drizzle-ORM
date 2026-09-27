import jwt from "jsonwebtoken";

export const generateToken=(payload)=>{
    return jwt.sign(payload,process.env.JWT_SECRET, {expiresIn:"1h"});
}

export const verifyToken=(token)=>{
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
}
