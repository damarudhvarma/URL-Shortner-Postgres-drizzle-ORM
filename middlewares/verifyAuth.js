import { verifyToken } from "../utils/jwt.js";

export const verifyAuth=(req,res,next)=>{
const authHeader= req.headers["authorization"];
 if(!authHeader.startswith("Bearer")){
    return res.status(401).json({message:"unauthorized"});
 }
 const token= authHeader.split(" ")[1];
 const decoded = verifyToken(token);
 req.user=decoded;
 next();
}