import User from "../models/User.js"
import JobApplication from "../models/JobApplication.js"
import Job from "../models/Job.js"
import { v2 as cloudinary } from "cloudinary"

export const getUserData =async(req,res)=>{
    const userId = req.auth.userId
    try {
        const user = await User.findById(userId)

        if(!user){
            return res.json({success:false,message:"User not found"})
        }

        res.json({success:true,user})
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}

export const applyForJob =async(req,res)=>{

    const {jobId} = req.body

    const userId = req.auth.userId

    try {
        const isAlreadyApplied = await JobApplication.find({jobId,userId})
        if(isAlreadyApplied.length>0){
            return res.json({success:false,message:"You have already applied for this job"})
        }

        const jobData = await Job.findById(jobId)

        if(!jobData){
            return res.json({success:false,message:"Job not found"})
        }

        await JobApplication.create({
            companyId:jobData.companyId._id,
            jobId,
            userId,
            date:Date.now()
        })
        res.json({success:true,message:"Job applied successfully"})
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}

export const getUserJobApplications =async(req,res)=>{
    try {
        const userId = req.auth.userId

        const applications = await JobApplication.find({userId})
        .populate('companyId','name email image')
        .populate('jobId','title description location salary level')
        .exec()

        if(!applications){
            return res.json({success:false,message:"No applications found"})
        }

        res.json({success:true,applications})
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}

export const updateUserResume =async(req,res)=>{
    try {
        const userId = req.auth.userId

        const resumeFile = req.file

        const userData = await User.findById(userId)

        if(resumeFile){
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }

        await userData.save()

        res.json({success:true,message:"Resume uploaded successfully"})
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}