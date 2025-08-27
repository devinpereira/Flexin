import Chat from '../models/Chat.js';
import mongoose from 'mongoose';

// Create a new chat or add a message to an existing chat (POST)
export const createOrAddMessage = async (req, res) => {
	try {
		const { trainerId, userId, content } = req.body;
		if (!trainerId || !userId || !content) {
			return res.status(400).json({ message: 'trainerId, userId, and content are required.' });
		}

		let chat = await Chat.findOne({ trainerId, userId });
		if (!chat) {
			chat = new Chat({
				trainerId,
				userId,
				messages: [{ sender: userId, content }],
			});
			await chat.save();
		} else {
			chat.messages.push({ sender: userId, content });
			await chat.save();
		}
		return res.status(201).json(chat);
	} catch (error) {
		return res.status(500).json({ message: 'Error creating or adding message', error });
	}
};

// Get chat messages between a trainer and a user (GET)
export const getChat = async (req, res) => {
	try {
		const { trainerId, userId } = req.body;
		if (!trainerId || !userId) {
			return res.status(400).json({ message: 'trainerId and userId are required.' });
		}
		const chat = await Chat.findOne({ trainerId, userId });
		if (!chat) {
			return res.status(404).json({ message: 'Chat not found.' });
		}
		return res.status(200).json(chat);
	} catch (error) {
		return res.status(500).json({ message: 'Error fetching chat', error });
	}
};

// Update a specific message in a chat (PUT)
export const updateMessage = async (req, res) => {
  try {
    const { chatId, messageId, content } = req.body;
    if (!chatId || !messageId || !content) {
      return res.status(400).json({ message: 'chatId, messageId, and content are required.' });
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }
    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }
    message.content = content;
    await chat.save();
    return res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating message', error });
  }
};

// Get all chats for a trainer (GET)
export const getTrainerChats = async (req, res) => {
  try {
    const { trainerId } = req.params;
    if (!trainerId) {
      return res.status(400).json({ message: 'trainerId is required.' });
    }
    
    const chats = await Chat.find({ trainerId })
      .populate('userId', 'firstName lastName email profileImage')
      .sort({ updatedAt: -1 });
    
    // Transform the data to include last message and user info
    const chatList = chats.map(chat => {
      const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
      return {
        chatId: chat._id,
        user: chat.userId,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          timestamp: lastMessage.timestamp,
          sender: lastMessage.sender
        } : null,
        unreadCount: chat.messages.filter(msg => !msg.isRead && msg.sender.toString() === chat.userId.toString()).length,
        updatedAt: chat.updatedAt
      };
    });
    
    return res.status(200).json(chatList);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching trainer chats', error });
  }
};