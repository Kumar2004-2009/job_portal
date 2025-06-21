import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from 'cloudinary';
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

// Register a new company
export const registerCompany = async (req, res) => {

    const {name,email,password}=req.body

    const imageFile = req.file;
    if(!name || !email || !password || !imageFile){
        return res.json({success:false,message:"Please fill all the fields"});
    }

    try {
        const companyExists = await Company.findOne({email});
        if (companyExists) {
            return res.json({success:false,message:"Company already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        const company = await Company.create({
            name,
            email,
            password: hashedPassword,
            image:imageUpload.secure_url
        })

        res.json({
            success:true,
            company:{
                _id:company._id,
                name:company.name,
                email:company.email,
                image:company.image
            },
            token:generateToken(company._id)
        })
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}

// company login
export const loginCompany = async (req, res) => {
    
    const {email,password} =req.body

    try {
        const company = await Company.findOne({email});

        if(!company){
            return res.json({success:false,message:"Company not found"});
        }
        if(await bcrypt.compare(password,company.password)){
            res.json({
                success:true,
                company:{
                    _id:company._id,
                    name:company.name,
                    email:company.email,
                    image:company.image
                },
                token:generateToken(company._id)
            })
        }
        else{
            return res.json({success:false,message:"Incorrect password"});
        }
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}

// get company data
export const getCompanyData = async (req, res) => {
    
    try {
        const company = req.company

        res.json({success:true,company})
        
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}

// postt a new job
export const postJob = async (req, res) => {
    
    const {title,description,location,salary,level,category}=req.body

    const companyId = req.company._id

    try {
        const newJob = await Job.create({
            title,
            description,
            location,
            salary,
            level,
            companyId,
            date:Date.now(),
            category
        })   

        await newJob.save()

        res.json({success:true,job:newJob,message:"Job posted successfully"})
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}

// get company job applicants
export const getCompanyJobApplicants = async (req, res) => {
    try {
        const companyId = req.company._id;

        const applictions = await JobApplication.find({companyId})
        .populate('userId','name image resume')
        .populate('jobId','title category location salary level')
        .exec()

        return res.json({success:true,applictions})
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}

// get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id
        const jobs = await Job.find({companyId})
        // Adding no. of applicants info in data
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const jobApplicants = await JobApplication.find({jobId:job._id})
            return {...job.toObject(), applicants: jobApplicants.length}
        }))

        res.json({success:true,jobsData,message:"Jobs fetched successfully"})
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}

// change job application status
export const changeJobApplicationStatus = async (req, res) => {
    
    try {
        const {id,status} = req.body
        await JobApplication.findOneAndUpdate({_id:id},{status})
        res.json({success:true,message:"Job application status changed successfully"})
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}

// change job visibility
export const changeJobVisibility = async (req, res) => {
    try {
        const {id} = req.body

        const companyId = req.company._id

        const job = await Job.findById(id)

        if(job.companyId.toString() === companyId.toString()){
            job.visible = !job.visible
        }
        await job.save()
        res.json({success:true,message:"Job visibility changed successfully"})
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}