const express = require('express');
const cookieParser = require("cookie-parser");
const router = express.Router();
const jwt = require('jsonwebtoken');
require('../db');
const Student = require("../models/StudentSchema");
const Faculty = require("../models/FacultySchema");
const PDF = require('../models/CerSchema')
const Admin = require('../models/AdminSchema');
const HOD = require("../models/HODSchema");
const bycrypthash = require('bcryptjs');
const authenticate = require('../middleware/authenticate');
router.use(cookieParser());

router.post('/Register', async (req, res)=> {
    const { role,firstName,lastName,userId,email,department,year,facultyType,password } = req.body;
    try {
        let user;
        let savedUser;
        if (role === 'Student') {
            const emailExists = await Student.findOne({ email });
            if(emailExists) {
                return res.status(203).json({error: "Email Already Exists"});
            }
            user = new Student({ role , firstName, lastName, userId, email, department, year, password });
            savedUser = await user.save();
            if (savedUser) {
                return res.status(201).json({ message: 'User Registered' });
            }
            else {
                return res.status(422).json({ error: 'User Registration Failed' });
            }   
        }
        else if (role === 'Faculty') {
            const Array = ["001","002","003","004","005","006","007","008","009","010","011"]
            if(!Array.includes(userId)) {
                return res.status(204).json({message:"Incorrect UserId"});
            }
            const userIdExists = await Faculty.findOne({ userId });
            if(userIdExists) {
                return res.status(205).json({error: "Email Already Exists"});
            }
            const emailExists = await Faculty.findOne({ email });
            if(emailExists) {
                return res.status(203).json({error: "Email Already Exists"});
            }
            user = new Faculty({ role, firstName, lastName, userId, email, department,facultyType,password });
            savedUser = await user.save();
            if (savedUser) {
                return res.status(201).json({ message: 'User Registered' });
            }
            else {
                return res.status(422).json({ error: 'User Registration Failed' });
            }   
        }
        else if (role === 'HOD') {
            const emailExists = await HOD.findOne({ email });
            if(emailExists) {
                return res.status(203).json({error: "Email Already Exists"});
            }
            user = new HOD({ role, firstName, lastName, userId, email, department, password });
            savedUser = await user.save();
            if (savedUser) {
                return res.status(201).json({ message: 'User Registered' });
            }
            else {
                return res.status(422).json({ error: 'User Registration Failed' });
            }   
        }
        else {
            return res.status(400).json({ error: 'Invalid Data' });
        } 
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/Login',async (req, res) => {
    const { role , email, password} = req.body;
    if(!role || !email || !password) {
        return res.json({error: "All Field Is Compulsory . Please Fill all the detail"})
    }
    try {
        if(role === "Student") {
                const userlogin = await Student.findOne({email});
                if(userlogin) {
                    const ismatch = await bycrypthash.compare(password,userlogin.password);
                    const token = await userlogin.generateAuthToken();
                    // res.cookie("jwtoken",token, {
                    //     expires: new Date(Date.now() + 86400000),
                    //     httpOnly:true,
                    //     secure: true,
                    //     domain: "localhost",
                    //     path: "/",
                    //     sameSite: 'none',
                    // });
                    res.setHeader('jwtoken',token);
                    console.log(token);
                    if(ismatch) {
                        return res.status(201).json({message:token});
                    }
                    else {
                        
                        return res.status(202).json({error: "Incorrect Password"});
                    }
                }
                else {
                    console.log("Invalid Username");
                    return res.status(200).json({error: "Email does not Exist"});
                }
            
        }
        else if(role === "Faculty") {
            const userrole = await Faculty.findOne({role:role});
            if(userrole) {
                const userlogin = await Faculty.findOne({email:email});
            if(userlogin) {
                const ismatch = await bycrypthash.compare(password,userlogin.password);
                const token = await userlogin.generateAuthToken();
                
                // res.cookie("jwtoken",token, {
                //     expires: new Date(Date.now() + 86400000),
                //     httpOnly:true,
                //     secure: true,
                //     domain: "localhost",
                //     path: "/",
                //     sameSite: 'none',
                // });
                res.setHeader('jwtoken',token);

                if(ismatch) {
                    return res.status(201).json({message: "Login Successfully"});
                }
                else {
                    return res.status(422).json({error: "Invalid Credentials"});
                }
            }
            else {
                return res.status(422).json({error: "Invalid Credentials"});
            }
            }
        }
        else if(role === "HOD") {
            const userrole = await HOD.findOne({role:role});
            if(userrole) {
                const userlogin = await HOD.findOne({email:email});
                if(userlogin) {
                    const ismatch = await bycrypthash.compare(password,userlogin.password);
                    const token = await userlogin.generateAuthToken();
                    
                    // res.cookie("jwtoken",token, {
                    //     expires: new Date(Date.now() + 86400000),
                    //     httpOnly:true,
                    //     secure: true,
                    //     domain: "localhost",
                    //     path: "/",
                    //     sameSite: 'none',
                    // });
                    res.setHeader('jwtoken',token);

                    if(ismatch) {
                        return res.status(201).json({message: "Login Successfully"});
                    }
                    else {
                        return res.status(422).json({error: "Invalid Credentials"});
                    }
                }
                else {
                    return res.status(422).json({error: "Invalid Credentials"});
                }
             }
            }
            else {
                return res.status(422).json({ error: 'Invalid Data' });
            }   
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/resetPass', async(req,res) => {
    const {role, email, userId, password} = req.body;
    if(role == "Student") {
        const find = await Student.findOne({email,userId});
        if(find){
            find.password = password;
            const savedPass = await find.save();
            if(savedPass) {
                return res.status(201).json({message:'Password Changed'});
            }
        } else res.status(200).json({error:"Incorrect email and UserId"});
    }else if(role == "Faculty"){
        const find = await Faculty.findOne({email,userId});
    if(find){
        find.password = password;
        const savedPass = await find.save();
        if(savedPass) {
            return res.status(201).json({message:'Password Changed'});
        }
    } else res.status(200).json({error:"Incorrect email and UserId"});
    }else {
        const find = await HOD.findOne({email,userId});
    if(find){
        find.password = password;
        const savedPass = await find.save();
        if(savedPass) {
            return res.status(201).json({message:'Password Changed'});
        }
    }else res.status(200).json({error:"Incorrect email and UserId"});
    }
    
})

router.get('/profile', authenticate ,async (req, res) => {
    res.send(req.rootUser)
});
router.get('/dashboard', authenticate ,async (req, res) => {   
    res.send(req.rootUser)
});
router.get('/admindashboard', authenticate ,async (req, res) => {   
    res.send(req.rootUser)
});
router.get('/createevent', authenticate ,async (req, res) => {   
    res.send(req.rootUser)
});
router.get('/admindashboard/detail',authenticate,async(req,res) => {
    const studentLength = (await Student.find({})).length;
    const total = await PDF.find({});
    const facultyLength = (await Faculty.find({})).length;
    const hodLength = (await HOD.find({})).length;
    const Approved = (await PDF.find({request:"Verified"})).length;
    const Rejected = (await PDF.find({request:"Rejected"})).length;
    const data = {
        studentLength,
        Total : total.length,
        facultyLength,
        hodLength,
        Approved,
        Rejected,
    }
    return res.send(data);
});
router.get('/GetStudentData',authenticate,async(req,res) => {
    try {
        const students = await Student.find(); // Query the database to retrieve all student records
        res.json(students); // Send the students data as a JSON response
      } 
      catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching student data' });
      }
});
router.get('/GetStaffData',authenticate,async(req,res) => {
    try {
        const faculty = await Faculty.find(); // Query the database to retrieve all student records
        res.json(faculty); // Send the students data as a JSON response
      } 
      catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching student data' });
      }
});
router.get('/GetHODData',authenticate,async(req,res) => {
    try {
        const hod = await HOD.find(); // Query the database to retrieve all student records
        res.json(hod); // Send the students data as a JSON response
      } 
      catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching student data' });
      }
});
router.get('/dashboard/detail', authenticate, async (req, res) => {
    if(req.rootUser.role == "Student") {
        const userId = req.userId;
        const total = await PDF.find({userId});
        const Approved = total.filter(obj => obj.request == "Verified").length;
        const Rejected = total.filter(obj => obj.request == "Rejected").length;
    
        const data = {
            Total : total.length,
            Approved,
            Rejected,
        }
       return res.send(data);
    }else if (req.rootUser.role == "Faculty") {
        const studentLength = (await Student.find({})).length;
        const upload = await PDF.find({category:req.rootUser.facultyType})
        const Approved = upload.filter(obj => obj.request == "Approve" || obj.request == "Verified").length;
        const Rejected = upload.filter(obj => obj.request == "Rejected").length;
        const data = {
            studentLength,
            upload:upload.length,
            Approved,
            Rejected,
        }
        return res.send(data);
    }else {
        const studentLength = (await Student.find({})).length;
        const facultyLength = (await Faculty.find({})).length;
        const Approved = (await PDF.find({request:"Verified"})).length;
        const Rejected = (await PDF.find({request:"Rejected"})).length;
        const data = {
            studentLength,
            facultyLength,
            Approved,
            Rejected,
        }
        return res.send(data);
    }
   
})

router.get('/logout', async (req, res) => {
    // res.clearCookie('jwtoken',{path:'/',sameSite: 'none',});
    // res.cookie("jwtoken",null, {
    //     expires: new Date(Date.now()),
    //     httpOnly:true,
    //     secure: true,
    //     domain: "localhost",
    //     path: "/",
    //     sameSite: 'none',
    // });
    console.log("Logout");
    res.status(200).send('User Logout');
});
router.get('/adminlogout', async (req, res) => {
    // res.clearCookie('jwtoken',{path:'/',sameSite: 'none',});
    // res.cookie("jwtoken",null, {
    //     expires: new Date(Date.now()),
    //     httpOnly:true,
    //     secure: true,
    //     domain: "localhost",
    //     path: "/",
    //     sameSite: 'none',
    // });
    console.log("Logout");
    res.status(200).send('User Logout');
});
router.get('/profileimg', authenticate ,async (req, res) => {
    if(req.image && req.contentType) {
        res.contentType(req.contentType)
        res.send(req.image)
    }
});

router.post('/AdminLogin',async (req, res) => {
    const { role , email, password} = req.body;
    if(!role || !email || !password) {
        return res.json({error: "All Field Is Compulsory . Please Fill all the detail"})
    }
    try {
        const userlogin = await Admin.findOne({email});
        if(userlogin) {
                const token = await userlogin.generateAuthToken();
                // res.cookie("jwtoken",token, {
                //     expires: new Date(Date.now() + 86400000),
                //     httpOnly:true,
                //     secure: true,
                //     domain: "localhost",
                //     path: "/",
                //     sameSite: 'none',
                // });

                if(password==userlogin.password) {
                    res.setHeader('jwtoken',token);

                    return res.status(201).json({message: "Login Successfully"});
                }
                else {
                    return res.status(202).json({error: "Incorrect Password"});
                }
            }
            else {
                console.log("Invalid Username");
                return res.status(200).json({error: "Email does not Exist"});
            }
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;