const express = require('express');
const router = express.Router();
const Studend = require('../models/StudentSchema');
const Faculty = require('../models/FacultySchema');
const HOD = require('../models/HODSchema');
const multer = require('multer');
const authenticate = require('../middleware/authenticate');


const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/updatedata', upload.single('image'), authenticate , async (req, res) => {
    
    const Email = req.email;
    const {role, email, firstName, lastName, year, userId, facultyType} = req.body;
    let update;
    const updateData = {
        email,
        firstName,
        lastName,
        year,
    }

    if(req.file) {
        updateData.image = req.file.buffer;
        updateData.contentType = req.file.mimetype;
    }

    if(role == "Student") {
         update = await Studend.updateOne({email:Email},{
            $set:updateData
        });
    
       
    }else if(role == "Faculty") {
        updateData.facultyType = facultyType;
         update = await Faculty.updateOne({email:Email},{
            $set:updateData

        });
    
        
    }else {
         update = await HOD.updateOne({email:Email},{
            $set:updateData

        });
    
       
    }
    if(update) {
        console.log("Success Updated");
        return res.status(201).json({message:'Updated Successfully'});
        
        
    }else{
        console.log("error");
    }
   
});

module.exports = router;