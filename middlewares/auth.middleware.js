const jwt = require('jsonwebtoken')
const User = require('../models/userModel');

exports.protect = async(req ,res , next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message : "Not authenticated"
        })
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        console.log(req.user);
        
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
} 