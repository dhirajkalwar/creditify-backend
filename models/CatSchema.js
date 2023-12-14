const mongoose = require('mongoose');

const cerSchema = new mongoose.Schema({
   catName:{
    type: String,
   },
   subCat:{
    type:[String],
   }
})

const User = mongoose.model('Category', cerSchema);

module.exports = User;
