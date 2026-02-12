const express = require('express');
const {protect} = require('../middlewares/auth.middleware')
const userController = require('../controllers/userController')
const router = express.Router();

router.post('/search', protect , userController.search)



module.exports = router;