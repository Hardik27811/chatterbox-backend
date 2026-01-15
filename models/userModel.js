const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required :  true,
        trim: true,
    },

    email : {
        type : String,
        unique : true,
        required : true,
        lowercase: true,
    },

    password : {
        type : String,
        required: true,
    },

    avatar : {
        type : String,
        default: "",
    },

    bio: {
      type: String,
      maxLength: 150,
      default : "",
    },

},{timestamps : true});

const userModel =  mongoose.model("User",userSchema);

module.exports = userModel;
