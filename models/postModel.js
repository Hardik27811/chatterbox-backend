const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content : {
        type : String,
        maxLength : 500,
        required : true,
    },
    image :{
        type : [String],
        default : [],
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    likes  : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
    ],
    comments:[{
        user:{
            type : mongoose.Schema.Types.ObjectId,
            ref:'User',
            required : true,
        },
        text:{
            type : String,
            maxLength : 200,
            required : true,
        },
        createdAt:{
            type: Date, 
            default: Date.now,
        }

    }],
},{ timestamps : true});

const postModel = mongoose.model("Post",postSchema);

module.exports = postModel;