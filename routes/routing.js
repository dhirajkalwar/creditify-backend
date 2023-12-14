const express = require('express');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose')
const router = express.Router();
const jwt = require('jsonwebtoken');
require('../db');
const Student = require("../models/StudentSchema");
const Faculty = require("../models/FacultySchema");
const HOD = require("../models/HODSchema");
const PDF = require('../models/CerSchema')
const bycrypthash = require('bcryptjs');
const authenticate = require('../middleware/authenticate');


router.get('/uploadcertificate', authenticate ,async (req, res) => {
    res.send(req.rootUser)
});
router.get('/creditpage', authenticate ,async (req, res) => {
    res.send(req.rootUser)
});
router.get('/facultyapproval', authenticate, async (req, res) => {
    const category = req.facultyType;
    const find = await PDF.find({category,request:"Pending"});
    res.send(find);
    res.status(200)
   
});
router.get('/studentUpload', authenticate, async(req, res) => {
    if(req.rootUser.role == "Student") {

    
    const userId = req.rootUser.userId;
    const find = await PDF.find({userId});
    res.send(find);
    }else {
        return res.status(200).json({message:"hii"});
    }
})
router.get('/hodapproval', authenticate ,async (req, res) => {
    const category = req.facultyType;
    const find = await PDF.find({request:"Approve"});
    res.send(find);
    res.status(200)

});

router.post('/getPdf', async (req, res) => {
    const ID = req.body.ID;
    const find = await PDF.findOne({ID})
    if(!find) return res.status(404) ;

    res.setHeader('Content-Type', 'application/pdf');
    res.send(find.pdf);
})

router.post('/approve', async (req, res) => {
    const ID = req.body.ID;
    const find = await PDF.findOne({ID})
    if(find.request == "Approve") {
        const update = await PDF.updateOne({ID},{
            $set:{
                request:'Verified',
            }
        })
        return res.status(200).json({message:'approved'});
    }

    const update = await PDF.updateOne({ID},{
        $set:{
            request:'Approve',
        }
    })
    res.status(200).json({message:'approved'});
});

router.post('/reject', async (req, res) => {
    const ID = req.body.ID;

    const update = await PDF.updateOne({ID},{
        $set:{
            request:'Rejected',
        }
    })
    res.status(200).json({messgae: 'Rejected'});
});

module.exports = router;