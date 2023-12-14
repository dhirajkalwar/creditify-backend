const Student = require("../models/StudentSchema");
const Staff = require("../models/FacultySchema");
const HOD = require("../models/HODSchema");
const Admin = require("../models/AdminSchema");
const jwt = require('jsonwebtoken');
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers['jwtoken'];
        console.log(token);
        if (!token) {
            return res.status(401).send('Unauthorized: No Token Provided');
        }
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
        let rootUser = await Student.findOne({_id:verifyToken._id,"tokens.token":token});
        if (!rootUser) {
            rootUser = await Staff.findOne({_id: verifyToken._id, "tokens.token": token});
        }
        
        if (!rootUser) {
            rootUser = await HOD.findOne({_id: verifyToken._id, "tokens.token": token});
        }
        if (!rootUser) {
            rootUser = await Admin.findOne({_id: verifyToken._id, "tokens.token": token});
        }
        if(!rootUser) {
            throw new Error('User Not Found')
        }
        req.token = token;
        req.rootUser = rootUser;
        req.image = rootUser.image;
        req.facultyType = rootUser.facultyType;
        req.contentType = rootUser.contentType;
        req.userId = rootUser.userId;
        req.userID = rootUser._id;
        req.email = rootUser.email;
        next();
    }
    catch(err) {
        res.status(401).send('Unauthorized : No Token Provided');
        console.log(err);
    }
}
module.exports = authenticate;