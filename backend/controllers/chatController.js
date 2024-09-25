import Chat from '../models/Chat.js';

export const sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;

  try {
    const newChat = new Chat({
      senderId: req.id, // User ID from authentication middleware
      receiverId,
      message,
    });

    const savedChat = await newChat.save();
    return res.status(201).json({
      message: "Message sent successfully.",
      data: savedChat,
      success: true,
    });
  } catch (error) {
    console.error("Error sending message:", error.message);
    return res.status(500).json({
      message: "Failed to send message.",
      success: false,
    });
  }
};

export const getChatHistory = async (req, res) => {
  const { receiverId } = req.params;

  try {
    const chatHistory = await Chat.find({
      $or: [
        { senderId: req.id, receiverId },
        { senderId: receiverId, receiverId: req.id },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({
      message: "Chat history retrieved successfully.",
      data: chatHistory,
      success: true,
    });
  } catch (error) {
    console.error("Error retrieving chat history:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve chat history.",
      success: false,
    });
  }
};

export const getRecentChat = async (req, res) => {
  try {
    const recentChats = await Chat.find({
      $or: [
        { senderId: req.id },
        { receiverId: req.id },
      ],
    })
      .sort({ timestamp: -1 }) // Sort by most recent first
      .limit(10); // Limit to 10 recent chats

    return res.status(200).json({
      message: "Recent chats retrieved successfully.",
      data: recentChats,
      success: true,
    });
  } catch (error) {
    console.error("Error retrieving recent chats:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve recent chats.",
      success: false,
    });
  }
};
