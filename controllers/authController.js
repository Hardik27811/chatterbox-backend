const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');



const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn : '7d'});
} 


exports.forgotPassword = async(req,res)=>{
    try {
        const {email} = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email'
            });
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
            success: false,
            message: 'Email not found'
            });
        }

        //generating token

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        //setting expire in 20. min
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpire = Date.now() + 20*60*1000;

        await user.save();
        

    } catch (error) {
        
    }
}


exports.register = async (req,res)=>{
    try {
        //chk validation errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success : false,
                errors : errors.array()
            })
        }

        const {name ,email , password} = req.body;

        //chk already a user..

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                success : false,
                message : "User already exists"
            })
        }
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password,salt);

        //create user

        const user = await User.create({
            name ,
            email,
            password
        })

        if(user){
            const token = generateToken(user._id);
            res.status(201).json({
                success : true,
                token,
                user : {
                    id : user._id,
                    email : user.email,
                    name : user.name
                }
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            message: error.message
        })
    }
}

exports.login = async (req,res)=>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(401).json({
                success : false,
                message :"lease provide email and password"
            })
        }
        const user = await User.findOne({email}).select('+password') //explicitly request password here for authentcation , it is hidden
        if(!user){
            return res.status(401).json({
                success : false,
                 message: 'Invalid credentials'
            })
        }
        
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({
                success : false,
                message: 'Invalid credentials'
            })
        }

        const token = generateToken(user._id);
        if(token){
            res.json({
                success : true,
                token,
                user : {
                    id : user._id,
                    name : user.name,
                    email : user.email
                }
            })
        }
        
    } catch (error) {
        res.status(500).json({
            success : false,
            message: 'Server error'
        })
    }
}

