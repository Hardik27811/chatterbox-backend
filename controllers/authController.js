const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');



const cookiesOptions = {
    httpOnly : true,
    secure : true,
    sameSite : 'strict' ,
    maxAge : 24 * 60 * 60 * 1000
}


exports.register = async (req,res)=>{
    const {name, email,password} = req.body;
    if(!name ||!email || !password){
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

    const user = await User.create({ name , email , password:hashPassword });
    const token = jwt.sign(
        {userId : user._id},
        process.env.JWT_SECRET,
        {expiresIn : '1d'}
    )
    res.status(201)
    .cookie('token',token,cookiesOptions)
    .json({
        message : "User registered successfully",
        success: true,
        user: {
        id: user._id,
        name: user.name,
        email: user.email
        }
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
    res.cookie("token",token,cookiesOptions)

    res.status(200).json({
        message : "User Login sucessfully",
        success : true,
        user : {
            id : user._id,
            name : user.name,
            email : user.email
        }
    })

}


exports.logout = async(req,res)=>{
    res.clearCookie('token')
    .status(200)
    .json({
        success : true,
        message : "Logged out"
    })
}