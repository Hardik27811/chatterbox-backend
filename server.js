require('dotenv').config(); 
const express = require("express");
const http = require('http');
// const dotenv = require('dotenv')
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser') 
const authRoute = require('./routes/auth.route');
const cors = require('cors')
const postRoute = require('./routes/post.route');
const userPoute = require('./routes/user.route');
const uploadImage = require('./routes/upload.route');
const chatRoute = require('./routes/chat.route');
const initSocket = require('./socket/socket');
// dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = initSocket(server);
app.set("io",io) // Still makes io available in routes


//middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials : true
}))
app.use(cookieParser())
app.use(express.json());


app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);
app.use('/api/users',userPoute);
app.use('/api/upload',uploadImage);
app.use('/api/chat/',chatRoute)

connectDB();

app.listen(PORT,()=>{
    console.log(`Server is runing on,${PORT}`); //3000
    
})