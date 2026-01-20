const express = require("express");
const dotenv = require('dotenv')
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser') 
const authRoute = require('./routes/auth.route');
const cors = require('cors')
// const postRoute = require('./routes/post.route');


dotenv.config();
connectDB();


const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials : true
}))
app.use(cookieParser())
app.use(express.json());



app.use("/api/auth",authRoute);
// app.use("/post",postRoute);



app.listen(PORT,()=>{
    console.log(`Server is runing on,${PORT}`); //3000
    
})