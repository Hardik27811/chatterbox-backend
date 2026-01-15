const express = require("express");
const userController = require("../controllers/userController")

const route = express.Router();


route.post("/auth",userController.register)


module.exports = route;