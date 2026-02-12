const multer = require('multer');

const storage = multer.memoryStorage(); //use memory storage because we are streaming directly to Cloudinary
// without saving the file to our local server disk first.
const upload = multer({
    storage : storage,
    limits : {
        fileSize : 10*1024*1024
    }
})
module.exports = upload;