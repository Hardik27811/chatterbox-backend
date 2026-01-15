const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


exports.register = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message  : "Email and password is required"
        })
    }
    const userCheck = await User.findOne({email});
    if(userCheck){
        return res.status(400).json({
            message : "User already exists"
        })
    }
    const hashPassword = await bcrypt.hash(password,10);

    const user = await User.create({ email , password:hashPassword });
    res.status(201).json({
        message : "User registered successfully"
    })
}


exports.login = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message  : "Email and password is required"
        })
    }
    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({
             message: "User not found" 
        })
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({
              message: "Invalid credentials" 
        })
    }
    const token = jwt.sign(
        {userId : user._id},
        process.env.JWT_SECRET ,
        {expiresIn : "1d"},
    )
    res.cookie("token",token,
        {
            httpOnly : true,
            secure : true,
            sameSite : none,
            maxAge : 24 * 60 * 60 * 1000
        }
    )

    res.status(200).json({
        message : "User Login sucessfully"
    })

}

