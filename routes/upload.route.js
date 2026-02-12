const express = require('express');
const {protect} = require('../middlewares/auth.middleware');
const uploadController = require('../controllers/uploadController');
const upload = require('../middlewares/multer.middleware');


const router = express.Router();

router.post('/',protect, upload.array('images',5), uploadController.uploaadImage);

module.exports = router;