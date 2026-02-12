const User = require('../models/userModel');

exports.search = async(req,res)=>{
    try {
        const {query} = req.query;
        if(!query){
            res.status(400).json({ message: "Search query is required" });
        }
        const users = await User.find({
            $or:[//By default, MongoDB queries act like an "AND
                {name : {$regex:query , $options:'i'}}, //insensitive" flag.
                {email : {$regex : query , $options : 'i'}}
            ]
        })
        .select('name email avatar')
        .limit(10);
        res.status(200).json({ success: true, users });

    } catch (error) {
        res.status(500).json({ message: "Error searching users", error: error.message });
    }
}