const mongoose = require('mongoose');

const cerSchema = new mongoose.Schema({
    fullName: String,
    userId: String,
    cerType:String,
    activityType: String,
    competitionLevel: String,
    position: String,
    category: String,
    categorySpecific: String, 
    request: String,
    pdf: Buffer,
    ID:Number,
})

const User = mongoose.model('Certification', cerSchema);

module.exports = User;
