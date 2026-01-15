const express = require('express');
const postController = require('../controllers/postController');
const route = express.Router();

route.post('/',postController);

module.exports = route;