const mongoose = require('mongoose')

const connectDB = async ()=>{
    try {
        await  mongoose.connect( process.env.MONGO_URI,{
            dbName : 'chatterbox'
    });
    console.log(`mongodb connected sucessfully`);
    
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }

}
module.exports = connectDB;