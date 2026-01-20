const express = require('express');
const postController = require('../controllers/postController');
const protect = require('../middlewares/auth.middleware')

const route = express.Router();

route.post('/', protect, postController.createPost);

route.get('/', protect , postController.getAllPost);

route.get('/me', protect , postController.getMyPosts);

route.get('/:id' , protect , postController);

route.put('/:id' , protect , postController.updatePost);

route.delete('/:id' , protect , postController.deletePost);

route.likeUnlikePost('/:id' , protect , postController.likeUnlikePost);


module.exports = route;