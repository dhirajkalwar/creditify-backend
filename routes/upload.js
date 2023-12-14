const express = require('express');
const mongodb = require('mongodb')
const router = express.Router();
const multer = require('multer');
const PDF = require('../models/CerSchema');

const app = express();


const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/uploadCer', upload.single('pdf'), async(req, res) => {
    if(!req.file) {
        return res.status(203).json({error:'Upload Certificate'});
    }

    const { fullName, userId, cerType, activityType, competitionLevel, position, category, categorySpecific } = req.body;
    const request = 'Pending';
    let ID;
    const check = await PDF.findOne({ID:0});
    if(check) {
        const length = await PDF.find({});
         ID = length.length;
    }else {
         ID = 0;
    }

    const pdfUpload = new PDF({
        fullName,
        userId,
        cerType, 
        activityType, 
        competitionLevel, 
        position, 
        category, 
        categorySpecific, 
        request,
        pdf: req.file.buffer,
        ID,
    });

  const save =  await pdfUpload.save();
    if(save) {
        console.log("success");
        return  res.status(200).json({ message: 'Uploaded Successful' });
    }

})



module.exports = router;