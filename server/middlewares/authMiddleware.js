import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

export const protectCompany = async(req,res,next)=>{
    const token = req.headers.token
    if(!token){
        return res.status(401).json({message:"Not authorized"});
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.company = await Company.findById(decoded.id).select("-password")
        next()
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}