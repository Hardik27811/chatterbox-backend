const express = require('express');
const postController = require('../controllers/postController');
const {protect} = require('../middlewares/auth.middleware')

const route = express.Router();

route.post('/add', protect, postController.createPost);

route.get('/getAll', protect , postController.getAllPost);

route.get('/getMyPosts', protect , postController.getMyPosts);

route.get('/:postId' , protect , postController.getPostById);

route.put('/:postId/updatePost' , protect , postController.updatePost);

route.delete('/:postId/deletePost' , protect , postController.deletePost);

route.put('/:postId/likeUnlikePost' , protect , postController.likeUnlikePost);

route.post('/:postId/addComment', protect , postController.addComment);

route.delete('/:postId/deleteComment/:commentId', protect , postController.deleteComment);

route.put('/:postId/editComment/:commentId', protect , postController.editComment);


//2728861539

module.exports = route;