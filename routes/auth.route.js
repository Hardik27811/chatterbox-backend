const express = require("express");
const userController = require("../controllers/authController");
const {protect} = require('../middlewares/auth.middleware');
const {body} = require('express-validator')

const router = express.Router();

//validation middleware

const validateRegister = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
]



router.post("/register",  validateRegister , userController.register);

router.post("/login", validateLogin , userController.login);

router.get('/me' , protect , (req,res)=>{
    res.json({
        success : true,
        user : req.user
    })
})




module.exports = router;