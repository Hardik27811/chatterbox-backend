const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user._id; // from  auth middleware

        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message
        });

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user._id;

        // fetch messages between me and the other user
        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userId },
                { sender: userId, receiver: myId }
            ]
        }).sort({ createdAt: 1 }); // Oldest to newest

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const myId = req.user._id;
        
        // Find all messages where I am sender or receiver
        const messages = await Message.find({
            $or: [{ sender: myId }, { receiver: myId }]
        }).populate('sender receiver', 'name username profilePicture');

        // Extract unique users from those messages
        const users = new Map();
        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === myId.toString() 
                ? msg.receiver 
                : msg.sender;
            users.set(otherUser._id.toString(), otherUser);
        });

        res.status(200).json(Array.from(users.values()));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};