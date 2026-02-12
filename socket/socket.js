const { Server } = require("socket.io");
const Message = require("../models/Message"); 

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["my-custom-header"],
        },
        transports: ['websocket', 'polling'], // Force these for Render compatibility
        
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join", (userId) => {
            if (userId) {
                socket.join(userId);
                console.log(`User ${userId} joined their private room`);
            }
        });

        //make this function async to use await
        socket.on("send_message", async (data) => {
          console.log("Backend received data:", data);
            const { senderId, receiverId, message } = data;

            try {
                // sAVE TO DATABASE
                const newMessage = await Message.create({
                    sender: senderId,
                    receiver: receiverId,
                    message: message
                });

                console.log("Message saved to database:", newMessage._id);

                // eMIT TO RECEIVER (using their userId as the room name)
                io.to(receiverId).emit("receive_message", {
                    senderId,
                    message,
                    createdAt: newMessage.createdAt, 
                    _id: newMessage._id
                });
            } catch (error) {
                console.error("Error saving/sending message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
    return io;
}

module.exports = initSocket;