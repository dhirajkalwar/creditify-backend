const express =require("express");
const router = express.Router();
const Category = require('../models/CatSchema');

router.post('/api/addsubCat', async (req, res) => {
    console.log(req.body);
    const {catName, subCat} = req.body;

    const find = await Category.findOne({catName});
    if(find) {
            find.subCat.push(subCat);
        

        const save = await find.save();
        if(save) {
            console.log("Success");
            return res.status(200).json({message:'OK'})
        }
       
    }
    return res.status(201).json({message:'error'})


})

router.post('/api/addCat', async (req, res) => {
    const { catName} = req.body;
    const find = await Category.findOne({catName})
    if(!find) {
        const create = new Category({
            catName,
            subCat:[],
        })
        const save = await create.save();
        if(save ) {
            return res.status(200).json({message:"Ok"});
        }
    
    }

    return res.status(201).json({message:'error'});
})

router.get('/api/getCat', async (req,res) => {
    const find = await Category.find({});
    res.send(find);
})

module.exports = router;