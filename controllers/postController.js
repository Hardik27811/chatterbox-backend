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
                    .populate('likes', 'name')
                    .populate('comments.user', 'name avatar')
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
        const post = await Post.findById(req.params.postId)
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
        const userposts = await Post.find({author : req.user._id}).sort({createdAt : -1})
        .populate('author', 'name avatar')
        .populate('comments.user','name avatar')
        .populate('likes','name')
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
            _id : req.params.postId ,
            author : req.user._id,
        })

        if (!post) {
        return res.status(403).json({ message: 'Not authorized' });
        }

        post.content = req.body.content || post.content ;
        post.image = req.body.Image || post.image ;

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
        const {postId} = req.params;
        const post = await Post.findOneAndDelete({
            _id : postId,
            author : req.user._id,
        })
        if (!post) {
        return res.status(403).json({ message: 'Not authorized or post not found' });
        }
        
        res.status(200).json({
            success : true,
            message : "Post deleted successfully",
            post : post
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.likeUnlikePost = async (req,res)=>{
   try {
    const { postId } = req.params;
     const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(req.user._id)) {
      post.likes.pull(req.user._id); // 👈 unlike
    } else {
      post.likes.push(req.user._id); // 👈 like
    }

    await post.save();
    const updatedPost = await Post.findById(postId)
        .populate('author', 'name avatar')
        .populate('comments.user', 'name avatar');

    res.status(200).json({
      success: true,
      post : updatedPost,
    });
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
}

exports.addComment = async(req,res)=>{
    try {
       const { text } = req.body;
       const { postId } = req.params;
        if(!text){
            return res.status(400).json({
                success : false,
                message : "Comment is required"
        })
    }
    const post = await Post.findById(postId);
    if(!post){
        return res.status(404).json({ message: "Post not found" });
    }
    const newComment = {
        user : req.user._id,
        text : text,
    }
    post.comments.unshift(newComment);
    await post.save();
    const updatedPost = await Post.findById(postId)
    .populate('author', 'name avatar') 
            .populate('likes', 'name')       
            .populate('comments.user', 'name avatar');
    res.status(200).json({
        success : true,
        post : updatedPost,
    })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteComment = async(req,res)=>{
    try {
        const { postId, commentId } = req.params;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        const isCommentAuthor = comment.user.toString() === req.user._id.toString();
        const isPostOwner = post.author.toString() === req.user._id.toString();
        if (!isCommentAuthor && !isPostOwner) {
            return res.status(403).json({ 
                message: "You can only delete your own comments or comments on your own posts" 
            });
        }
        post.comments.pull(commentId);
        await post.save();
        const updatedPost = await Post.findById(postId)
        .populate('author', 'name avatar')
        .populate('comments.user', 'name avatar');
        res.status(200).json({ 
        success: true, 
        message: "Comment deleted successfully", 
        post: updatedPost 
    });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.editComment = async(req,res)=>{
    try {
        const {commentId , postId} = req.params;
        const {text} = req.body;
         const post = await Post.findById(postId);
        const comment = post.comments.id(commentId);
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" });
            }
        const isCommentAuthor = comment.user.toString() === req.user._id.toString();
        if(!isCommentAuthor){
            return res.status(403).json({
                 message: "You can only edit your own comments"
            })
        }
        comment.text = text || comment.text;
        await post.save();
        const updatedPost = await Post.findById(postId)
            .populate('author', 'name email')
            .populate('likes', 'name')
            .populate('comments.user', 'name avatar');
         
        res.status(200).json({
            success: true,
            message: "Comment updated",
            post: updatedPost
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    

}

exports.specificUser