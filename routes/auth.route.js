const express = require("express");
const userController = require("../controllers/authController")

const route = express.Router();


route.post("/register",userController.register)

route.post("/logout",userController.logout)

route.post("/login",userController.login)




module.exports = route;