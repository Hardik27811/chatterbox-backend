const Post = require('../models/postModel')



exports.createPost = async (req , res )=>{
    try {
        const {content,image} = req.body;
        if(!content){
            return res.status(400).json({
                message : "Content is required"
            })
        }
        const post = await Post.create({
            content,
            image,
            author : req.user._id
        })
        res.status(201).json({
            success : true,
            post,
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getAllPost = async(req,res)=>{
    try {
        const posts = await Post.find()
                    .populate('author','name email')
                    .populate('likes' , 'name')
                    .sort({createdAt : -1})
        if(!posts){
            return res.status(404).json({ message: 'No posts to show' });
        }
        res.status(200).json({
            success : true,
            count : posts.length,
            posts
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.getPostById = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        .populate('author' ,'name email')
        .populate('likes' , 'name');

        if(!post){
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({
            success : true,
            post
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getMyPosts = async(req,res)=>{
    try {
        const userposts = await Post.find({author : req.user._id}).sort({crearedAt : -1});
        res.status(200).json({
            success : true,
            count : userposts.length,
            userposts
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.updatePost = async (req,res)=>{
    try {
        
        const post = await Post.findOne({
            _id : req.params.id ,
            author : req.user._id,
        })

        if (!post) {
        return res.status(403).json({ message: 'Not authorized' });
        }

        post.content = req.body.content || post.content ;
        post.Image = req.body.Image || post.Image ;

        await post.save();

        res.status(200).json({
            success : true,
            post,
        })
    
                    
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deletePost = async(req,res)=>{
    try {
        const post = await Post.findOneAndDelete({
            _id : req.params.id,
            author : req.user._id,
        })
        if (!post) {
        return res.status(403).json({ message: 'Not authorized or post not found' });
        }
        res.status(200).json({
            success : true,
            message : "Post deleted successfully"
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.likeUnlikePost = async (req,res)=>{
    
}
